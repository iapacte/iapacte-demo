import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	Check,
	Loader2,
	Sparkles,
	Wand2,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type Column = {
	key: string
	label: string
	isCurrency?: boolean
}

type DataRow = {
	id: string
	etiquetes?: string[]
	[key: string]: string | number | string[] | undefined
}

type Dataset = {
	id: string
	name: string
	description: string
	columns: Column[]
	rows: DataRow[]
	defaultSort?: { key: string; direction: 'asc' | 'desc' }
}

type SavedView = {
	id: string
	label: string
	description: string
	datasetId: Dataset['id']
	search?: string
	sort?: { key: string; direction: 'asc' | 'desc' }
	tags?: string[]
}

const DATASETS: Dataset[] = [
	{
		id: 'contractacions',
		name: 'Línies de contractació',
		description:
			'Procés de revisió amb imports, risc i fase per explicar l’impacte a la comissió.',
		defaultSort: { key: 'import', direction: 'desc' },
		columns: [
			{ key: 'expedient', label: 'Expedient' },
			{ key: 'area', label: 'Àrea' },
			{ key: 'fase', label: 'Fase' },
			{ key: 'risc', label: 'Risc' },
			{ key: 'import', label: 'Import', isCurrency: true },
			{ key: 'impacte', label: 'Impacte veïnal' },
			{ key: 'etiquetes', label: 'Etiquetes' },
		],
		rows: [
			{
				id: 'exp-2401',
				expedient: 'Renovació Plaça Major',
				area: 'Urbanisme',
				fase: 'Publicat',
				risc: 'Mitjà',
				import: 420_000,
				impacte: 'Barri centre',
				etiquetes: ['Obres', 'Clima', 'Barri centre'],
			},
			{
				id: 'exp-2402',
				expedient: 'Neteja viària 2025',
				area: 'Manteniment',
				fase: 'En revisió',
				risc: 'Alt',
				import: 890_000,
				impacte: 'Ciutat completa',
				etiquetes: ['Contractació', 'Urgent', 'Pressupost'],
			},
			{
				id: 'exp-2403',
				expedient: 'Sensors mobilitat estiu',
				area: 'Mobilitat',
				fase: 'Esborrany',
				risc: 'Baix',
				import: 210_000,
				impacte: 'Barris cèntrics',
				etiquetes: ['Mobilitat', 'Dades'],
			},
			{
				id: 'exp-2404',
				expedient: 'Il·luminació segura',
				area: 'Seguretat',
				fase: 'Publicat',
				risc: 'Mitjà',
				import: 310_000,
				impacte: 'Rutes escolars',
				etiquetes: ['Seguretat', 'Barri oest'],
			},
			{
				id: 'exp-2405',
				expedient: 'Reforç centres cívics',
				area: 'Benestar',
				fase: 'En adjudicació',
				risc: 'Alt',
				import: 640_000,
				impacte: 'Barris vulnerables',
				etiquetes: ['Benestar', 'Barri nord', 'Urgent'],
			},
		],
	},
	{
		id: 'subvencions',
		name: 'Subvencions per barri',
		description:
			'Seguiment de programes amb estat, barri i impacte per preparar una resposta ràpida.',
		defaultSort: { key: 'import', direction: 'desc' },
		columns: [
			{ key: 'programa', label: 'Programa' },
			{ key: 'barri', label: 'Barri' },
			{ key: 'estat', label: 'Estat' },
			{ key: 'import', label: 'Import', isCurrency: true },
			{ key: 'impacte', label: 'Impacte' },
			{ key: 'etiquetes', label: 'Etiquetes' },
		],
		rows: [
			{
				id: 'sub-01',
				programa: 'Habitatge social 2024',
				barri: 'Barri nord',
				estat: 'Convocada',
				import: 520_000,
				impacte: 'Famílies vulnerables',
				etiquetes: ['Habitatge', 'Seguiment'],
			},
			{
				id: 'sub-02',
				programa: 'Transició energètica',
				barri: 'Ciutat completa',
				estat: 'En revisió',
				import: 310_000,
				impacte: 'Comunitats de veïns',
				etiquetes: ['Clima', 'Energia'],
			},
			{
				id: 'sub-03',
				programa: 'Activitats culturals',
				barri: 'Barri centre',
				estat: 'En pagament',
				import: 120_000,
				impacte: 'Entitats locals',
				etiquetes: ['Cultura', 'Rapidesa'],
			},
			{
				id: 'sub-04',
				programa: 'Zones verdes escolars',
				barri: 'Rutes escolars',
				estat: 'Convocada',
				import: 260_000,
				impacte: 'Alumnes i AMPAs',
				etiquetes: ['Educació', 'Clima'],
			},
		],
	},
	{
		id: 'incidencies',
		name: 'Incidències veïnals',
		description:
			'Central d’incidències registrades per telèfon i xat municipal.',
		defaultSort: { key: 'estat', direction: 'asc' },
		columns: [
			{ key: 'tipus', label: 'Tipus' },
			{ key: 'barri', label: 'Barri' },
			{ key: 'estat', label: 'Estat' },
			{ key: 'servei', label: 'Servei responsable' },
			{ key: 'etiquetes', label: 'Etiquetes' },
		],
		rows: [
			{
				id: 'inc-01',
				tipus: 'Soroll nocturn',
				barri: 'Barri centre',
				estat: 'En curs',
				servei: 'Medi Ambient',
				etiquetes: ['Soroll', 'Barri centre'],
			},
			{
				id: 'inc-02',
				tipus: 'Enllumenat avariat',
				barri: 'Barri nord',
				estat: 'Assignada',
				servei: 'Manteniment',
				etiquetes: ['Enllumenat', 'Seguretat'],
			},
			{
				id: 'inc-03',
				tipus: 'Vorera malmesa',
				barri: 'Barri oest',
				estat: 'Tancada',
				servei: 'Obres',
				etiquetes: ['Obres', 'Accessibilitat'],
			},
		],
	},
]

