import { createFileRoute, Link } from '@tanstack/react-router'

import { productConnectors } from '~lib/product.data'

export const Route = createFileRoute('/product/data/connectors')({
	component: ProductConnectors,
	head: () => ({
		meta: [
			{
				title: 'Connectors de dades',
			},
			{
				name: 'description',
				content:
					'Galeria de connectors simulats (portals oberts, ERP, padró) per a la demo offline.',
			},
		],
	}),
})

function ProductConnectors() {
	return (
		<section className='mx-auto flex w-full max-w-6xl flex-col gap-[var(--spacing-xl)] px-[var(--spacing-lg)] py-[var(--spacing-xxl)]'>
			<header className='space-y-[var(--spacing-sm)]'>
				<p className='text-[var(--font-size-label-l)] uppercase tracking-wide text-[var(--primary)]'>
					Producte / Dades / Connectors
				</p>
				<div className='space-y-[var(--spacing-xs)]'>
					<h1 className='text-[var(--font-size-display-s)] font-semibold'>
						Connectors de dades simulats
					</h1>
					<p className='text-[var(--font-size-body-l)] text-[var(--on-surface-variant)] max-w-3xl'>
						Mostra com Iapacte s’assentaria sobre sistemes existents (ERP,
						portal de dades obertes, padró, Microsoft 365) sense necessitat de
						fer crides reals durant la demo.
					</p>
				</div>
				<div className='flex flex-wrap gap-[var(--spacing-sm)]'>
					<a
						href='/product/data#graella-demo'
						className='inline-flex items-center gap-[var(--spacing-xxs)] rounded-[var(--radius-lg)] border border-[var(--primary)] bg-[var(--primary-container)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--font-size-label-m)] text-[var(--primary)] transition hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
					>
						Veure graella demo
					</a>
					<Link
						to='/product/workflows'
						className='inline-flex items-center gap-[var(--spacing-xxs)] rounded-[var(--radius-lg)] border border-[var(--outline-variant)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--font-size-label-m)] text-[var(--on-surface)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
					>
						Veure workflows que els fan servir
					</Link>
				</div>
			</header>

			<div className='grid gap-[var(--spacing-md)] md:grid-cols-2'>
				{productConnectors.map(connector => (
					<article
						key={connector.id}
						className='flex flex-col gap-[var(--spacing-xs)] rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container)] p-[var(--spacing-lg)] shadow-elevation-1'
					>
						<div className='flex items-start justify-between gap-[var(--spacing-sm)]'>
							<div className='space-y-[var(--spacing-xxs)]'>
								<h2 className='text-[var(--font-size-title-m)] font-semibold'>
									{connector.name}
								</h2>
								<p className='text-[var(--font-size-body-s)] text-[var(--on-surface-variant)]'>
									{connector.description}
								</p>
							</div>
							<div className='flex flex-col items-end gap-[var(--spacing-xxs)]'>
								<span className='rounded-full bg-[var(--surface-container-high)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-[var(--font-size-label-m)] text-[var(--on-surface)]'>
									{connector.type}
								</span>
								<span
									className={`rounded-full px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-[var(--font-size-label-m)] ${
										connector.status === 'Simulat'
											? 'bg-[var(--primary-container)] text-[var(--primary)]'
											: 'bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]'
									}`}
								>
									{connector.status}
								</span>
							</div>
						</div>
					</article>
				))}
			</div>
		</section>
	)
}
