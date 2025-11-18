import { Select } from '@base-ui-components/react/select'
import * as m from '@iapacte/shared-ui-localization/paraglide/messages'
import { Check, ChevronDown, Palette } from 'lucide-react'

import { type ThemePreferenceWithAuto, useThemePreference } from '~hooks'

export function CoThemeSelector() {
	const { preferenceMode, setTheme } = useThemePreference()

	const themeOptions = [
		{
			value: 'auto' as const,
			label: m.common_components_co_theme_selector_automatic(),
		},
		{
			value: 'light' as const,
			label: m.common_components_co_theme_selector_light(),
		},
		{
			value: 'dark' as const,
			label: m.common_components_co_theme_selector_dark(),
		},
	]

	const selectedLabel =
		themeOptions.find(opt => opt.value === preferenceMode)?.label || ''

	const handleThemeChange = (value: ThemePreferenceWithAuto) => {
		setTheme(value)
	}

	return (
		<Select.Root
			items={themeOptions}
			value={preferenceMode}
			onValueChange={value =>
				handleThemeChange(value as ThemePreferenceWithAuto)
			}
		>
			<Select.Trigger
				className='
					inline-flex items-center justify-between gap-[var(--spacing-xxs)]
					ps-[var(--spacing-xs)] pe-[var(--spacing-xs)] py-[var(--spacing-xxs)]
					bg-[var(--surface-container)] text-[var(--on-surface)]
					border border-[var(--outline)]
					rounded-[var(--radius-sm)]
					text-[var(--font-size-label-s)]
					hover:bg-[var(--surface-container-high)]
					focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]
					transition-colors
				'
			>
				<Palette className='w-3 h-3 shrink-0' />
				<Select.Value>{selectedLabel}</Select.Value>
				<Select.Icon>
					<ChevronDown className='w-3 h-3 shrink-0' />
				</Select.Icon>
			</Select.Trigger>

			<Select.Portal>
				<Select.Positioner sideOffset={8}>
					<Select.Popup
						className='
							min-w-[180px]
							bg-[var(--surface-container)]
							border border-[var(--outline-variant)]
							rounded-[var(--radius-md)]
							shadow-[var(--layout-shadow-elevation-lg)]
							overflow-hidden
						'
					>
						<Select.List className='p-[var(--spacing-xxs)]'>
							{themeOptions.map(({ value, label }) => (
								<Select.Item
									key={value}
									value={value}
									className='
										flex items-center gap-[var(--spacing-xs)]
										ps-[var(--spacing-sm)] pe-[var(--spacing-sm)] py-[var(--spacing-xs)]
										text-[var(--font-size-body-s)]
										rounded-[var(--radius-sm)]
										cursor-pointer
										hover:bg-[var(--surface-container-high)]
										focus-visible:outline-none focus-visible:bg-[var(--surface-container-high)]
										data-[selected]:bg-[var(--primary-container)]
										data-[selected]:text-[var(--on-primary-container)]
									'
								>
									<Select.ItemIndicator className='w-3 h-3 shrink-0'>
										<Check className='w-3 h-3' />
									</Select.ItemIndicator>
									<Select.ItemText className='flex-1'>{label}</Select.ItemText>
								</Select.Item>
							))}
						</Select.List>
					</Select.Popup>
				</Select.Positioner>
			</Select.Portal>
		</Select.Root>
	)
}

CoThemeSelector.displayName = 'CoThemeSelector'