const SAVED_VIEWS: SavedView[] = [
	{
		id: 'comissio-urb',
		label: 'Comissió urbanisme',
		description:
			'Import per barri i risc per preparar l’ordre del dia de la comissió.',
		datasetId: 'contractacions',
		search: 'barri',
		sort: { key: 'import', direction: 'desc' },
		tags: ['Obres', 'Clima'],
	},
	{
		id: 'intervencio',
		label: 'Intervenció ràpida',
		description:
			'Filtre de risc i estat per accelerar l’informe d’intervenció i secretaria.',
		datasetId: 'contractacions',
		sort: { key: 'risc', direction: 'asc' },
		tags: ['Contractació', 'Urgent'],
	},
	{
		id: 'subvencions-barri',
		label: 'Subvencions per barri',
		description: 'Subvencions per barri i impacte per la resposta ràpida.',
		datasetId: 'subvencions',
		search: 'barri',
		tags: ['Habitatge', 'Educació'],
	},
]

type SortState = { key: string | null; direction: 'asc' | 'desc' }

const currencyFormatter = new Intl.NumberFormat('ca-ES', {
	style: 'currency',
	currency: 'EUR',
	maximumFractionDigits: 0,
})

export function DataCollectorBoard() {
	const [activeDatasetId, setActiveDatasetId] = useState<Dataset['id']>(
		DATASETS[0]?.id ?? 'contractacions',
	)
	const [search, setSearch] = useState('')
	const [tagFilters, setTagFilters] = useState<Set<string>>(new Set())
	const [sort, setSort] = useState<SortState>({
		key: DATASETS[0]?.defaultSort?.key ?? null,
		direction: DATASETS[0]?.defaultSort?.direction ?? 'asc',
	})
	const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
	const [savedView, setSavedView] = useState<SavedView | null>(null)
	const [noteTick, setNoteTick] = useState(0)

	const dataset = useMemo(
		() => DATASETS.find(entry => entry.id === activeDatasetId) ?? DATASETS[0],
		[activeDatasetId],
	)

	useEffect(() => {
		setSort({
			key: dataset?.defaultSort?.key ?? null,
			direction: dataset?.defaultSort?.direction ?? 'asc',
		})
		setSelectedRows(new Set())
		setTagFilters(new Set())
		setSavedView(null)
		setSearch('')
	}, [
		dataset?.defaultSort?.direction,
		dataset?.defaultSort?.key,
		activeDatasetId,
	])

	const availableTags = useMemo(() => {
		const allTags = dataset?.rows.flatMap(row => row.etiquetes ?? []) ?? []
		return Array.from(new Set(allTags))
	}, [dataset])

	const toggleTag = (tag: string) => {
		setTagFilters(prev => {
			const next = new Set(prev)
			if (next.has(tag)) {
				next.delete(tag)
			} else {
				next.add(tag)
			}
			return next
		})
	}

	const filteredRows = useMemo(() => {
		if (!dataset) return []
		const searchTerm = search.trim().toLowerCase()
		return dataset.rows.filter(row => {
			const matchesSearch = searchTerm
				? dataset.columns.some(column => {
						const value = row[column.key]
						if (value === undefined || value === null) return false
						return String(value).toLowerCase().includes(searchTerm)
					})
				: true

			const matchesTags =
				tagFilters.size === 0
					? true
					: (row.etiquetes ?? []).some(tag => tagFilters.has(tag))

			return matchesSearch && matchesTags
		})
	}, [dataset, search, tagFilters])

	const sortedRows = useMemo(() => {
		if (!dataset) return []
		if (!sort.key) return filteredRows
		const rowsCopy = [...filteredRows]
		rowsCopy.sort((a, b) => {
			const valueA = a[sort.key!]
			const valueB = b[sort.key!]
			if (typeof valueA === 'number' && typeof valueB === 'number') {
				return sort.direction === 'asc' ? valueA - valueB : valueB - valueA
			}
			const stringA = String(valueA ?? '').toLowerCase()
			const stringB = String(valueB ?? '').toLowerCase()
			return sort.direction === 'asc'
				? stringA.localeCompare(stringB)
				: stringB.localeCompare(stringA)
		})
		return rowsCopy
	}, [filteredRows, sort, dataset])

	const stats = useMemo(() => {
		const totalVisible = sortedRows.length
		const totalSelected = sortedRows.filter(row =>
			selectedRows.has(row.id),
		).length
		const totalImport = sortedRows.reduce((acc, row) => {
			const value = row.import
			if (typeof value === 'number') {
				return acc + value
			}
			return acc
		}, 0)
		return {
			totalVisible,
			totalSelected,
			totalImport:
				totalImport > 0 ? currencyFormatter.format(totalImport) : '—',
		}
	}, [sortedRows, selectedRows])

	const aiNote = useMemo(() => {
		if (!dataset) return 'Cap resum disponible.'
		const focusRows =
			selectedRows.size > 0
				? sortedRows.filter(row => selectedRows.has(row.id)).slice(0, 3)
				: sortedRows.slice(0, 3)

		const titles = focusRows
			.map(row => row[dataset.columns[0]?.key ?? ''])
			.filter(Boolean)
		const tagsUsed = new Set(focusRows.flatMap(row => row.etiquetes ?? []))

		return [
			`Resum per a ${dataset.name.toLowerCase()}.`,
			titles.length > 0
				? `Peces clau destacades: ${titles.join(', ')}.`
				: 'Encara no hi ha elements destacats.',
			tagsUsed.size > 0
				? `Tags mostrats a la reunió: ${Array.from(tagsUsed).join(', ')}.`
				: 'Afegirem tags quan seleccionis files.',
			selectedRows.size > 0
				? 'Hem prioritzat el resum amb la selecció manual.'
				: 'Sense selecció manual: ordre per import i risc.',
		].join(' ')
	}, [dataset, sortedRows, selectedRows, noteTick])

	const applySavedView = (view: SavedView) => {
		setActiveDatasetId(view.datasetId)
		if (view.search !== undefined) {
			setSearch(view.search)
		}
		if (view.sort) {
			setSort({ key: view.sort.key, direction: view.sort.direction })
		}
		if (view.tags) {
			setTagFilters(new Set(view.tags))
		} else {
			setTagFilters(new Set())
		}
		setSavedView(view)
	}

	const toggleRowSelection = (rowId: string) => {
		setSelectedRows(prev => {
			const next = new Set(prev)
			if (next.has(rowId)) {
				next.delete(rowId)
			} else {
				next.add(rowId)
			}
			return next
		})
	}

	const handleSort = (key: string) => {
		setSort(prev => {
			if (prev.key === key) {
				return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
			}
			return { key, direction: 'asc' }
		})
	}

	const allRowsVisibleSelected =
		sortedRows.length > 0 && sortedRows.every(row => selectedRows.has(row.id))

	return (
		<section className='min-h-[80vh] w-full overflow-x-auto px-[var(--spacing-lg)] py-[var(--spacing-xl)] flex flex-col gap-[var(--spacing-lg)]'>
			<header className='space-y-[var(--spacing-xs)] max-w-5xl'>
				<p className='text-[var(--font-size-label-l)] uppercase tracking-wide text-[var(--primary)]'>
					Data Collector
				</p>
				<h1 className='text-[var(--font-size-display-s)] font-semibold'>
					Graella comuna per ensenyar dades de contractació, subvencions i
					incidències.
				</h1>
				<p className='text-[var(--font-size-body-l)] text-[var(--on-surface-variant)]'>
					Tot és offline i editable: filtres ràpids, vistes guardades per perfil
					i un resum que pots llegir en veu alta a la sala.
				</p>
			</header>

			<div className='overflow-x-auto'>
				<div className='flex min-w-max flex-nowrap gap-[var(--spacing-sm)] md:min-w-0 md:flex-wrap'>
					{SAVED_VIEWS.map(view => {
						const isActive = savedView?.id === view.id
						return (
							<button
								key={view.id}
								type='button'
								onClick={() => applySavedView(view)}
								className={`rounded-full border px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--font-size-label-m)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
									isActive
										? 'border-[var(--primary)] bg-[var(--primary-container)] text-[var(--primary)]'
										: 'border-[var(--outline-variant)] text-[var(--on-surface)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
								}`}
							>
								{view.label}
							</button>
						)
					})}
				</div>
			</div>

			<div className='grid min-w-0 gap-[var(--spacing-lg)] md:grid-cols-[320px,1fr] lg:grid-cols-[360px,1fr]'>
				<aside className='space-y-[var(--spacing-lg)] min-w-0'>
					<div className='rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-[var(--spacing-lg)] space-y-[var(--spacing-md)]'>
						<div className='flex items-center justify-between gap-[var(--spacing-sm)]'>
							<div className='flex items-center gap-[var(--spacing-xs)]'>
								<Wand2
									className='h-4 w-4 text-[var(--on-surface-variant)]'
									aria-hidden
								/>
								<p className='text-[var(--font-size-title-s)] font-semibold'>
									Explora datasets
								</p>
							</div>
							<button
								type='button'
								onClick={() => setNoteTick(prev => prev + 1)}
								className='inline-flex items-center gap-[var(--spacing-xxs)] rounded-full border border-[var(--outline-variant)] bg-[var(--surface)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-[var(--font-size-label-s)] text-[var(--on-surface-variant)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
							>
								<Sparkles className='h-3 w-3' aria-hidden />
								Refrescar resum
							</button>
						</div>

						<div className='space-y-[var(--spacing-xs)]'>
							<p className='text-[var(--font-size-label-s)] font-medium text-[var(--on-surface-variant)]'>
								Datasets
							</p>
							<div className='flex flex-col gap-[var(--spacing-xxs)]'>
								{DATASETS.map(option => {
									const isActive = option.id === activeDatasetId
									return (
										<button
											key={option.id}
											type='button'
											onClick={() => setActiveDatasetId(option.id)}
											className={`rounded-[var(--radius-lg)] border px-[var(--spacing-md)] py-[var(--spacing-sm)] text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
												isActive
													? 'border-[var(--primary)] bg-[var(--primary-container)] text-[var(--primary)]'
													: 'border-[var(--outline-variant)] text-[var(--on-surface)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
											}`}
										>
											<p className='font-semibold text-[var(--font-size-body-m)]'>
												{option.name}
											</p>
											<p className='text-[var(--font-size-body-s)] text-[var(--on-surface-variant)]'>
												{option.description}
											</p>
										</button>
									)
								})}
							</div>
						</div>
					</div>

					<div className='rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-[var(--spacing-lg)] space-y-[var(--spacing-md)]'>
						<div className='space-y-[var(--spacing-xs)]'>
							<p className='text-[var(--font-size-title-s)] font-semibold'>
								Filtre de cerca
							</p>
							<input
								type='search'
								placeholder='Cercar per text...'
								value={search}
								onChange={e => setSearch(e.target.value)}
								className='w-full rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--font-size-body-s)] text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]'
							/>
						</div>

						<div className='space-y-[var(--spacing-xs)]'>
							<p className='text-[var(--font-size-title-s)] font-semibold'>
								Etiquetes
							</p>
							<div className='flex flex-wrap gap-[var(--spacing-xs)]'>
								{availableTags.map(tag => {
									const isSelected = tagFilters.has(tag)
									return (
										<button
											type='button'
											key={tag}
											onClick={() => toggleTag(tag)}
											className={`rounded-full border px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-[var(--font-size-label-s)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
												isSelected
													? 'border-[var(--primary)] bg-[var(--primary-container)] text-[var(--primary)]'
													: 'border-[var(--outline-variant)] text-[var(--on-surface)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
											}`}
										>
											{tag}
										</button>
									)
								})}
							</div>
						</div>

						<div className='space-y-[var(--spacing-sm)] rounded-[var(--radius-lg)] border border-dashed border-[var(--outline-variant)] bg-[var(--surface)] p-[var(--spacing-md)]'>
							<p className='text-[var(--font-size-label-m)] font-semibold'>
								Resum en veu alta (simulat)
							</p>
							<p className='text-[var(--font-size-body-s)] text-[var(--on-surface-variant)]'>
								{aiNote}
							</p>
							<div className='flex flex-wrap gap-[var(--spacing-sm)] text-[var(--font-size-label-s)] text-[var(--on-surface-variant)]'>
								<span className='inline-flex items-center gap-[var(--spacing-xxs)]'>
									<Check className='h-3 w-3' aria-hidden /> {stats.totalVisible}{' '}
									files
								</span>
								<span className='inline-flex items-center gap-[var(--spacing-xxs)]'>
									<Loader2 className='h-3 w-3' aria-hidden />{' '}
									{stats.totalSelected} seleccionades
								</span>
								<span className='inline-flex items-center gap-[var(--spacing-xxs)]'>
									<Sparkles className='h-3 w-3' aria-hidden /> Import:{' '}
									{stats.totalImport}
								</span>
							</div>
						</div>
					</div>
				</aside>

				<div className='space-y-[var(--spacing-md)] min-w-0'>
					<div className='flex flex-col gap-[var(--spacing-xs)] sm:flex-row sm:items-center sm:justify-between'>
						<div className='space-y-[var(--spacing-xxs)]'>
							<p className='text-[var(--font-size-label-l)] uppercase tracking-wide text-[var(--primary)]'>
								{dataset?.name}
							</p>
							<p className='text-[var(--font-size-body-m)] text-[var(--on-surface-variant)]'>
								{dataset?.description}
							</p>
						</div>
						<div className='flex flex-wrap gap-[var(--spacing-xs)] text-[var(--font-size-label-s)] text-[var(--primary)]'>
							<button
								type='button'
								onClick={() =>
									setSelectedRows(prev => {
										if (allRowsVisibleSelected) return new Set()
										return new Set(sortedRows.map(row => row.id))
									})
								}
								className='rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-high)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)] transition hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
							>
								{allRowsVisibleSelected
									? 'Desmarca totes'
									: 'Selecciona visibles'}
							</button>
						</div>
					</div>

					<div className='min-w-0 overflow-x-auto rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container)] shadow-elevation-1'>
						<table className='w-full min-w-[900px] border-collapse'>
							<thead>
								<tr className='border-b border-[var(--outline-variant)] bg-[var(--surface-container-low)]'>
									<th className='px-[var(--spacing-md)] py-[var(--spacing-sm)] text-left text-[var(--font-size-label-m)] font-semibold text-[var(--on-surface-variant)]'>
										Selecció
									</th>
									{dataset?.columns.map(column => (
										<th
											key={column.key}
											className='px-[var(--spacing-md)] py-[var(--spacing-sm)] text-left text-[var(--font-size-label-m)] font-semibold text-[var(--on-surface-variant)]'
										>
											<button
												type='button'
												onClick={() => handleSort(column.key)}
												className='inline-flex items-center gap-[var(--spacing-xxs)] text-[var(--font-size-label-m)] font-semibold text-[var(--on-surface)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
											>
												{column.label}
												<SortIcon
													activeKey={sort.key}
													sort={sort.direction}
													columnKey={column.key}
												/>
											</button>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{sortedRows.map(row => (
									<tr
										key={row.id}
										className='border-b border-[var(--outline-variant)] transition hover:bg-[var(--surface-container-low)]'
									>
										<td className='px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-body-s)]'>
											<label className='inline-flex items-center gap-[var(--spacing-xxs)]'>
												<input
													type='checkbox'
													checked={selectedRows.has(row.id)}
													onChange={() => toggleRowSelection(row.id)}
													className='h-4 w-4 rounded border-[var(--outline-variant)] text-[var(--primary)] focus:ring-[var(--primary)]'
												/>
											</label>
										</td>
										{dataset?.columns.map(column => (
											<td
												key={column.key}
												className='px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-body-s)] text-[var(--on-surface)]'
											>
												<CellValue value={row[column.key]} column={column} />
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</section>
	)
}

function SortIcon({
	activeKey,
	sort,
	columnKey,
}: Readonly<{
	activeKey: string | null
	sort: SortState['direction']
	columnKey: string
}>) {
	if (activeKey !== columnKey) {
		return (
			<ArrowUpDown
				className='h-4 w-4 text-[var(--on-surface-variant)]'
				aria-hidden
			/>
		)
	}
	return sort === 'asc' ? (
		<ArrowUp className='h-4 w-4 text-[var(--primary)]' aria-hidden />
	) : (
		<ArrowDown className='h-4 w-4 text-[var(--primary)]' aria-hidden />
	)
}

function CellValue({
	value,
	column,
}: Readonly<{ value: DataRow[keyof DataRow]; column: Column }>) {
	if (column.isCurrency && typeof value === 'number') {
		return (
			<span className='font-semibold text-[var(--on-surface)]'>
				{currencyFormatter.format(value)}
			</span>
		)
	}

	if (Array.isArray(value)) {
		return (
			<ul className='flex flex-wrap gap-[var(--spacing-xxs)] text-[var(--font-size-label-s)] text-[var(--primary)]'>
				{value.map(tag => (
					<li
						key={tag}
						className='rounded-full border border-[var(--outline-variant)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)]'
					>
						{tag}
					</li>
				))}
			</ul>
		)
	}

	return <span>{String(value)}</span>
}
