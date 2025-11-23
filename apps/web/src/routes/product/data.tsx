import { createFileRoute, Link } from '@tanstack/react-router'

import { DataCollectorBoard } from '~components/data-collector'
import { dataCards } from '~lib/product.data'

export const Route = createFileRoute('/product/data')({
	component: ProductDataLayer,
	head: () => ({
		meta: [
			{
				title: 'Capa de dades municipal',
			},
			{
				name: 'description',
				content:
					'Capa compartida de dades municipals amb taules simulades per a contractacions, subvencions i incidències.',
			},
		],
	}),
})

function ProductDataLayer() {
	return (
		<section className='mx-auto flex w-full max-w-6xl flex-col gap-[var(--spacing-xl)] px-[var(--spacing-lg)] py-[var(--spacing-xxl)]'>
			<header className='space-y-[var(--spacing-sm)]'>
				<p className='text-[var(--font-size-label-l)] uppercase tracking-wide text-[var(--primary)]'>
					Producte / Dades
				</p>
				<div className='space-y-[var(--spacing-xs)]'>
					<h1 className='text-[var(--font-size-display-s)] font-semibold'>
						Capa de dades municipal
					</h1>
					<p className='text-[var(--font-size-body-l)] text-[var(--on-surface-variant)] max-w-3xl'>
						Unifica taules de contractació, subvencions, incidències i
						indicadors perquè equips diferents treballin sobre la mateixa
						informació. Tot el contingut és simulat i funciona sense xarxa.
					</p>
				</div>
				<div className='flex flex-wrap gap-[var(--spacing-sm)]'>
					<Link
						to='/product/data/connectors'
						className='inline-flex items-center gap-[var(--spacing-xxs)] rounded-[var(--radius-lg)] border border-[var(--primary)] bg-[var(--primary-container)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--font-size-label-m)] text-[var(--primary)] transition hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
					>
						Veure connectors de dades
					</Link>
					<Link
						to='/product/data'
						hash='graella-demo'
						className='inline-flex items-center gap-[var(--spacing-xxs)] rounded-[var(--radius-lg)] border border-[var(--outline-variant)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--font-size-label-m)] text-[var(--on-surface)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
					>
						Veure graella demo
					</Link>
				</div>
			</header>

			<div className='overflow-x-auto'>
				<div className='grid min-w-0 gap-[var(--spacing-md)] md:grid-cols-2'>
					{dataCards.map(card => (
						<article
							key={card.id}
							id='fitxa-dades'
							className='flex flex-col gap-[var(--spacing-xs)] rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container)] p-[var(--spacing-lg)] shadow-elevation-1'
						>
							<div className='flex items-center justify-between gap-[var(--spacing-sm)]'>
								<div className='space-y-[var(--spacing-xxs)]'>
									<h2 className='text-[var(--font-size-title-m)] font-semibold'>
										{card.name}
									</h2>
									<p className='text-[var(--font-size-body-s)] text-[var(--on-surface-variant)]'>
										{card.area}
									</p>
								</div>
								<span className='rounded-full bg-[var(--surface-container-high)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-[var(--font-size-label-m)] text-[var(--on-surface-variant)]'>
									{card.rows}
								</span>
							</div>
							<div className='space-y-[var(--spacing-xxs)]'>
								<p className='text-[var(--font-size-body-m)] text-[var(--on-surface-variant)]'>
									Camps clau
								</p>
								<ul className='flex flex-wrap gap-[var(--spacing-xs)] text-[var(--font-size-label-m)] text-[var(--primary)]'>
									{card.fields.map(field => (
										<li
											key={field}
											className='rounded-full bg-[var(--primary-container)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)]'
										>
											{field}
										</li>
									))}
								</ul>
							</div>
						</article>
					))}
				</div>
			</div>

			<div className='space-y-[var(--spacing-sm)]'>
				<h2 className='text-[var(--font-size-title-m)] font-semibold'>
					Graella demo amb filtres
				</h2>
				<p className='text-[var(--font-size-body-m)] text-[var(--on-surface-variant)]'>
					La mateixa graella interactiva per contractacions, subvencions i
					incidències, disponible offline i amb filtres guardats.
				</p>
				<div
					id='graella-demo'
					className='overflow-x-auto rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-low)] shadow-elevation-1'
				>
					<div className='min-w-0'>
						<DataCollectorBoard />
					</div>
				</div>
			</div>
		</section>
	)
}
