import {
	forceCollide,
	forceLink,
	forceManyBody,
	forceSimulation,
	forceX,
	forceY,
	type SimulationLinkDatum,
	type SimulationNodeDatum,
} from 'd3-force'
import { Position } from 'reactflow'

import type { FlowEdge, FlowNode } from './page_component'

// Estimated node dimensions based on custom node structure
// These are reasonable defaults that work for most nodes
const DEFAULT_NODE_WIDTH = 280
const DEFAULT_NODE_HEIGHT = 200
const DEFAULT_LINK_DISTANCE = 240
const DEFAULT_ITERATIONS = 90
const DEFAULT_CHARGE_STRENGTH = -320
const COLLISION_PADDING = 28
const LAYOUT_PADDING = 40

// Calculate estimated node height based on content
function estimateNodeHeight(node: FlowNode): number {
	const data = node.data
	let height = 80 // Base height (header + padding)

	// Add height for description
	if (data.description) {
		height += 40
	}

	// Add height for parameters
	if (data.parameters && data.parameters.length > 0) {
		height += data.parameters.length * 40
	}

	// Add height for inputs/outputs
	const maxPorts = Math.max(data.inputs?.length ?? 0, data.outputs?.length ?? 0)
	if (maxPorts > 0) {
		height += maxPorts * 40 + 20 // Ports + spacing
	}

	return Math.max(height, DEFAULT_NODE_HEIGHT)
}

// Calculate estimated node width based on content
function estimateNodeWidth(node: FlowNode): number {
	const data = node.data
	const baseWidth = DEFAULT_NODE_WIDTH
	const lines: string[] = []

	if (data.title) lines.push(data.title)
	if (data.status) lines.push(data.status)
	if (data.description) lines.push(data.description)

	data.parameters?.forEach(param => {
		if (param.label) lines.push(param.label)
		if (typeof param.value === 'string') lines.push(param.value)
	})

	data.inputs?.forEach(port => {
		lines.push([port.label, port.description].filter(Boolean).join(' '))
	})
	data.outputs?.forEach(port => {
		lines.push([port.label, port.description].filter(Boolean).join(' '))
	})

	const maxLineLength =
		lines.length > 0
			? lines.reduce((max, line) => Math.max(max, line.length), 0)
			: 0

	// Rough text width estimate using average character width
	const textWidth = 200 + maxLineLength * 7.5

	// Account for two-column port layout so ports don't collide
	const hasDualColumns =
		(data.inputs?.length ?? 0) > 0 && (data.outputs?.length ?? 0) > 0
	const dualColumnPadding = hasDualColumns ? 80 : 0

	// Slightly widen nodes with many parameters/ports to reduce overlap
	const maxParams = data.parameters?.length ?? 0
	const maxPorts = Math.max(data.inputs?.length ?? 0, data.outputs?.length ?? 0)
	const densityBoost = Math.max(0, (maxParams - 2) * 12 + (maxPorts - 3) * 10)

	const computedWidth = Math.min(
		760,
		Math.max(baseWidth, textWidth + dualColumnPadding + densityBoost),
	)

	return computedWidth
}

export type LayoutDirection = 'TB' | 'LR' | 'BT' | 'RL'

interface LayoutOptions {
	direction?: LayoutDirection
	nodeWidth?: number
	nodeHeight?: number
	nodeSpacing?: { x?: number; y?: number }
	iterations?: number
	seed?: number
	linkDistance?: number
	chargeStrength?: number
}

type SimulationNode = FlowNode &
	SimulationNodeDatum & {
		width: number
		height: number
		level: number
		rowIndex: number
		baseX: number
		baseY: number
	}

function createSeededRandom(seed: number) {
	// Keep positions consistent between renders
	let value = seed || 1
	return () => {
		value |= 0
		value = (value + 0x6d2b79f5) | 0
		let t = Math.imul(value ^ (value >>> 15), 1 | value)
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296
	}
}

function calculateLevels(nodes: FlowNode[], edges: FlowEdge[]) {
	// Give each node a lane: sources start at 0, children sit one lane over
	const levels = new Map<string, number>()
	const incomingCounts = new Map<string, number>()
	const adjacency = new Map<string, string[]>()

	nodes.forEach(node => {
		incomingCounts.set(node.id, 0)
		adjacency.set(node.id, [])
	})

	edges.forEach(edge => {
		incomingCounts.set(edge.target, (incomingCounts.get(edge.target) ?? 0) + 1)
		adjacency.get(edge.source)?.push(edge.target)
	})

	const queue: Array<{ id: string; level: number }> = []
	nodes.forEach(node => {
		if ((incomingCounts.get(node.id) ?? 0) === 0) {
			queue.push({ id: node.id, level: 0 })
			levels.set(node.id, 0)
		}
	})

	while (queue.length > 0) {
		const current = queue.shift()
		if (!current) continue

		const nextLevel = current.level + 1
		for (const neighbor of adjacency.get(current.id) ?? []) {
			if (!levels.has(neighbor) || nextLevel > (levels.get(neighbor) ?? 0)) {
				levels.set(neighbor, nextLevel)
				queue.push({ id: neighbor, level: nextLevel })
			}
		}
	}

	// Handle cycles by placing unvisited nodes on the first lane
	nodes.forEach(node => {
		if (!levels.has(node.id)) {
			levels.set(node.id, 0)
		}
	})

	return levels
}

