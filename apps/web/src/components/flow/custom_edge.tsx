import { BaseEdge, type EdgeProps, getBezierPath } from 'reactflow'

type CustomEdgeData = {
	accentColor?: string
}

export function CustomEdge(props: EdgeProps<CustomEdgeData>) {
	const {
		id,
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
		markerEnd,
		data,
	} = props
	const accentColor = data?.accentColor
	const [edgePath] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	})

	return (
		<BaseEdge
			id={id}
			path={edgePath}
			markerEnd={markerEnd}
			style={{ stroke: accentColor ?? 'var(--outline)', strokeWidth: 2 }}
		/>
	)
}

export default CustomEdge
