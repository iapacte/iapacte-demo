import { Dialog } from '@base-ui-components/react/dialog'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'

import { ChatPreview } from '~components/app-preview-chat'
import { FormPreview } from '~components/app-preview-form'
import { KioskPreview } from '~components/app-preview-kiosk'

type AppPreset = {
	id: string
	name: string
	channel: 'Intern' | 'Extern'
	description: string
}

type PublishedApp = {
	id: string
	name: string
	channel: 'Intern' | 'Extern'
	audience: string
	status: 'Esborrany' | 'Publicat'
	description?: string
	kind: 'chat' | 'form' | 'kiosk'
}

const APP_PRESETS: AppPreset[] = [
	{
		id: 'chat-workflow',
		name: 'Xat vinculat a workflows',
		channel: 'Intern',
		description:
			'Xat guiat que pot apuntar a qualsevol workflow aprovat (no duplicar aquí).',
	},
	{
		id: 'wordpress-form',
		name: 'Formulari per WordPress',
		channel: 'Extern',
		description:
			'Formulari embed per recollir consultes o incidències (sense backend real).',
	},
	{
		id: 'kiosk-flow',
		name: 'Flux per punts d’atenció',
		channel: 'Intern',
		description:
			'Pantalla pas a pas per finestreta o dispositius de sala (sense dades reals).',
	},
]

const PUBLISHED_APPS: PublishedApp[] = [
	{
		id: 'app-01',
		name: 'Xat d’intervenció',
		channel: 'Intern',
		audience: 'Intervenció i Secretaria',
		status: 'Publicat',
		description: 'Xat de seguiment amb resums de workflows d’intervenció.',
		kind: 'chat',
	},
	{
		id: 'app-02',
		name: 'Formulari veïnal',
		channel: 'Extern',
		audience: 'Veïnat · WordPress',
		status: 'Esborrany',
		description: 'Formulari embed per recollir incidències i consultes.',
		kind: 'form',
	},
	{
		id: 'app-03',
		name: 'Briefing de crisi',
		channel: 'Intern',
		audience: 'Alcaldia i comunicació',
		status: 'Publicat',
		description:
			'Briefing automàtic per alcaldia amb alertes i missatges clau.',
		kind: 'kiosk',
	},
]

const DEFAULT_PRESET: AppPreset = APP_PRESETS[0] ?? {
	id: 'fallback',
	name: 'App demo',
	channel: 'Intern',
	description: 'Config demo sense backend.',
}

export const Route = createFileRoute('/product/apps')({
	validateSearch: search => ({
		appId: typeof search.appId === 'string' ? search.appId : undefined,
	}),
	component: ProductsAppsRoute,
	head: () => ({
		meta: [
			{ title: 'Apps internes i externes' },
			{
				name: 'description',
				content:
					'Construeix i publica apps internes o embeds per webs municipals amb workflows aprovats.',
			},
		],
	}),
})

