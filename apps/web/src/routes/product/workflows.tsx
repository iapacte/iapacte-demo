import { createFileRoute, Link } from '@tanstack/react-router'

import { productWorkflows } from '~lib/product.data'
import { workflowsById } from '~lib/workflows.data'

export const Route = createFileRoute('/product/workflows')({
	component: ProductWorkflows,
	head: () => ({
		meta: [
			{
				title: 'Catàleg de workflows d’IA',
			},
			{
				name: 'description',
				content:
					"Workflows d'IA traçables per a ajuntaments amb dades simulades i recorreguts preparats.",
			},
		],
	}),
})

function ProductWorkflows() {
	const rows = productWorkflows.map(meta => {
		const workflow = workflowsById[meta.id]
		return {
			id: meta.id,
			title: workflow?.title ?? meta.id,
			category: workflow?.category ?? 'Municipal',
			persona: meta.persona,
			data: meta.dataUsed.join(', '),
			summary: workflow?.summary ?? '',
		}
	})

	return (
		<section className='mx-auto flex w-full max-w-6xl flex-col gap-[var(--spacing-xl)] px-[var(--spacing-lg)] py-[var(--spacing-xxl)]'>
			<header className='space-y-[var(--spacing-sm)]'>
				<p className='text-[var(--font-size-label-l)] uppercase tracking-wide text-[var(--primary)]'>
					Producte / Workflows
				</p>
				<div className='space-y-[var(--spacing-xs)]'>
					<h1 className='text-[var(--font-size-display-s)] font-semibold'>
						Workflows d’IA traçables per a ajuntaments
					</h1>
					<p className='text-[var(--font-size-body-l)] text-[var(--on-surface-variant)] max-w-3xl'>
						Llistat de workflows que connecten dades municipals amb passos
						traçables. Tot el contingut és simulat i pensat per ensenyar en
						reunions amb consistoris.
					</p>
				</div>
				<div className='flex flex-wrap gap-[var(--spacing-sm)]'>
					<Link
						to='/product/workflows'
						className='inline-flex items-center gap-[var(--spacing-xxs)] rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface-container)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--font-size-label-m)] text-[var(--primary)] shadow-elevation-1 transition hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
					>
						Veure catàleg complet
					</Link>
					<Link
						to='/'
						className='inline-flex items-center gap-[var(--spacing-xxs)] rounded-[var(--radius-lg)] border border-[var(--outline-variant)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--font-size-label-m)] text-[var(--on-surface)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
					>
						Tornar al hub de demo
					</Link>
				</div>
			</header>

			<div className='overflow-hidden rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container)] shadow-elevation-1'>
				<div className='grid grid-cols-5 items-center bg-[var(--surface-container-high)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-label-m)] text-[var(--on-surface-variant)]'>
					<span>Workflow</span>
					<span>Categoria</span>
					<span>Persona clau</span>
					<span>Dades</span>
					<span className='text-right'>Accions</span>
				</div>
				<ul className='divide-y divide-[var(--outline-variant)]'>
					{rows.map(row => (
						<li
							key={row.id}
							className='grid grid-cols-5 items-start gap-[var(--spacing-sm)] px-[var(--spacing-md)] py-[var(--spacing-md)] text-[var(--font-size-body-m)]'
						>
							<div className='space-y-[var(--spacing-xxs)] pr-[var(--spacing-md)]'>
								<Link
									to='/product/workflows/$workflowId'
									params={{ workflowId: row.id }}
									className='font-semibold text-[var(--font-size-body-l)] text-[var(--primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
								>
									{row.title}
								</Link>
								<p className='text-[var(--font-size-body-s)] text-[var(--on-surface-variant)]'>
									{row.summary}
								</p>
							</div>
							<div className='text-[var(--font-size-body-m)] text-[var(--on-surface)]'>
								{row.category}
							</div>
							<div className='text-[var(--font-size-body-m)] text-[var(--on-surface)]'>
								{row.persona}
							</div>
							<div className='text-[var(--font-size-body-m)] text-[var(--on-surface-variant)]'>
								{row.data}
							</div>
							<div className='flex justify-end gap-[var(--spacing-xs)]'>
								<Link
									to='/product/workflows/$workflowId'
									params={{ workflowId: row.id }}
									className='rounded-[var(--radius-lg)] border border-[var(--outline-variant)] px-[var(--spacing-md)] py-[var(--spacing-xxs)] text-[var(--font-size-label-m)] text-[var(--primary)] transition hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
								>
									Veure fitxa
								</Link>
								<Link
									to='/product/workflows/$workflowId'
									params={{ workflowId: row.id }}
									className='rounded-[var(--radius-lg)] border border-[var(--primary)] bg-[var(--primary-container)] px-[var(--spacing-md)] py-[var(--spacing-xxs)] text-[var(--font-size-label-m)] text-[var(--primary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
								>
									Obrir detall
								</Link>
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	)
}
