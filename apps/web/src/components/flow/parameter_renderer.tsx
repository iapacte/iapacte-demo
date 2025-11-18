import { Input } from '@base-ui-components/react/input'
import { Switch } from '@base-ui-components/react/switch'
import { Toolbar } from '@base-ui-components/react/toolbar'

interface ParameterRendererProps {
	templateData: {
		type: string
		label?: string
		value?: unknown
		placeholder?: string
	}
	onChange?: (value: unknown) => void
}

export function ParameterRenderer({
	templateData,
	onChange,
}: ParameterRendererProps) {
	const label = templateData.label ?? 'Parameter'

	switch (templateData.type) {
		case 'str':
		case 'int':
			return (
				<Input
					className='w-full rounded-md border border-outline-variant bg-surface-container px-sm py-xs text-body-s text-on-surface transition focus:outline focus:outline-primary/40 focus:ring-0'
					value={String(templateData.value ?? '')}
					onChange={event => onChange?.(event.target.value)}
					placeholder={templateData.placeholder ?? label}
					aria-label={label}
				/>
			)
		case 'bool':
			return (
				<Switch.Root
					className='relative inline-flex h-6 w-11 items-center rounded-full border border-outline-variant bg-surface-container transition-colors duration-150 data-[state=checked]:border-primary data-[state=checked]:bg-primary'
					checked={Boolean(templateData.value)}
					onCheckedChange={(next: boolean) => onChange?.(next)}
					aria-label={label}
				>
					<Switch.Thumb
						className='inline-block h-4 w-4 translate-x-0 rounded-full bg-surface shadow-elevation-sm transition-transform duration-150 data-[state=checked]:translate-x-[20px]'
						aria-hidden
					/>
				</Switch.Root>
			)
		case 'code':
		case 'prompt':
			return (
				<Toolbar.Button
					className='w-full rounded-md border border-outline-variant bg-surface-container px-sm py-xs text-start text-label-m font-medium text-on-surface transition-colors duration-150 hover:border-primary hover:bg-primary-container focus-visible:outline focus-visible:outline-primary/40'
					type='button'
					onClick={() => onChange?.(templateData.value)}
					aria-label={label}
				>
					{label}
				</Toolbar.Button>
			)
		default:
			return null
	}
}

export default ParameterRenderer
