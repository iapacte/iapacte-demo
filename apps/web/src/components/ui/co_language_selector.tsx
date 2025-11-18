import { Select } from '@base-ui-components/react/select'
import { ListSupportedLanguagesCodes } from '@iapacte/shared-domain'
import {
	DEFAULT_LANGUAGE,
	readLanguageFromCookieString,
} from '@iapacte/shared-ui-localization'
import * as m from '@iapacte/shared-ui-localization/paraglide/messages'
import {
	getLocale,
	type Locale,
	setLocale,
} from '@iapacte/shared-ui-localization/paraglide/runtime'
import { Check, ChevronDown, Languages } from 'lucide-react'

const SUPPORTED_LANGUAGES = Object.values(ListSupportedLanguagesCodes)

const isSupportedLanguage = (value: string | undefined): value is Locale =>
	value !== undefined &&
	(SUPPORTED_LANGUAGES as ReadonlyArray<string>).includes(value)

export function CoLanguageSelector() {
	const cookieLanguage =
		typeof document !== 'undefined'
			? readLanguageFromCookieString(document.cookie)
			: undefined

	const resolvedLanguage = cookieLanguage ?? getLocale() ?? DEFAULT_LANGUAGE
	const currentLanguage: Locale = isSupportedLanguage(resolvedLanguage)
		? resolvedLanguage
		: DEFAULT_LANGUAGE

	const languageOptions = [
		{
			value: ListSupportedLanguagesCodes.cat,
			label: m.common_components_co_language_selector_catalan(),
		},
		{
			value: ListSupportedLanguagesCodes.spa,
			label: m.common_components_co_language_selector_spanish(),
		},
	]

	const selectedLabel =
		languageOptions.find(opt => opt.value === currentLanguage)?.label || ''

	const handleLanguageChange = (value: ListSupportedLanguagesCodes) => {
		// Paraglide handles persistence and page reload automatically
		setLocale(value, { reload: true })
	}

	return (
		<Select.Root
			items={languageOptions}
			value={currentLanguage}
			onValueChange={value =>
				handleLanguageChange(value as ListSupportedLanguagesCodes | 'auto')
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
				<Languages className='w-3 h-3 shrink-0' />
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
							{languageOptions.map(({ value, label }) => (
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
