import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'

import { PageComponent } from '~components/flow'
import { workflowsById } from '~lib'

export const Route = createFileRoute('/workflows/$workflowId')({
	component: WorkflowDetail,
})

function WorkflowDetail() {
	const { workflowId } = Route.useParams()
	const workflow = workflowsById[workflowId]

	if (!workflow) {
		throw notFound()
	}

	return (
		<section className='px-[var(--spacing-lg)] py-[var(--spacing-xl)] space-y-[var(--spacing-lg)]'>
			<div className='flex flex-col gap-[var(--spacing-sm)]'>
				<Link
					to='/workflows'
					className='inline-flex items-center gap-[var(--spacing-xxs)] text-[var(--primary)] text-[var(--font-size-body-m)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] w-fit'
				>
					<ChevronLeft className='h-4 w-4' />
					Tornar al catàleg
				</Link>
				<p className='text-[var(--font-size-label-l)] uppercase tracking-wide text-[var(--primary)]'>
					{workflow.category}
				</p>
				<h1 className='text-[var(--font-size-display-s)] font-semibold'>
					{workflow.title}
				</h1>
				<p className='text-[var(--font-size-body-l)] text-[var(--on-surface-variant)]'>
					{workflow.summary}
				</p>
				<ul className='flex flex-wrap gap-[var(--spacing-sm)] text-[var(--font-size-label-m)] text-[var(--primary)]'>
					{workflow.metrics.map(metric => (
						<li
							key={metric}
							className='rounded-full bg-[var(--primary-container)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)]'
						>
							{metric}
						</li>
					))}
				</ul>
			</div>

			<div className='h-[70vh] rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container)] p-[var(--spacing-md)]'>
				<PageComponent
					initialNodes={workflow.nodes}
					initialEdges={workflow.edges}
				/>
			</div>
		</section>
	)
}
