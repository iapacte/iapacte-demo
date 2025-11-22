import { Toolbar } from '@base-ui-components/react/toolbar'
import { Panel, useReactFlow } from 'reactflow'

type CanvasControlsProps = {
	onFit?: () => void
	onFullscreen?: () => void
}

export function CanvasControls({ onFit, onFullscreen }: CanvasControlsProps) {
	const { zoomIn, zoomOut, fitView } = useReactFlow()

	const handleFit = () => {
		// Parent can hook in to re-run layout before fitting
		if (onFit) {
			onFit()
			return
		}
		fitView({ padding: 0.24, duration: 200 })
	}

	return (
		<Panel
			position='top-right'
			className='pointer-events-auto rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface)]/95 p-[var(--spacing-xs)] backdrop-blur-md'
			style={{ boxShadow: 'var(--layout-shadow-elevation-lg)' }}
			aria-label='Canvas controls'
		>
			<Toolbar.Root
				className='flex flex-col gap-[var(--spacing-xs)]'
				orientation='vertical'
			>
				<Toolbar.Button
					className='inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--outline-variant)] bg-[var(--surface)] text-[var(--font-size-title-m)] font-semibold text-[var(--on-surface)] transition hover:border-[var(--primary)] hover:bg-[var(--primary-container)] focus-visible:outline focus-visible:outline-[var(--primary)]/40'
					type='button'
					onClick={() => zoomIn({ duration: 200 })}
					aria-label='Zoom in'
				>
					+
				</Toolbar.Button>
				<Toolbar.Button
					className='inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--outline-variant)] bg-[var(--surface)] text-[var(--font-size-title-m)] font-semibold text-[var(--on-surface)] transition hover:border-[var(--primary)] hover:bg-[var(--primary-container)] focus-visible:outline focus-visible:outline-[var(--primary)]/40'
					type='button'
					onClick={() => zoomOut({ duration: 200 })}
					aria-label='Zoom out'
				>
					–
				</Toolbar.Button>
				<Toolbar.Button
					className='inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--outline-variant)] bg-[var(--surface)] text-[var(--font-size-label-m)] font-semibold text-[var(--on-surface)] transition hover:border-[var(--primary)] hover:bg-[var(--primary-container)] focus-visible:outline focus-visible:outline-[var(--primary)]/40'
					type='button'
					onClick={handleFit}
					aria-label='Fit view'
				>
					Fit
				</Toolbar.Button>
				<Toolbar.Button
					className='inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--outline-variant)] bg-[var(--surface)] text-[var(--font-size-label-m)] font-semibold text-[var(--on-surface)] transition hover:border-[var(--primary)] hover:bg-[var(--primary-container)] focus-visible:outline focus-visible:outline-[var(--primary)]/40'
					type='button'
					onClick={onFullscreen}
					aria-label='Pantalla completa'
				>
					⤢
				</Toolbar.Button>
			</Toolbar.Root>
		</Panel>
	)
}

export default CanvasControls
