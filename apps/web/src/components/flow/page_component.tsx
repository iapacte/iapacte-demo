import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import 'reactflow/dist/style.css'
import {
	addEdge,
	Background,
	type Connection,
	type Edge,
	type Node,
	ReactFlow,
	type ReactFlowInstance,
	useEdgesState,
	useNodesState,
} from 'reactflow'

import { useThemePreference } from '~hooks'
import CanvasControls from './canvas_controls'
import ConnectionLine from './connection_line'
import CustomEdge from './custom_edge'
import CustomNode, { type CustomNodeData } from './custom_node'
import { calculateLayoutBounds, getLayoutedElements } from './layout'

type NodeData = CustomNodeData
type EdgeData = { accentColor?: string }

export type FlowNode = Node<NodeData>
export type FlowEdge = Edge<EdgeData>

const nodeTypes = { custom: CustomNode }
const edgeTypes = { custom: CustomEdge }

const DEFAULT_NODES: FlowNode[] = [
	{
		id: 'loader',
		type: 'custom',
		position: { x: 96, y: 144 },
		data: {
			title: 'Document Loader',
			icon: '📚',
			status: 'Ready',
			description: 'Fetches council documentation from shared repositories.',
			accentColor: 'var(--primary)',
			parameters: [
				{
					id: 'loader-url',
					label: 'Endpoint',
					type: 'str',
					value: 'https://city.gov/api/agendas',
				},
				{
					id: 'loader-attachments',
					label: 'Include attachments',
					type: 'bool',
					value: true,
				},
			],
			outputs: [
				{
					id: 'loader-output-documents',
					label: 'Documents',
					color: 'var(--secondary)',
				},
			],
		},
	},
	{
		id: 'embedding',
		type: 'custom',
		position: { x: 404, y: 168 },
		data: {
			title: 'Embedding Builder',
			icon: '🧠',
			status: 'Idle',
			description:
				'Generates civic-focused embeddings to power semantic search.',
			accentColor: 'var(--tertiary)',
			inputs: [
				{
					id: 'embedding-input-documents',
					label: 'Documents',
					color: 'var(--secondary)',
				},
			],
			parameters: [
				{
					id: 'embedding-model',
					label: 'Model',
					type: 'str',
					value: 'civic-text-embed',
				},
				{ id: 'embedding-dim', label: 'Dimensions', type: 'int', value: 1536 },
				{
					id: 'embedding-normalize',
					label: 'Normalize',
					type: 'bool',
					value: true,
				},
			],
			outputs: [
				{
					id: 'embedding-output-vector',
					label: 'Vectors',
					color: 'var(--primary)',
				},
			],
		},
	},
	{
		id: 'qa',
		type: 'custom',
		position: { x: 708, y: 128 },
		data: {
			title: 'Answer Composer',
			icon: '🏛️',
			status: 'Awaiting prompt',
			description: 'Delivers contextual answers for councillors and citizens.',
			accentColor: 'var(--secondary)',
			inputs: [
				{
					id: 'qa-input-vector',
					label: 'Vectors',
					color: 'var(--primary)',
				},
				{
					id: 'qa-input-question',
					label: 'Question',
					color: 'var(--secondary)',
				},
			],
			parameters: [
				{ id: 'qa-temperature', label: 'Temperature', type: 'int', value: 0.2 },
				{ id: 'qa-language', label: 'Language', type: 'str', value: 'Catalan' },
				{ id: 'qa-stream', label: 'Streaming', type: 'bool', value: false },
			],
			outputs: [
				{
					id: 'qa-output-answer',
					label: 'Answer',
					color: 'var(--tertiary)',
				},
			],
		},
	},
	{
		id: 'prompt',
		type: 'custom',
		position: { x: 120, y: 344 },
		data: {
			title: 'Citizen Prompt',
			icon: '💬',
			status: 'Live input',
			accentColor: 'var(--secondary)',
			parameters: [
				{
					id: 'prompt-template',
					label: 'Prompt template',
					type: 'prompt',
					value: 'Ask about upcoming council meetings in plain language.',
				},
			],
			outputs: [
				{
					id: 'prompt-output-question',
					label: 'Question',
					color: 'var(--secondary)',
				},
			],
		},
	},
]

const DEFAULT_EDGES: FlowEdge[] = [
	{
		id: 'edge-loader-embedding',
		source: 'loader',
		sourceHandle: 'loader-output-documents',
		target: 'embedding',
		targetHandle: 'embedding-input-documents',
		type: 'custom',
		animated: true,
		data: { accentColor: 'var(--secondary)' },
	},
	{
		id: 'edge-embedding-qa',
		source: 'embedding',
		sourceHandle: 'embedding-output-vector',
		target: 'qa',
		targetHandle: 'qa-input-vector',
		type: 'custom',
		data: { accentColor: 'var(--primary)' },
	},
	{
		id: 'edge-prompt-qa',
		source: 'prompt',
		sourceHandle: 'prompt-output-question',
		target: 'qa',
		targetHandle: 'qa-input-question',
		type: 'custom',
		data: { accentColor: 'var(--secondary)' },
	},
]

interface PageComponentProps {
	initialNodes?: FlowNode[]
	initialEdges?: FlowEdge[]
}

const cloneData = <T,>(value: T): T => {
	if (typeof structuredClone === 'function') {
		return structuredClone(value)
	}
	return JSON.parse(JSON.stringify(value))
}

