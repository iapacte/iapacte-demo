import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo, useRef, useState } from 'react'

const PRODUCT_LINKS = [
	{
		to: '/product/workflows',
		label: 'Workflows d’IA governats',
		summary:
			"Passos clau, dades d'entrada i enllaç al canvas de demo per cada workflow.",
	},
	{
		to: '/product/tenders',
		label: 'Arxiu de licitacions i subvencions',
		summary:
			'Vista tipus carpeta amb expedients, annexos i plantilles de xat d’IA.',
	},
	{
		to: '/product/data/connectors',
		label: 'Connectors de dades',
		summary:
			'Galeria de connectors simulats (ERP, padró, portal obert) per mostrar en directe.',
	},
	{
		to: '/product/templates',
		label: 'Plantilles d’IA',
		summary:
			'Catàleg de prompts governats per informes, respostes veïnals i esmenes jurídiques.',
	},
	{
		to: '/product/apps',
		label: 'Apps internes i embeds',
		summary:
			'Construeix xats connectats a workflows o formularis WordPress sense backend real.',
	},
] as const

const PERSONAS = [
	{
		id: 'alcaldia',
		label: 'Alcaldia',
		description: 'Vol impacte ràpid i missatge polític clar.',
	},
	{
		id: 'serveis',
		label: 'Cap de servei',
		description: 'Necessita veure el flux complet amb dades fiables.',
	},
	{
		id: 'intervencio',
		label: 'Intervenció / Secretaria',
		description: 'Prioritza traçabilitat, riscos i informes.',
	},
] as const
const FILTER_OPTIONS: { id: PersonaId | 'all'; label: string }[] = [
	{ id: 'all', label: 'Tots els perfils' },
	...PERSONAS,
]

type PersonaId = (typeof PERSONAS)[number]['id']

type UseCaseLink = {
	id: string
	label: string
	summary: string
	personas: PersonaId[]
	destinations: {
		label: string
		to: string
		params?: Record<string, string>
		hash?: string
	}[]
}

const USE_CASES: UseCaseLink[] = [
	{
		id: 'uc-tender-canvas',
		label: 'Canvas de revisió de licitació',
		summary:
			'Mostra el flux tender-scrutinizer amb passos traçables per a la comissió.',
		personas: ['intervencio'],
		destinations: [
			{
				label: 'Workflows: Analitzador de licitacions',
				to: '/product/workflows/$workflowId',
				params: { workflowId: 'tender-scrutinizer' },
			},
		],
	},
	{
		id: 'uc-citizen-routing',
		label: 'Derivar consultes ciutadanes',
		summary:
			'Centraleta que classifica i deriva consultes amb resposta en llenguatge planer.',
		personas: ['serveis', 'alcaldia'],
		destinations: [
			{
				label: 'Workflows: Centraleta ciutadana',
				to: '/product/workflows/$workflowId',
				params: { workflowId: 'citizen-switchboard' },
			},
		],
	},
	{
		id: 'uc-budget-pulse',
		label: 'Pressupost viu per comissió',
		summary:
			'Seguiment de desviacions pressupostàries amb alertes per servei i barri.',
		personas: ['intervencio', 'serveis'],
		destinations: [
			{
				label: 'Workflows: Pressupost viu',
				to: '/product/workflows/$workflowId',
				params: { workflowId: 'budget-pulse' },
			},
		],
	},
	{
		id: 'uc-crisis-brief',
		label: 'Briefing de crisi per alcaldia',
		summary: 'Resums ràpids d’incidències i missatges clau per roda de premsa.',
		personas: ['alcaldia', 'serveis'],
		destinations: [
			{
				label: 'Workflows: Briefing de crisi',
				to: '/product/workflows/$workflowId',
				params: { workflowId: 'emergency-brief' },
			},
		],
	},
	{
		id: 'uc-tenders-vault',
		label: 'Arxiu de licitacions 2024',
		summary:
			'Carpetes amb expedients, annexos i memòries per ensenyar sense connexió.',
		personas: ['intervencio', 'serveis'],
		destinations: [
			{ label: 'Tenders: Arxiu', to: '/product/tenders' },
			{
				label: 'Tenders: Taula demo',
				to: '/product/tenders',
				hash: 'taula-demo',
			},
		],
	},
	{
		id: 'uc-templates',
		label: 'Plantilles d’IA governades',
		summary:
			'Prompts per informes de comissió, respostes veïnals i esmenes jurídiques.',
		personas: ['intervencio', 'serveis'],
		destinations: [
			{ label: 'Templates: Catàleg', to: '/product/templates' },
			{ label: 'Workflows: Catàleg', to: '/product/workflows' },
		],
	},
	{
		id: 'uc-apps',
		label: 'Publicar apps internes o externes',
		summary:
			'Crea xats connectats a workflows o formularis incrustats per portals.',
		personas: ['serveis', 'intervencio'],
		destinations: [{ label: 'Apps i embeds', to: '/product/apps' }],
	},
	{
		id: 'uc-connectors',
		label: 'Connectors: ERP + padró',
		summary:
			'Galeria de connectors simulats amb ERP, padró i portal de dades obertes.',
		personas: ['intervencio', 'serveis'],
		destinations: [
			{ label: 'Data: Connectors', to: '/product/data/connectors' },
			{
				label: 'Data: Graella demo',
				to: '/product/data',
				hash: 'graella-demo',
			},
		],
	},
	{
		id: 'uc-data-layer',
		label: 'Capa de dades municipal',
		summary:
			'Taules compartides de contractacions, subvencions i incidències per a tots els equips.',
		personas: ['alcaldia', 'serveis', 'intervencio'],
		destinations: [
			{ label: 'Data: Fitxa', to: '/product/data' },
			{
				label: 'Data: Graella demo',
				to: '/product/data',
				hash: 'graella-demo',
			},
		],
	},
] as const