function computeBasePositions(
	nodes: FlowNode[],
	edges: FlowEdge[],
	levels: Map<string, number>,
	isHorizontal: boolean,
	spacing: { x: number; y: number },
	direction: LayoutDirection,
) {
	// Build a quick grid before spacing things out
	const nodesByLevel = new Map<number, FlowNode[]>()
	nodes.forEach(node => {
		const level = levels.get(node.id) ?? 0
		const group = nodesByLevel.get(level) ?? []
		group.push(node)
		nodesByLevel.set(level, group)
	})

	const sortedLevels = [...nodesByLevel.keys()].sort((a, b) => a - b)
	const basePositions = new Map<
		string,
		{ baseX: number; baseY: number; rowIndex: number }
	>()

	const primarySign = direction === 'RL' || direction === 'BT' ? -1 : 1

	for (const level of sortedLevels) {
		const group = nodesByLevel.get(level) ?? []
		const ordered =
			level === 0
				? group
				: [...group].sort((a, b) => {
						const aParents = edges
							.filter(edge => edge.target === a.id)
							.map(edge => basePositions.get(edge.source)?.baseY)
							.filter((y): y is number => y !== undefined)
						const bParents = edges
							.filter(edge => edge.target === b.id)
							.map(edge => basePositions.get(edge.source)?.baseY)
							.filter((y): y is number => y !== undefined)

						const aMean =
							aParents.length > 0
								? aParents.reduce((sum, val) => sum + val, 0) / aParents.length
								: Number.POSITIVE_INFINITY
						const bMean =
							bParents.length > 0
								? bParents.reduce((sum, val) => sum + val, 0) / bParents.length
								: Number.POSITIVE_INFINITY

						if (aMean !== bMean) return aMean - bMean
						return a.id.localeCompare(b.id)
					})
		let lastSecondary = Number.NEGATIVE_INFINITY

		ordered.forEach((node, index) => {
			const parentSecondaryPositions = edges
				.filter(edge => edge.target === node.id)
				.map(edge =>
					isHorizontal
						? basePositions.get(edge.source)?.baseY
						: basePositions.get(edge.source)?.baseX,
				)
				.filter((value): value is number => typeof value === 'number')

			// Stay roughly aligned with parents but leave breathing room between siblings
			const secondarySpacing = isHorizontal ? spacing.y : spacing.x
			const preferredSecondary =
				parentSecondaryPositions.length > 0
					? parentSecondaryPositions.reduce((sum, val) => sum + val, 0) /
						parentSecondaryPositions.length
					: index * secondarySpacing

			const secondary =
				lastSecondary === Number.NEGATIVE_INFINITY
					? preferredSecondary
					: Math.max(preferredSecondary, lastSecondary + secondarySpacing)

			const primary =
				primarySign * level * (isHorizontal ? spacing.x : spacing.y)

			const baseX = isHorizontal ? primary : secondary
			const baseY = isHorizontal ? secondary : primary

			basePositions.set(node.id, { baseX, baseY, rowIndex: index })
			lastSecondary = secondary
		})
	}

	return basePositions
}

