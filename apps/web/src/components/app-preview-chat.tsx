type ChatPreviewProps = {
	title: string
	workflowName: string
	audience: string
	status: string
	channel: string
}

export function ChatPreview({
	title,
	workflowName,
	audience,
	status,
	channel,
}: Readonly<ChatPreviewProps>) {
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
						Workflow actiu: {workflowName} · Audiència: {audience}
					</p>
				</div>
				<span className='rounded-full bg-[var(--primary-container)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-[var(--font-size-label-m)] text-[var(--primary)]'>
					{status}
				</span>
			</div>

			<div className='space-y-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--outline-variant)] bg-[var(--surface)] p-[var(--spacing-md)]'>
				<p className='text-[var(--font-size-label-m)] text-[var(--on-surface-variant)]'>
					Conversació simulada
				</p>
				<div className='space-y-[var(--spacing-sm)]'>
					<div className='flex flex-col gap-[var(--spacing-xxs)]'>
						<div className='self-start rounded-[var(--radius-lg)] bg-[var(--surface-container-high)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--font-size-body-s)] text-[var(--on-surface)]'>
							Hola! Escriu el cas i connectarem el workflow {workflowName}{' '}
							(dades simulades).
						</div>
						<div className='self-end rounded-[var(--radius-lg)] bg-[var(--primary-container)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--font-size-body-s)] text-[var(--primary)]'>
							Vull un resum per {audience.toLowerCase()}.
						</div>
						<div className='self-start rounded-[var(--radius-lg)] bg-[var(--surface-container-high)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--font-size-body-s)] text-[var(--on-surface-variant)]'>
							S’està preparant la resposta amb plantilles d’IA i dades locals.
							Cap trucada real.
						</div>
					</div>
					<button
						type='button'
						className='w-full rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface-container-high)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-label-m)] text-[var(--on-surface)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
					>
						Enviar prova (simulat)
					</button>
				</div>
			</div>
		</div>
	)
}
