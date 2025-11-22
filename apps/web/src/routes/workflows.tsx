import {
	createFileRoute,
	Link,
	Outlet,
	useLocation,
} from '@tanstack/react-router'

import { workflows } from '~lib'

function WorkflowGallery() {
	const location = useLocation()
	const isDetailPage = location.pathname !== '/workflows'

	if (isDetailPage) {
		return <Outlet />
	}

	return (
		<section className='px-[var(--spacing-lg)] py-[var(--spacing-xl)] flex flex-col gap-[var(--spacing-lg)]'>
			<div className='space-y-[var(--spacing-xs)] max-w-3xl'>
				<p className='text-[var(--font-size-label-l)] uppercase tracking-wide text-[var(--primary)]'>
					Workflows
				</p>
				<h1 className='text-[var(--font-size-display-s)] font-semibold'>
					Escull un relat de flux per mostrar-lo en directe.
				</h1>
				<p className='text-[var(--font-size-body-l)] text-[var(--on-surface-variant)]'>
					Cada targeta representa una conversa de venda real: control de
					licitacions, derivacions ciutadanes, seguiment financer o resum de
					crisi. Entra per ensenyar el canvas i evidenciar com el xat dispara el
					workflow adequat.
				</p>
			</div>

			<div className='grid gap-[var(--spacing-md)] md:grid-cols-2'>
				{workflows.map(workflow => (
					<Link
						to='/workflows/$workflowId'
						params={{ workflowId: workflow.id }}
						key={workflow.id}
						className='rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container)] p-[var(--spacing-lg)] transition hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
					>
						<div className='flex items-center justify-between gap-[var(--spacing-sm)]'>
							<div>
								<p className='text-[var(--font-size-label-m)] text-[var(--on-surface-variant)] uppercase tracking-wide'>
									{workflow.category}
								</p>
								<h2 className='text-[var(--font-size-title-l)] font-semibold'>
									{workflow.title}
								</h2>
							</div>
							<span className='text-[var(--font-size-display-s)]'>↗</span>
						</div>
						<p className='text-[var(--font-size-body-m)] text-[var(--on-surface-variant)] mt-[var(--spacing-xs)]'>
							{workflow.summary}
						</p>
						<ul className='mt-[var(--spacing-sm)] flex flex-wrap gap-[var(--spacing-sm)] text-[var(--font-size-label-m)] text-[var(--primary)]'>
							{workflow.metrics.map(metric => (
								<li
									key={metric}
									className='rounded-full bg-[var(--primary-container)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)]'
								>
									{metric}
								</li>
							))}
						</ul>
					</Link>
				))}
			</div>
		</section>
	)
}

export const Route = createFileRoute('/workflows')({
	component: WorkflowGallery,
})
