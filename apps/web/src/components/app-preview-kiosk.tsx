type KioskPreviewProps = {
	title: string
	audience: string
	status: string
	channel: string
}

export function KioskPreview({
	title,
	audience,
	status,
	channel,
}: Readonly<KioskPreviewProps>) {
	const steps = [
		'Selecciona tràmit o consulta',
		'Captura dades mínimes (simulat)',
		'Mostra recomanació i següents passos',
	]

	return (
		<div className='space-y-[var(--spacing-sm)] rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-[var(--spacing-md)]'>
			<div className='flex flex-wrap items-center justify-between gap-[var(--spacing-xs)]'>
				<div>
					<p className='text-[var(--font-size-label-m)] uppercase tracking-wide text-[var(--primary)]'>
						{channel}
					</p>
					<p className='text-[var(--font-size-title-m)] font-semibold text-[var(--on-surface)]'>
						{title}
					</p>
					<p className='text-[var(--font-size-body-s)] text-[var(--on-surface-variant)]'>
						Flux pas a pas per {audience}. Tot està simulat per la demo.
					</p>
				</div>
				<span
					className={`rounded-full px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-[var(--font-size-label-m)] ${
						status === 'Publicat'
							? 'bg-[var(--primary-container)] text-[var(--primary)]'
							: 'bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]'
					}`}
				>
					{status}
				</span>
			</div>

			<div className='space-y-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--outline-variant)] bg-[var(--surface)] p-[var(--spacing-md)]'>
				<ol className='space-y-[var(--spacing-xs)] text-[var(--font-size-body-m)] text-[var(--on-surface)]'>
					{steps.map(step => (
						<li
							key={step}
							className='flex items-start gap-[var(--spacing-sm)] rounded-[var(--radius-md)] bg-[var(--surface-container-high)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)]'
						>
							<span
								className='mt-[var(--spacing-xxs)] h-2 w-2 shrink-0 rounded-full bg-[var(--primary)]'
								aria-hidden
							/>
							<span>{step}</span>
						</li>
					))}
				</ol>
				<div className='flex flex-wrap gap-[var(--spacing-xs)] text-[var(--font-size-label-m)] text-[var(--primary)]'>
					<span className='rounded-full bg-[var(--primary-container)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)]'>
						Mode sala
					</span>
					<span className='rounded-full bg-[var(--surface-container-high)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-[var(--on-surface-variant)]'>
						Sense backend real
					</span>
				</div>
				<button
					type='button'
					className='w-full rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface-container-high)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-label-m)] text-[var(--on-surface)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
				>
					Iniciar recorregut (simulat)
				</button>
			</div>
		</div>
	)
}
