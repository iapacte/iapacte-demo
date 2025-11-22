import { type ConnectionLineComponentProps, getBezierPath } from 'reactflow'

export function ConnectionLine({
	fromX,
	fromY,
	toX,
	toY,
	fromPosition,
	toPosition,
}: ConnectionLineComponentProps) {
	const [path] = getBezierPath({
		sourceX: fromX,
		sourceY: fromY,
		targetX: toX,
		targetY: toY,
		sourcePosition: fromPosition,
		targetPosition: toPosition,
	})

	return (
		<g className='pointer-events-none' aria-hidden>
			<path
				// Preview edge so users see where a new connection will land
				className='fill-none stroke-2 [stroke-dasharray:8]'
				style={{ stroke: 'var(--primary)' }}
				d={path}
			/>
		</g>
	)
}

export default ConnectionLine
