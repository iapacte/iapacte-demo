import { CoThemeSelector } from './index'

export function CoFooter() {
	return (
		<footer
			className='
				flex flex-wrap items-center justify-between gap-[var(--spacing-md)]
				border-t border-[var(--outline-variant)]
				bg-[var(--surface-container)]
				px-[var(--spacing-lg)] py-[var(--spacing-md)]
				text-[var(--font-size-body-s)]
				text-[var(--on-surface-variant)]
			'
		>
			<div className='text-[var(--font-size-label-m)] text-[var(--on-surface)]'>
				Iapacte Demo Hub
			</div>
			<div className='flex items-center gap-[var(--spacing-sm)]'>
				{/* <CoLanguageSelector /> */}
				<CoThemeSelector />
			</div>
		</footer>
	)
}

CoFooter.displayName = 'CoFooter'