export function getLayoutedElements(
	nodes: FlowNode[],
	edges: FlowEdge[],
	options: LayoutOptions = {},
): { nodes: FlowNode[]; edges: FlowEdge[] } {
	const { direction = 'LR', nodeSpacing = {} } = options

	const estimatedWidths = nodes.map(
		node => options.nodeWidth ?? estimateNodeWidth(node),
	)
	const estimatedHeights = nodes.map(
		node => options.nodeHeight ?? estimateNodeHeight(node),
	)

	const maxWidth =
		estimatedWidths.length > 0
			? Math.max(...estimatedWidths)
			: DEFAULT_NODE_WIDTH
	const maxHeight =
		estimatedHeights.length > 0
			? Math.max(...estimatedHeights)
			: DEFAULT_NODE_HEIGHT

	const minSpacingX = maxWidth + COLLISION_PADDING * 2 + 12
	const minSpacingY = maxHeight + COLLISION_PADDING * 2 + 12

	// Default is left-to-right; spacing scales up when nodes are wide
	const isHorizontal = direction === 'LR' || direction === 'RL'
	const spacing = {
		x: Math.max(nodeSpacing.x ?? 300, minSpacingX),
		y: Math.max(nodeSpacing.y ?? 180, minSpacingY),
	}
	const seed = options.seed ?? nodes.length * 17 + edges.length * 31

	const levels = calculateLevels(nodes, edges)
	const basePositions = computeBasePositions(
		nodes,
		edges,
		levels,
		isHorizontal,
		spacing,
		direction,
	)
	const simulationNodes: SimulationNode[] = nodes.map(node => {
		const basePosition = basePositions.get(node.id) ?? {
			baseX: 0,
			baseY: 0,
			rowIndex: 0,
		}

		const width = options.nodeWidth ?? estimateNodeWidth(node)
		const height = options.nodeHeight ?? estimateNodeHeight(node)
		const level = levels.get(node.id) ?? 0

		const seededNode: SimulationNode = {
			...node,
			width,
			height,
			level,
			rowIndex: basePosition.rowIndex,
			baseX: basePosition.baseX,
			baseY: basePosition.baseY,
			x: basePosition.baseX,
			y: basePosition.baseY,
		}

		// Hold one axis steady so we only nudge nodes on the other
		if (isHorizontal) {
			seededNode.fx = basePosition.baseX
		} else {
			seededNode.fy = basePosition.baseY
		}

		return seededNode
	})
	const simulationEdges: SimulationLinkDatum<SimulationNode>[] = edges.map(
		edge => ({
			source: edge.source,
			target: edge.target,
		}),
	)

	const simulation = forceSimulation<SimulationNode>(simulationNodes)
		.randomSource(createSeededRandom(seed))
		.force(
			'link',
			forceLink<SimulationNode, SimulationLinkDatum<SimulationNode>>(
				simulationEdges,
			)
				.id(node => node.id)
				.distance(options.linkDistance ?? DEFAULT_LINK_DISTANCE)
				.strength(0.9),
		)
		.force(
			'charge',
			forceManyBody().strength(
				options.chargeStrength ?? DEFAULT_CHARGE_STRENGTH,
			),
		)
		.force(
			'collision',
			forceCollide<SimulationNode>()
				.radius(
					node => Math.max(node.width, node.height) / 2 + COLLISION_PADDING,
				)
				.strength(0.95)
				.iterations(2),
		)
		.alpha(1)
		.alphaDecay(0.08)
		.velocityDecay(0.4)

	const axisForce = isHorizontal
		? forceX<SimulationNode>(node => node.baseX).strength(1.2)
		: forceY<SimulationNode>(node => node.baseY).strength(1.2)

	const laneForce = isHorizontal
		? forceY<SimulationNode>(node => node.baseY).strength(0.9)
		: forceX<SimulationNode>(node => node.baseX).strength(0.9)

	// Axis keeps columns/rows aligned; lane keeps siblings stacked
	simulation.force('axis', axisForce)
	simulation.force('lane', laneForce)

	simulation.stop()
	const iterations = options.iterations ?? DEFAULT_ITERATIONS
	for (let i = 0; i < iterations; i += 1) {
		simulation.tick()
	}

	const minX = Math.min(...simulationNodes.map(node => node.x ?? 0))
	const minY = Math.min(...simulationNodes.map(node => node.y ?? 0))

	const layoutedNodes: FlowNode[] = simulationNodes.map(simNode => {
		const {
			width,
			height,
			level,
			rowIndex,
			vx,
			vy,
			fx,
			fy,
			index,
			x,
			y,
			...node
		} = simNode

		const position = {
			x: (x ?? 0) - minX + LAYOUT_PADDING,
			y: (y ?? 0) - minY + LAYOUT_PADDING,
		}

		const targetPosition: Position = isHorizontal ? Position.Left : Position.Top
		const sourcePosition: Position = isHorizontal
			? Position.Right
			: Position.Bottom

		return {
			...node,
			position,
			targetPosition,
			sourcePosition,
		}
	})

	return {
		nodes: layoutedNodes,
		edges,
	}
}

export function calculateLayoutBounds(
	nodes: FlowNode[],
	options: LayoutOptions = {},
): { width: number; height: number } {
	if (nodes.length === 0) {
		return { width: 0, height: 0 }
	}

	// Rough canvas size based on laid-out node boxes
	let maxX = 0
	let maxY = 0

	nodes.forEach(node => {
		const width = options.nodeWidth ?? estimateNodeWidth(node)
		const height = options.nodeHeight ?? estimateNodeHeight(node)
		maxX = Math.max(maxX, (node.position?.x ?? 0) + width)
		maxY = Math.max(maxY, (node.position?.y ?? 0) + height)
	})

	return { width: maxX + LAYOUT_PADDING, height: maxY + LAYOUT_PADDING }
}
