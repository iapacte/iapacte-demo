import { createFileRoute, Link, notFound } from '@tanstack/react-router'

import { PageComponent } from '~components/flow'
import { productWorkflows } from '~lib/product.data'
import { workflowsById } from '~lib/workflows.data'

export const Route = createFileRoute('/product/workflows/$workflowId')({
	component: ProductWorkflowDetail,
})

function ProductWorkflowDetail() {
	const { workflowId } = Route.useParams()
	const workflow = workflowsById[workflowId]
	const meta = productWorkflows.find(item => item.id === workflowId)

	if (!workflow || !meta) {
		throw notFound()
	}

	return (
		<section className='mx-auto flex w-full max-w-6xl flex-col gap-[var(--spacing-xl)] px-[var(--spacing-lg)] py-[var(--spacing-xxl)]'>
			<header className='space-y-[var(--spacing-sm)]'>
				<p className='text-[var(--font-size-label-l)] uppercase tracking-wide text-[var(--primary)]'>
					Producte / Workflows
				</p>
				<div className='space-y-[var(--spacing-xs)]'>
					<h1 className='text-[var(--font-size-display-s)] font-semibold'>
						{workflow.title}
					</h1>
					<p className='text-[var(--font-size-body-l)] text-[var(--on-surface-variant)] max-w-3xl'>
						{workflow.summary}
					</p>
				</div>
				<div className='flex flex-wrap items-center gap-[var(--spacing-sm)]'>
					<span className='rounded-full bg-[var(--primary-container)] px-[var(--spacing-md)] py-[var(--spacing-xxs)] text-[var(--font-size-label-m)] text-[var(--primary)]'>
						Categoria: {workflow.category}
					</span>
					<span className='rounded-full bg-[var(--surface-container-high)] px-[var(--spacing-md)] py-[var(--spacing-xxs)] text-[var(--font-size-label-m)] text-[var(--on-surface)]'>
						Persona clau: {meta.persona}
					</span>
				</div>
				<div className='flex flex-wrap gap-[var(--spacing-sm)]'>
					<Link
						to='/product/workflows'
						className='inline-flex items-center gap-[var(--spacing-xxs)] rounded-[var(--radius-lg)] border border-[var(--outline-variant)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--font-size-label-m)] text-[var(--on-surface)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
					>
						← Tornar al catàleg de workflows
					</Link>
					<Link
						to='/product/workflows'
						className='inline-flex items-center gap-[var(--spacing-xxs)] rounded-[var(--radius-lg)] border border-[var(--primary)] bg-[var(--primary-container)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--font-size-label-m)] text-[var(--primary)] transition hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
					>
						Tornar al catàleg
					</Link>
				</div>
			</header>

			<div className='grid gap-[var(--spacing-lg)] md:grid-cols-5'>
				<div className='md:col-span-2 space-y-[var(--spacing-md)] rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container)] p-[var(--spacing-lg)] shadow-elevation-1'>
					<div className='space-y-[var(--spacing-xs)]'>
						<h2 className='text-[var(--font-size-title-m)] font-semibold'>
							Passos clau
						</h2>
						<ol className='space-y-[var(--spacing-xs)] text-[var(--font-size-body-m)] text-[var(--on-surface)]'>
							{meta.steps.map(step => (
								<li key={step} className='flex gap-[var(--spacing-sm)]'>
									<span className='text-[var(--primary)]'>•</span>
									<span>{step}</span>
								</li>
							))}
						</ol>
					</div>

					<div className='space-y-[var(--spacing-xxs)]'>
						<h3 className='text-[var(--font-size-title-s)] font-semibold'>
							Dades que fa servir
						</h3>
						<ul className='flex flex-wrap gap-[var(--spacing-xs)] text-[var(--font-size-label-m)] text-[var(--primary)]'>
							{meta.dataUsed.map(dataPoint => (
								<li
									key={dataPoint}
									className='rounded-full bg-[var(--primary-container)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)]'
								>
									{dataPoint}
								</li>
							))}
						</ul>
					</div>
					{workflow.metrics?.length ? (
						<div className='space-y-[var(--spacing-xxs)]'>
							<h3 className='text-[var(--font-size-title-s)] font-semibold'>
								Mètriques de demo
							</h3>
							<ul className='flex flex-wrap gap-[var(--spacing-xs)] text-[var(--font-size-label-m)] text-[var(--on-surface-variant)]'>
								{workflow.metrics.map(metric => (
									<li
										key={metric}
										className='rounded-full bg-[var(--surface-container-high)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)]'
									>
										{metric}
									</li>
								))}
							</ul>
						</div>
					) : null}
				</div>

				<div className='md:col-span-3 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container)] shadow-elevation-1'>
					<div className='border-b border-[var(--outline-variant)] bg-[var(--surface-container-high)] px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-[var(--font-size-body-m)] text-[var(--on-surface-variant)]'>
						Canvas de demo (lectura)
					</div>
					<div className='h-[480px]'>
						<PageComponent
							initialNodes={workflow.nodes}
							initialEdges={workflow.edges}
						/>
					</div>
				</div>
			</div>
		</section>
	)
}
