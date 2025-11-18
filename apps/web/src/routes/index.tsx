import { createFileRoute, Link } from '@tanstack/react-router'

const DEMO_LINKS = [
	{
		to: '/data',
		label: 'Data Collector',
		summary:
			'Centralitza padrons, portals oberts i feeds locals en una sola graella explicativa.',
	},
	{
		to: '/tenders',
		label: 'Tenders & Grants',
		summary:
			'Tots els expedients, memòries i guies en carpetes compartides per no començar mai de zero.',
	},
	{
		to: '/workflows',
		label: 'Workflows',
		summary:
			'Automatitza decisions i registra resultats perquè el xat sàpiga quin flux disparar.',
	},
] as const

function DemoHub() {
	return (
		<main className='mx-auto flex w-full max-w-6xl flex-col gap-[var(--spacing-xl)] px-[var(--spacing-lg)] py-[var(--spacing-xxl)]'>
			<div className='space-y-[var(--spacing-md)]'></div>

			<section className='grid gap-[var(--spacing-lg)] md:grid-cols-3'>
				{DEMO_LINKS.map(link => (
					<Link
						key={link.to}
						to={link.to}
						className='rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface-container)] p-[var(--spacing-lg)] shadow-elevation-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] hover:border-[var(--primary)]'
					>
						<div className='flex items-start justify-between gap-[var(--spacing-sm)]'>
							<h2 className='text-[var(--font-size-title-l)] font-semibold'>
								{link.label}
							</h2>
							<span
								aria-hidden='true'
								className='text-[var(--font-size-display-s)]'
							>
								↗
							</span>
						</div>
						<p className='mt-[var(--spacing-xs)] text-[var(--font-size-body-m)] text-[var(--on-surface-variant)]'>
							{link.summary}
						</p>
					</Link>
				))}
			</section>
		</main>
	)
}

export const Route = createFileRoute('/')({
	component: DemoHub,
	head: () => ({
		meta: [
			{
				title: 'Relat Data Collector + Tenders & Grants + Workflows',
			},
			{
				name: 'description',
				content:
					'Mostra recollida de dades, arxiu de licitacions i workflows municipals en un mateix relat per als consistoris.',
			},
		],
	}),
})
