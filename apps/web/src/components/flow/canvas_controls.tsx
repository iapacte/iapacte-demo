import { Toolbar } from '@base-ui-components/react/toolbar'
import { Panel, useReactFlow } from 'reactflow'

export function CanvasControls() {
	const { zoomIn, zoomOut, fitView } = useReactFlow()

	return (
		<Panel
			position='top-right'
			className='pointer-events-auto rounded-lg border border-outline-variant bg-surface/95 p-xs shadow-elevation-md backdrop-blur-md'
			aria-label='Canvas controls'
		>
			<Toolbar.Root className='flex flex-col gap-xs' orientation='vertical'>
				<Toolbar.Button
					className='inline-flex h-10 w-10 items-center justify-center rounded-md border border-outline-variant bg-surface text-title-m font-semibold text-on-surface transition hover:border-primary hover:bg-primary-container focus-visible:outline focus-visible:outline-primary/40'
					type='button'
					onClick={() => zoomIn({ duration: 200 })}
					aria-label='Zoom in'
				>
					+
				</Toolbar.Button>
				<Toolbar.Button
					className='inline-flex h-10 w-10 items-center justify-center rounded-md border border-outline-variant bg-surface text-title-m font-semibold text-on-surface transition hover:border-primary hover:bg-primary-container focus-visible:outline focus-visible:outline-primary/40'
					type='button'
					onClick={() => zoomOut({ duration: 200 })}
					aria-label='Zoom out'
				>
					–
				</Toolbar.Button>
				<Toolbar.Button
					className='inline-flex h-10 w-10 items-center justify-center rounded-md border border-outline-variant bg-surface text-label-m font-semibold text-on-surface transition hover:border-primary hover:bg-primary-container focus-visible:outline focus-visible:outline-primary/40'
					type='button'
					onClick={() => fitView({ padding: 0.24, duration: 200 })}
					aria-label='Fit view'
				>
					Fit
				</Toolbar.Button>
			</Toolbar.Root>
		</Panel>
	)
}

export default CanvasControls
