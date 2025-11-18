import { useCallback, useEffect, useMemo, useState } from 'react'
import 'reactflow/dist/style.css'
import {
	addEdge,
	Background,
	type Connection,
	type Edge,
	MiniMap,
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
					color: 'var(--md3-sys-color-secondary)',
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
			accentColor: 'var(--md3-sys-color-tertiary)',
			inputs: [
				{
					id: 'embedding-input-documents',
					label: 'Documents',
					color: 'var(--md3-sys-color-secondary)',
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
					color: 'var(--md3-sys-color-primary)',
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
			accentColor: 'var(--md3-sys-color-secondary)',
			inputs: [
				{
					id: 'qa-input-vector',
					label: 'Vectors',
					color: 'var(--md3-sys-color-primary)',
				},
				{
					id: 'qa-input-question',
					label: 'Question',
					color: 'var(--md3-sys-color-secondary)',
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
					color: 'var(--md3-sys-color-tertiary)',
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
			accentColor: 'var(--md3-sys-color-secondary)',
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
					color: 'var(--md3-sys-color-secondary)',
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
		data: { accentColor: 'var(--md3-sys-color-secondary)' },
	},
	{
		id: 'edge-embedding-qa',
		source: 'embedding',
		sourceHandle: 'embedding-output-vector',
		target: 'qa',
		targetHandle: 'qa-input-vector',
		type: 'custom',
		data: { accentColor: 'var(--md3-sys-color-primary)' },
	},
	{
		id: 'edge-prompt-qa',
		source: 'prompt',
		sourceHandle: 'prompt-output-question',
		target: 'qa',
		targetHandle: 'qa-input-question',
		type: 'custom',
		data: { accentColor: 'var(--md3-sys-color-secondary)' },
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

	const memoizedNodes = useMemo<FlowNode[]>(
		() => cloneData(initialNodes),
		[initialNodes],
	)
	const memoizedEdges = useMemo<FlowEdge[]>(
		() => cloneData(initialEdges),
		[initialEdges],
	)

	const [nodes, setNodes, onNodesChange] =
		useNodesState<NodeData>(memoizedNodes)
	const [edges, setEdges, onEdgesChange] =
		useEdgesState<EdgeData>(memoizedEdges)

	useEffect(() => {
		setNodes(cloneData(initialNodes))
	}, [initialNodes, setNodes])

	useEffect(() => {
		setEdges(cloneData(initialEdges))
	}, [initialEdges, setEdges])

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
		(connection: Connection) =>
			setEdges(current =>
				addEdge(
					{
						...connection,
						type: 'custom',
						data: { accentColor: 'var(--primary)' },
					},
					current,
				),
			),
		[setEdges],
	)

	const handleDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault()
			if (!reactFlowInstance) return

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
					accentColor: 'var(--md3-sys-color-tertiary)',
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

	return (
		<div className='grid h-screen w-full grid-rows-[auto_1fr] bg-surface text-on-surface'>
			<div
				className='grid grid-cols-[1fr_auto_1fr] items-center gap-md border-b border-outline-variant bg-surface px-lg py-sm'
				role='toolbar'
				aria-label='Flow toolbar'
			>
				<div className='min-h-8' />
				<div className='min-h-8' />
				<div className='min-h-8' />
			</div>
			<div className='relative h-full w-full' style={backgroundVars}>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
					defaultEdgeOptions={{ type: 'custom' }}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					onInit={(instance: ReactFlowInstance) =>
						setReactFlowInstance(instance)
					}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					connectionLineComponent={ConnectionLine}
					proOptions={{ hideAttribution: true }}
					fitView
					className='h-full w-full'
				>
					<Background
						id='dashboard-flow-background'
						gap={20}
						size={1}
						color='var(--rf-background-dot-color)'
						style={{ backgroundColor: 'var(--rf-background-color)' }}
					/>
					<MiniMap pannable zoomable />
					<CanvasControls />
				</ReactFlow>
			</div>
		</div>
	)
}

export default PageComponent
