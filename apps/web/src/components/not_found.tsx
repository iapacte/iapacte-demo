import { Link, type NotFoundRouteProps } from '@tanstack/react-router'

export function NotFound(_: NotFoundRouteProps) {
	return (
		<section className='min-h-screen flex flex-col items-center justify-center gap-[var(--spacing-md)] bg-[var(--surface)] text-[var(--on-surface)] p-[var(--spacing-xl)] text-center'>
			<div className='space-y-[var(--spacing-sm)] max-w-xl'>
				<p className='text-[var(--font-size-label-l)] text-[var(--on-surface-variant)] uppercase tracking-wide'>
					404
				</p>
				<h1 className='text-[var(--font-size-display-s)] font-semibold'>
					Oops, that screen isn&apos;t part of the demo yet.
				</h1>
				<p className='text-[var(--font-size-body-l)] text-[var(--on-surface-variant)]'>
					Use the links below to explore the tender vault, workflow studio, or
					civic spreadsheet prototypes for the city council preview.
				</p>
			</div>
			<div className='flex flex-wrap items-center justify-center gap-[var(--spacing-sm)]'>
				<Link
					to='/'
					className='inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary-container)] px-[var(--spacing-md)] py-[var(--spacing-xs)] font-medium text-[var(--on-primary-container)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
				>
					Back to Demo Hub
				</Link>
				<Link
					to='/tenders'
					className='inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--primary)] px-[var(--spacing-md)] py-[var(--spacing-xs)] font-medium text-[var(--primary)] hover:bg-[var(--surface-container)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
				>
					Tender Vault
				</Link>
				<Link
					to='/workflows'
					className='inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--primary)] px-[var(--spacing-md)] py-[var(--spacing-xs)] font-medium text-[var(--primary)] hover:bg-[var(--surface-container)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
				>
					Workflow Studio
				</Link>
				<Link
					to='/data'
					className='inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--primary)] px-[var(--spacing-md)] py-[var(--spacing-xs)] font-medium text-[var(--primary)] hover:bg-[var(--surface-container)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
				>
					Civic Spreadsheet
				</Link>
			</div>
		</section>
	)
}