export function PageComponent({
	initialNodes = DEFAULT_NODES,
	initialEdges = DEFAULT_EDGES,
}: PageComponentProps) {
	const { isDark } = useThemePreference()
	const [reactFlowInstance, setReactFlowInstance] =
		useState<ReactFlowInstance | null>(null)
	const flowWrapperRef = useRef<HTMLDivElement | null>(null)
	const [flowHeight, setFlowHeight] = useState<number | null>(null)
	const [isFullscreen, setIsFullscreen] = useState(false)

	const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(
		cloneData(initialNodes),
	)
	const [edges, setEdges, onEdgesChange] = useEdgesState<EdgeData>(
		cloneData(initialEdges),
	)

	useEffect(() => {
		// Auto-layout and fit the graph whenever the source data changes
		const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
			cloneData(initialNodes),
			cloneData(initialEdges),
			{
				direction: 'LR',
				nodeSpacing: { x: 150, y: 100 },
			},
		)
		setNodes(layoutedNodes)
		setEdges(layoutedEdges)
		const { height } = calculateLayoutBounds(layoutedNodes)
		setFlowHeight(Math.max(height + 64, 420))

		if (reactFlowInstance) {
			setTimeout(() => {
				reactFlowInstance.fitView({ padding: 0.2, duration: 300 })
			}, 0)
		}
	}, [initialNodes, initialEdges, reactFlowInstance, setEdges, setNodes])

	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(Boolean(document.fullscreenElement))
		}
		document.addEventListener('fullscreenchange', handleFullscreenChange)
		return () =>
			document.removeEventListener('fullscreenchange', handleFullscreenChange)
	}, [])

	const backgroundVars = useMemo(
		() => ({
			['--flow-background-color' as any]: isDark
				? 'var(--surface-container)'
				: 'var(--surface)',
			['--flow-dot-color' as any]: 'var(--outline-variant)',
		}),
		[isDark],
	)

	const onConnect = useCallback(
		(connection: Connection) => {
			// React Flow gives us a draft edge; we wrap it with our style
			const newEdges = addEdge(
				{
					...connection,
					type: 'custom',
					data: { accentColor: 'var(--primary)' },
				},
				edges,
			)
			setEdges(newEdges)
		},
		[edges, setEdges],
	)

	const handleDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault()
			if (!reactFlowInstance) return

			// Convert screen coords to canvas coords so dropped nodes land where expected
			const position = reactFlowInstance.screenToFlowPosition({
				x: event.clientX,
				y: event.clientY,
			})

			const nodeId = `draft-${Date.now()}`
			const newNode: FlowNode = {
				id: nodeId,
				type: 'custom',
				position,
				data: {
					title: 'Draft Component',
					icon: '✨',
					status: 'Sketch',
					accentColor: 'var(--tertiary)',
					parameters: [
						{
							id: `${nodeId}-note`,
							label: 'Summary',
							type: 'str',
							placeholder: 'Describe this step…',
						},
					],
				},
			}

			setNodes(current => current.concat(newNode))
		},
		[reactFlowInstance, setNodes],
	)

	const handleDragOver = useCallback((event: React.DragEvent) => {
		event.preventDefault()
		event.dataTransfer.dropEffect = 'copy'
	}, [])

	const handleLayoutAndFit = useCallback(() => {
		// Relayout current graph (useful after edits) and refit the viewport
		const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
			cloneData(nodes),
			cloneData(edges),
			{
				direction: 'LR',
				nodeSpacing: { x: 150, y: 100 },
			},
		)
		setNodes(layoutedNodes)
		setEdges(layoutedEdges)
		const { height } = calculateLayoutBounds(layoutedNodes)
		setFlowHeight(Math.max(height + 64, 420))
		if (reactFlowInstance) {
			reactFlowInstance.fitView({ padding: 0.24, duration: 200 })
		}
	}, [edges, nodes, reactFlowInstance, setEdges, setNodes])

	const computedHeight = isFullscreen ? '100vh' : `${flowHeight ?? 520}px`

	const handleFullscreenToggle = useCallback(() => {
		if (isFullscreen) {
			document.exitFullscreen().catch(() => undefined)
			return
		}
		if (flowWrapperRef.current?.requestFullscreen) {
			flowWrapperRef.current.requestFullscreen().catch(() => undefined)
		}
	}, [isFullscreen])

	return (
		<div
			className='grid w-full grid-rows-[1fr] bg-[var(--surface)] text-[var(--on-surface)]'
			style={{ height: computedHeight }}
		>
			<div
				className='relative h-full w-full'
				ref={flowWrapperRef}
				style={{ ...backgroundVars, minHeight: '360px' }}
			>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
					defaultEdgeOptions={{ type: 'custom' }}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					onInit={(instance: ReactFlowInstance) => {
						setReactFlowInstance(instance)
						// Fit view after layout is applied
						setTimeout(() => {
							instance.fitView({ padding: 0.2, duration: 0 })
						}, 0)
					}}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					connectionLineComponent={ConnectionLine}
					proOptions={{ hideAttribution: true }}
					className='h-full w-full'
				>
					<Background
						id='dashboard-flow-background'
						gap={20}
						size={1}
						color='var(--rf-background-dot-color)'
						style={{ backgroundColor: 'var(--rf-background-color)' }}
					/>
					<CanvasControls
						onFit={handleLayoutAndFit}
						onFullscreen={handleFullscreenToggle}
					/>
				</ReactFlow>
			</div>
		</div>
	)
}

export default PageComponent