function ProductsAppsRoute() {
	const { appId } = Route.useSearch()
	const navigate = Route.useNavigate()

	const [selectedPreset, setSelectedPreset] =
		useState<AppPreset>(DEFAULT_PRESET)
	const [appName, setAppName] = useState('Aplicació demo')
	const [audience, setAudience] = useState('Equip intern')
	const [workflow, setWorkflow] = useState('')

	const activeApp = useMemo(
		() => (appId ? PUBLISHED_APPS.find(app => app.id === appId) : null),
		[appId],
	)

	useEffect(() => {
		if (appId && !activeApp) {
			navigate({
				to: '/product/apps',
				replace: true,
				search: prev => ({ ...prev, appId: undefined }),
			})
		}
	}, [appId, activeApp, navigate])

	const closeDialog = () =>
		navigate({
			to: '/product/apps',
			replace: true,
			search: prev => ({ ...prev, appId: undefined }),
		})

	const isExternal = selectedPreset.channel === 'Extern'

	const rolloutNote = useMemo(() => {
		if (isExternal) {
			return 'Embed compatible amb WordPress o iFrame. Sense backend real.'
		}
		return 'Disponibilitat immediata per a usuaris interns amb xat i resums.'
	}, [isExternal])

	const previewContent = useMemo(() => {
		if (!activeApp) return null
		const common = {
			title: activeApp.name,
			audience: activeApp.audience,
			status: activeApp.status,
			channel: activeApp.channel,
		}
		if (activeApp.kind === 'form') {
			return <FormPreview {...common} />
		}
		if (activeApp.kind === 'kiosk') {
			return <KioskPreview {...common} />
		}
		return (
			<ChatPreview {...common} workflowName={workflow || 'Workflow vinculat'} />
		)
	}, [activeApp, workflow])

	return (
		<section className='mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-[var(--spacing-xl)] px-[var(--spacing-lg)] py-[var(--spacing-xxl)]'>
			<header className='space-y-[var(--spacing-sm)]'>
				<p className='text-[var(--font-size-label-l)] uppercase tracking-wide text-[var(--primary)]'>
					Productes / Apps
				</p>
				<div className='space-y-[var(--spacing-xs)]'>
					<h1 className='text-[var(--font-size-display-s)] font-semibold'>
						Crea apps internes o embed externs
					</h1>
					<p className='max-w-3xl text-[var(--font-size-body-l)] text-[var(--on-surface-variant)]'>
						Orquestra xats vinculats a workflows o formularis per webs
						municipals. Tot és simulat i funciona sense backend: publiquem en
						local per la demo.
					</p>
				</div>
				<div className='flex flex-wrap gap-[var(--spacing-sm)]'>
					<Link
						to='/product/workflows'
						className='inline-flex items-center gap-[var(--spacing-xxs)] rounded-[var(--radius-lg)] border border-[var(--primary)] bg-[var(--primary-container)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--font-size-label-m)] text-[var(--primary)] transition hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
					>
						Veure workflows aprovats
					</Link>
					<Link
						to='/product/templates'
						search={{ templateId: undefined }}
						className='inline-flex items-center gap-[var(--spacing-xxs)] rounded-[var(--radius-lg)] border border-[var(--outline-variant)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--font-size-label-m)] text-[var(--on-surface)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
					>
						Plantilles d’IA
					</Link>
				</div>
			</header>

			<div className='grid min-w-0 gap-[var(--spacing-lg)] lg:grid-cols-[1.2fr,1fr]'>
				<section className='space-y-[var(--spacing-md)] rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container)] p-[var(--spacing-lg)] shadow-elevation-1 min-w-0'>
					<div className='flex flex-wrap items-start justify-between gap-[var(--spacing-sm)]'>
						<div className='space-y-[var(--spacing-xxs)]'>
							<p className='text-[var(--font-size-label-m)] uppercase tracking-wide text-[var(--primary)]'>
								Editor ràpid
							</p>
							<h2 className='text-[var(--font-size-title-l)] font-semibold'>
								Configura i publica
							</h2>
							<p className='text-[var(--font-size-body-m)] text-[var(--on-surface-variant)]'>
								Selecciona el preset i completa el formulari per mostrar la demo
								a sala.
							</p>
						</div>
						<span className='rounded-full bg-[var(--surface-container-high)] px-[var(--spacing-md)] py-[var(--spacing-xxs)] text-[var(--font-size-label-m)] text-[var(--on-surface-variant)]'>
							{selectedPreset.channel}
						</span>
					</div>

					<div className='grid gap-[var(--spacing-sm)] md:grid-cols-2'>
						{APP_PRESETS.map(preset => {
							const isActive = preset.id === selectedPreset.id
							return (
								<button
									type='button'
									key={preset.id}
									onClick={() => {
										setSelectedPreset(preset)
									}}
									className={`flex flex-col items-start gap-[var(--spacing-xxs)] rounded-[var(--radius-lg)] border px-[var(--spacing-md)] py-[var(--spacing-sm)] text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
										isActive
											? 'border-[var(--primary)] bg-[var(--primary-container)] text-[var(--primary)]'
											: 'border-[var(--outline-variant)] bg-[var(--surface)] text-[var(--on-surface)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
									}`}
								>
									<span className='text-[var(--font-size-title-s)] font-semibold'>
										{preset.name}
									</span>
									<p className='text-[var(--font-size-body-s)] text-[var(--on-surface-variant)]'>
										{preset.description}
									</p>
								</button>
							)
						})}
					</div>

					<form className='space-y-[var(--spacing-md)] min-w-0'>
						<div className='grid gap-[var(--spacing-md)] md:grid-cols-2'>
							<label className='space-y-[var(--spacing-xxs)]'>
								<span className='text-[var(--font-size-label-m)] text-[var(--on-surface-variant)]'>
									Nom de l’app
								</span>
								<input
									type='text'
									value={appName}
									onChange={event => setAppName(event.target.value)}
									className='w-full rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-body-m)] text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]'
								/>
							</label>
							<label className='space-y-[var(--spacing-xxs)]'>
								<span className='text-[var(--font-size-label-m)] text-[var(--on-surface-variant)]'>
									Audiència
								</span>
								<input
									type='text'
									value={audience}
									onChange={event => setAudience(event.target.value)}
									className='w-full rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-body-m)] text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]'
								/>
							</label>
						</div>

						<div className='grid gap-[var(--spacing-md)] md:grid-cols-2'>
							<label className='space-y-[var(--spacing-xxs)]'>
								<span className='text-[var(--font-size-label-m)] text-[var(--on-surface-variant)]'>
									Workflow connectat (id o nom)
								</span>
								<input
									type='text'
									value={workflow}
									onChange={event => setWorkflow(event.target.value)}
									placeholder='Ex: tender-scrutinizer (només referència)'
									className='w-full rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-body-m)] text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]'
								/>
							</label>
							<label className='space-y-[var(--spacing-xxs)]'>
								<span className='text-[var(--font-size-label-m)] text-[var(--on-surface-variant)]'>
									Canal de publicació
								</span>
								<select
									value={selectedPreset.channel}
									onChange={() => {
										const next =
											selectedPreset.channel === 'Intern' ? 'Extern' : 'Intern'
										const candidate =
											APP_PRESETS.find(preset => preset.channel === next) ??
											DEFAULT_PRESET
										setSelectedPreset(candidate)
									}}
									className='w-full rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-body-m)] text-[var(--on-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]'
								>
									<option value='Intern'>Intern</option>
									<option value='Extern'>Extern</option>
								</select>
							</label>
						</div>

						<div className='space-y-[var(--spacing-xxs)] rounded-[var(--radius-lg)] border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-[var(--spacing-md)]'>
							<p className='text-[var(--font-size-body-m)] text-[var(--on-surface)]'>
								Resum de publicació
							</p>
							<ul className='flex flex-wrap gap-[var(--spacing-xs)] text-[var(--font-size-label-m)] text-[var(--primary)]'>
								<li className='rounded-full bg-[var(--surface-container-high)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)]'>
									{appName || 'Aplicació'}
								</li>
								<li className='rounded-full bg-[var(--surface-container-high)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)]'>
									{audience || 'Audiència'}
								</li>
								<li className='rounded-full bg-[var(--surface-container-high)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)]'>
									Workflow: {workflow || 'referència opcional'}
								</li>
								<li className='rounded-full bg-[var(--surface-container-high)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)]'>
									Canal: {selectedPreset.channel}
								</li>
							</ul>
							<p className='text-[var(--font-size-body-s)] text-[var(--on-surface-variant)]'>
								{rolloutNote}
							</p>
						</div>

						<div className='flex flex-wrap items-center gap-[var(--spacing-sm)]'>
							<button
								type='button'
								className='inline-flex items-center gap-[var(--spacing-xxs)] rounded-[var(--radius-lg)] border border-[var(--primary)] bg-[var(--primary-container)] px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-[var(--font-size-label-m)] text-[var(--primary)] transition hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
							>
								Publicar demo
							</button>
							<button
								type='button'
								className='inline-flex items-center gap-[var(--spacing-xxs)] rounded-[var(--radius-lg)] border border-[var(--outline-variant)] px-[var(--spacing-lg)] py-[var(--spacing-sm)] text-[var(--font-size-label-m)] text-[var(--on-surface)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
							>
								Guardar com esborrany
							</button>
						</div>
					</form>
				</section>

				<aside className='space-y-[var(--spacing-md)] rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-[var(--spacing-lg)] shadow-elevation-1 min-w-0'>
					<div className='space-y-[var(--spacing-xxs)]'>
						<p className='text-[var(--font-size-label-m)] uppercase tracking-wide text-[var(--primary)]'>
							Apps publicades
						</p>
						<p className='text-[var(--font-size-body-m)] text-[var(--on-surface-variant)]'>
							Llista simulada per ensenyar estat, canal i audiència.
						</p>
					</div>

					<div className='overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface-container)]'>
						<table className='w-full min-w-[680px] border-collapse text-left text-[var(--font-size-body-s)] text-[var(--on-surface)]'>
							<thead className='bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]'>
								<tr>
									<th className='px-[var(--spacing-md)] py-[var(--spacing-sm)]'>
										Nom
									</th>
									<th className='px-[var(--spacing-md)] py-[var(--spacing-sm)]'>
										Canal
									</th>
									<th className='px-[var(--spacing-md)] py-[var(--spacing-sm)]'>
										Audiència
									</th>
									<th className='px-[var(--spacing-md)] py-[var(--spacing-sm)]'>
										Estat
									</th>
									<th className='px-[var(--spacing-md)] py-[var(--spacing-sm)] text-right'>
										Accions
									</th>
								</tr>
							</thead>
							<tbody>
								{PUBLISHED_APPS.map(app => (
									<tr
										key={app.id}
										className='border-t border-[var(--outline-variant)] transition hover:bg-[var(--surface-container-low)]'
									>
										<td className='px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-body-m)] font-semibold'>
											{app.name}
										</td>
										<td className='px-[var(--spacing-md)] py-[var(--spacing-sm)]'>
											{app.channel}
										</td>
										<td className='px-[var(--spacing-md)] py-[var(--spacing-sm)]'>
											{app.audience}
										</td>
										<td className='px-[var(--spacing-md)] py-[var(--spacing-sm)]'>
											<span
												className={`rounded-full px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-[var(--font-size-label-s)] ${
													app.status === 'Publicat'
														? 'bg-[var(--primary-container)] text-[var(--primary)]'
														: 'bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]'
												}`}
											>
												{app.status}
											</span>
										</td>
										<td className='px-[var(--spacing-md)] py-[var(--spacing-sm)] text-right'>
											<Link
												to='/product/apps'
												search={{ appId: app.id }}
												className='rounded-[var(--radius-lg)] border border-[var(--outline-variant)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-[var(--font-size-label-s)] text-[var(--primary)] transition hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
											>
												Previsualitzar
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className='space-y-[var(--spacing-xxs)] rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface)] p-[var(--spacing-md)]'>
						<p className='text-[var(--font-size-title-s)] font-semibold'>
							Instruccions d’embed
						</p>
						<p className='text-[var(--font-size-body-s)] text-[var(--on-surface-variant)]'>
							Còpia aquest codi simulat per ensenyar com incrustar l’app en
							WordPress o intranet.
						</p>
						<pre className='overflow-auto whitespace-pre-wrap break-words rounded-[var(--radius-md)] bg-[var(--surface-container-high)] p-[var(--spacing-sm)] text-[var(--font-size-code-m)] text-[var(--on-surface)]'>
							{`<iframe
  src="https://demo.iapacte.local/apps/${selectedPreset.id}"
  title="${appName}"
  style="width:100%;height:480px;border:0;border-radius:16px;"
></iframe>`}
						</pre>
					</div>
				</aside>
			</div>

			<Dialog.Root
				open={Boolean(activeApp)}
				onOpenChange={isOpen => {
					if (!isOpen) {
						closeDialog()
					}
				}}
			>
				<Dialog.Portal>
					<Dialog.Backdrop className='fixed inset-0 bg-[color-mix(in_srgb,var(--scrim)_60%,transparent)] backdrop-blur-[4px] transition duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute' />
					<Dialog.Viewport className='fixed inset-0 flex items-center justify-center px-[var(--spacing-lg)] py-[var(--spacing-xl)]'>
						<Dialog.Popup className='relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface)] p-[var(--spacing-xl)] text-[var(--on-surface)] shadow-elevation-1 transition duration-200 data-[starting-style]:translate-y-[var(--spacing-xs)] data-[starting-style]:opacity-0 data-[ending-style]:translate-y-[var(--spacing-xs)] data-[ending-style]:opacity-0'>
							<div className='flex flex-wrap items-start justify-between gap-[var(--spacing-sm)]'>
								<div className='space-y-[var(--spacing-xxs)]'>
									<Dialog.Title className='text-[var(--font-size-title-l)] font-semibold'>
										{activeApp?.name}
									</Dialog.Title>
									<Dialog.Description className='text-[var(--font-size-body-m)] text-[var(--on-surface-variant)]'>
										{activeApp?.description ?? 'App simulada per la demo.'}
									</Dialog.Description>
									<div className='flex flex-wrap gap-[var(--spacing-xxs)] text-[var(--font-size-label-m)]'>
										<span className='rounded-full bg-[var(--primary-container)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-[var(--primary)]'>
											Canal: {activeApp?.channel}
										</span>
										<span className='rounded-full bg-[var(--surface-container-high)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-[var(--on-surface)]'>
											Audiència: {activeApp?.audience}
										</span>
										<span
											className={`rounded-full px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-[var(--primary)] ${
												activeApp?.status === 'Publicat'
													? 'bg-[var(--primary-container)]'
													: 'bg-[var(--surface-container-high)]'
											}`}
										>
											Estat: {activeApp?.status}
										</span>
									</div>
								</div>
								<Dialog.Close className='rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-high)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-[var(--font-size-label-m)] text-[var(--on-surface)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'>
									Tancar
								</Dialog.Close>
							</div>

							<div className='mt-[var(--spacing-md)] space-y-[var(--spacing-xxs)]'>
								<p className='text-[var(--font-size-title-s)] font-semibold'>
									App simulada
								</p>
								{previewContent}
							</div>
						</Dialog.Popup>
					</Dialog.Viewport>
				</Dialog.Portal>
			</Dialog.Root>
		</section>
	)
}
