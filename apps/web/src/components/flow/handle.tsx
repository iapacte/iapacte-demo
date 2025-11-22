import type { CSSProperties, ReactNode } from 'react'
import { type HandleProps, Handle as RFHandle } from 'reactflow'

type HandleStyle = CSSProperties & {
	['--handle-color']?: string
}

interface Props extends HandleProps {
	accentColor?: string
	children?: ReactNode
	className?: string
	style?: CSSProperties
}

export function Handle({
	accentColor,
	className,
	children,
	style,
	...rest
}: Props) {
	// Let callers override the color; fall back to theme primary
	const resolvedColor =
		accentColor ??
		(style as HandleStyle | undefined)?.['--handle-color'] ??
		'var(--primary)'
	const mergedStyle: HandleStyle = {
		...(style as CSSProperties),
		['--handle-color']: resolvedColor,
	}

	return (
		<RFHandle
			className={[
				'group/handle relative h-0 w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40',
				className,
			]
				.filter(Boolean)
				.join(' ')}
			style={mergedStyle}
			{...rest}
		>
			<span
				className='pointer-events-none absolute -top-2 -start-2 inline-flex h-4 w-4 items-center justify-center rounded-full transition duration-150 group-hover/handle:scale-110'
				style={{
					border: '1px solid var(--handle-color)',
					backgroundColor: 'var(--surface)',
					boxShadow:
						'0 0 0 2px var(--surface), 0 0 10px -2px var(--handle-color)',
				}}
				aria-hidden
			>
				<span
					className='inline-block h-2.5 w-2.5 rounded-full'
					style={{ backgroundColor: 'var(--handle-color)' }}
					aria-hidden
				/>
			</span>
			{children}
		</RFHandle>
	)
}

export default Handle
