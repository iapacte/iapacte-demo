type FormPreviewProps = {
	title: string
	audience: string
	status: string
	channel: string
}

export function FormPreview({
	title,
	audience,
	status,
	channel,
}: Readonly<FormPreviewProps>) {
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
						Formulari embed (simulat) · Audiència: {audience}
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

			<form className='space-y-[var(--spacing-sm)] rounded-[var(--radius-md)] border border-[var(--outline-variant)] bg-[var(--surface)] p-[var(--spacing-md)]'>
				<label className='space-y-[var(--spacing-xxs)] block'>
					<span className='text-[var(--font-size-label-m)] text-[var(--on-surface-variant)]'>
						Assumpte
					</span>
					<input
						type='text'
						disabled
						value='Consulta simulada'
						className='w-full rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface-container-high)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-body-m)] text-[var(--on-surface)]'
					/>
				</label>
				<label className='space-y-[var(--spacing-xxs)] block'>
					<span className='text-[var(--font-size-label-m)] text-[var(--on-surface-variant)]'>
						Barri
					</span>
					<select
						disabled
						className='w-full rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface-container-high)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-body-m)] text-[var(--on-surface)]'
					>
						<option>Barri centre</option>
						<option>Barri nord</option>
						<option>Barri oest</option>
					</select>
				</label>
				<label className='space-y-[var(--spacing-xxs)] block'>
					<span className='text-[var(--font-size-label-m)] text-[var(--on-surface-variant)]'>
						Detall
					</span>
					<textarea
						disabled
						rows={4}
						className='w-full rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface-container-high)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-body-m)] text-[var(--on-surface)]'
					>
						Hola, vull informar d’una incidència. Aquest formulari està simulat
						i no envia dades.
					</textarea>
				</label>
				<button
					type='button'
					className='w-full rounded-[var(--radius-lg)] border border-[var(--primary)] bg-[var(--primary-container)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-label-m)] text-[var(--primary)] transition hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
				>
					Enviar (simulat)
				</button>
			</form>
		</div>
	)
}
