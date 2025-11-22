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
					className='w-full rounded-[var(--radius-md)] border border-[var(--outline-variant)] bg-[var(--surface-container)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-[var(--font-size-body-s)] text-[var(--on-surface)] transition focus:outline focus:outline-[var(--primary)]/40 focus:ring-0'
					value={String(templateData.value ?? '')}
					onChange={event => onChange?.(event.target.value)}
					placeholder={templateData.placeholder ?? label}
					aria-label={label}
				/>
			)
		case 'bool':
			return (
				<Switch.Root
					className='relative inline-flex h-6 w-11 items-center rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container)] transition-colors duration-150 data-[state=checked]:border-[var(--primary)] data-[state=checked]:bg-[var(--primary)]'
					checked={Boolean(templateData.value)}
					onCheckedChange={(next: boolean) => onChange?.(next)}
					aria-label={label}
				>
					<Switch.Thumb
						className='inline-block h-4 w-4 translate-x-0 rounded-full bg-[var(--surface)] transition-transform duration-150 data-[state=checked]:translate-x-[20px]'
						style={{ boxShadow: 'var(--layout-shadow-elevation)' }}
						aria-hidden
					/>
				</Switch.Root>
			)
		case 'code':
		case 'prompt':
			return (
				<Toolbar.Button
					className='w-full rounded-[var(--radius-md)] border border-[var(--outline-variant)] bg-[var(--surface-container)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-start text-[var(--font-size-label-m)] font-medium text-[var(--on-surface)] transition-colors duration-150 hover:border-[var(--primary)] hover:bg-[var(--primary-container)] focus-visible:outline focus-visible:outline-[var(--primary)]/40'
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
