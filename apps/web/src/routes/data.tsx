import { createFileRoute } from '@tanstack/react-router'

function CivicSpreadsheetPlaceholder() {
	return (
		<section className='min-h-[70vh] px-[var(--spacing-lg)] py-[var(--spacing-xl)] flex flex-col gap-[var(--spacing-md)]'>
			<div className='space-y-[var(--spacing-xs)] max-w-3xl'>
				<p className='text-[var(--font-size-label-l)] uppercase tracking-wide text-[var(--primary)]'>
					Data Collector
				</p>
				<h1 className='text-[var(--font-size-display-s)] font-semibold'>
					Llegeix i escriu qualsevol conjunt de dades municipal amb una graella
					propera.
				</h1>
				<p className='text-[var(--font-size-body-l)] text-[var(--on-surface-variant)]'>
					Aquesta vista replicarà aplicacions de dades col·laboratives amb
					connexions a Snowflake, portals oberts i feeds de premsa local. Tot
					funciona offline perquè la demo sempre estigui preparada.
				</p>
			</div>
			<div className='rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container)] p-[var(--spacing-xl)] text-center text-[var(--font-size-body-l)] text-[var(--on-surface-variant)]'>
				Aquí incrustarem la graella, els filtres i les fórmules assistides per
				IA que alimenten la narrativa Data Collector.
			</div>
		</section>
	)
}

export const Route = createFileRoute('/data')({
	component: CivicSpreadsheetPlaceholder,
})
