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
				className='fill-none stroke-primary stroke-2 [stroke-dasharray:8]'
				d={path}
			/>
		</g>
	)
}

export default ConnectionLine