function DemoHub() {
	const [persona, setPersona] = useState<PersonaId | 'all'>('all')
	const filterContainerRef = useRef<HTMLDivElement | null>(null)

	const personaCopy = useMemo(() => {
		const found = PERSONAS.find(p => p.id === persona)
		return found
			? `Mostrem el recorregut pensant en ${found.label.toLowerCase()}: ${found.description}`
			: 'Mostrem un recorregut adaptat a cada perfil.'
	}, [persona])

	const filteredUseCases = useMemo(
		() =>
			persona === 'all'
				? USE_CASES
				: USE_CASES.filter(useCase =>
						useCase.personas.includes(persona as PersonaId),
					),
		[persona],
	)

	return (
		<main className='mx-auto flex w-full max-w-6xl flex-col gap-[var(--spacing-xl)] px-[var(--spacing-lg)] py-[var(--spacing-xxl)]'>
			<section className='space-y-[var(--spacing-md)]'>
				<p className='text-[var(--font-size-label-l)] uppercase tracking-wide text-[var(--primary)]'>
					Iapacte Demo Hub
				</p>
				<div className='space-y-[var(--spacing-xs)]'>
					<h1 className='text-[var(--font-size-display-s)] font-semibold'>
						Tria el relat que vols ensenyar en la reunió.
					</h1>
					<p className='text-[var(--font-size-body-l)] text-[var(--on-surface-variant)]'>
						{personaCopy}
					</p>
				</div>

				<div
					className='flex gap-[var(--spacing-sm)] overflow-x-auto pb-[var(--spacing-sm)]'
					ref={filterContainerRef}
				>
					{FILTER_OPTIONS.map(option => {
						const isActive = option.id === persona
						return (
							<button
								key={option.id}
								type='button'
								onClick={() => setPersona(option.id)}
								className={`shrink-0 rounded-full border px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--font-size-label-m)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
									isActive
										? 'border-[var(--primary)] bg-[var(--primary-container)] text-[var(--primary)]'
										: 'border-[var(--outline-variant)] text-[var(--on-surface)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
								}`}
							>
								{option.label}
							</button>
						)
					})}
				</div>
			</section>

			<section className='space-y-[var(--spacing-md)]'>
				<div className='space-y-[var(--spacing-xxs)]'>
					<p className='text-[var(--font-size-label-l)] uppercase tracking-wide text-[var(--primary)]'>
						Use cases per perfil
					</p>
					<p className='text-[var(--font-size-body-l)] text-[var(--on-surface-variant)] max-w-3xl'>
						Una sola llista (8 opcions) per combinar relats i fitxes de
						producte. Canvia el perfil per filtrar ràpidament què ensenyes.
					</p>
				</div>

				<div className='grid gap-[var(--spacing-lg)] md:grid-cols-3'>
					{filteredUseCases.map(useCase => {
						const personaLabels = useCase.personas.map(
							pid => PERSONAS.find(p => p.id === pid)?.label ?? pid,
						)
						return (
							<div
								key={useCase.id}
								className='rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface-container)] p-[var(--spacing-lg)] shadow-elevation-1'
							>
								<div className='flex items-start justify-between gap-[var(--spacing-sm)]'>
									<h2 className='text-[var(--font-size-title-m)] font-semibold'>
										{useCase.label}
									</h2>
									<span
										aria-hidden='true'
										className='text-[var(--font-size-title-m)]'
									>
										↗
									</span>
								</div>
								<p className='mt-[var(--spacing-xs)] text-[var(--font-size-body-m)] text-[var(--on-surface-variant)]'>
									{useCase.summary}
								</p>
								<ul className='mt-[var(--spacing-sm)] flex flex-wrap gap-[var(--spacing-xs)] text-[var(--font-size-label-s)] text-[var(--primary)]'>
									{personaLabels.map(label => (
										<li
											key={label}
											className='rounded-full bg-[var(--primary-container)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)]'
										>
											Per a: {label}
										</li>
									))}
								</ul>
								<div className='mt-[var(--spacing-sm)] flex flex-wrap gap-[var(--spacing-xs)]'>
									{useCase.destinations.map(dest => (
										<Link
											key={dest.label + dest.to}
											to={dest.to}
											{...(dest.hash ? { hash: dest.hash } : {})}
											{...(dest.params ? { params: dest.params } : {})}
											className='inline-flex items-center gap-[var(--spacing-xxs)] rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-high)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-[var(--font-size-label-m)] text-[var(--primary)] transition hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
										>
											{dest.label}
										</Link>
									))}
								</div>
							</div>
						)
					})}
				</div>
			</section>

			<section className='space-y-[var(--spacing-md)]'>
				<div className='space-y-[var(--spacing-xxs)]'>
					<p className='text-[var(--font-size-label-l)] uppercase tracking-wide text-[var(--primary)]'>
						Categories de producte
					</p>
					<p className='text-[var(--font-size-body-l)] text-[var(--on-surface-variant)] max-w-3xl'>
						Llista vertical de fitxes per explicar l’arquitectura de producte
						sense barreges de use cases.
					</p>
				</div>
				<div className='flex flex-col gap-[var(--spacing-sm)]'>
					{PRODUCT_LINKS.map(link => (
						<Link
							key={link.to}
							to={link.to}
							className='flex items-start justify-between gap-[var(--spacing-md)] rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface-container)] px-[var(--spacing-lg)] py-[var(--spacing-md)] shadow-elevation-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] hover:border-[var(--primary)]'
						>
							<div className='space-y-[var(--spacing-xxs)]'>
								<h2 className='text-[var(--font-size-title-m)] font-semibold'>
									{link.label}
								</h2>
								<p className='text-[var(--font-size-body-m)] text-[var(--on-surface-variant)]'>
									{link.summary}
								</p>
							</div>
							<span
								aria-hidden='true'
								className='text-[var(--font-size-title-m)] text-[var(--primary)]'
							>
								↗
							</span>
						</Link>
					))}
				</div>
			</section>
		</main>
	)
}

export const Route = createFileRoute('/')({
	component: DemoHub,
	head: () => ({
		meta: [
			{
				title: 'Relat Data Collector + Tenders & Grants + Workflows',
			},
			{
				name: 'description',
				content:
					'Mostra recollida de dades, arxiu de licitacions i workflows municipals en un mateix relat per als consistoris.',
			},
		],
	}),
})
