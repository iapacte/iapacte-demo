import { createFileRoute } from '@tanstack/react-router'
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from '@tanstack/react-table'
import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	ChevronDown,
	ChevronRight,
	Clock,
	FileCheck,
	FileText,
	Filter,
	FolderClosed,
	Search,
	Tag,
	X,
} from 'lucide-react'
import { useMemo, useState } from 'react'

const ALL_TAGS = [
	'Q2 2024',
	'Infraestructura',
	'Català',
	'Contractació',
	'Obres',
	'Pressupost viu',
	'Benestar',
	'Memòries',
	'Auditoria',
	'Mobilitat',
	'Clima',
	'Dashboards',
	'Assistent',
	'Compliance',
] as const

type FolderItem = {
	id: string
	name: string
	description: string
	updated: string
	filesCount: number
	tags: readonly string[]
	type: 'tender' | 'grant' | 'ai'
	fileType?: 'PDF' | 'WORD' | 'EXCEL' | 'TXT' | 'OTHER'
	children?: FolderItem[]
}

type TableRow = FolderItem & {
	isChild?: boolean
	parentId?: string
}

const FOLDERS: FolderItem[] = [
	{
		id: 'licitacions-2024',
		name: 'Licitacions 2024',
		description:
			'Models aprovats, versions signades i proves de pressupost en temps real.',
		updated: 'Ahir',
		filesCount: 18,
		tags: ['Contractació', 'Obres', 'Pressupost viu'],
		type: 'tender',
		children: [
			{
				id: 'licitacions-2024-1',
				name: 'Plaça Major renovació',
				description: 'Expedient complet amb memòria tècnica i pressupost',
				updated: 'Ahir',
				filesCount: 5,
				tags: ['Obres', 'Contractació'],
				type: 'tender',
				fileType: 'PDF',
			},
			{
				id: 'licitacions-2024-2',
				name: 'Serveis de neteja',
				description: 'Contracte anual de neteja viària',
				updated: 'Fa 2 dies',
				filesCount: 3,
				tags: ['Contractació'],
				type: 'tender',
				fileType: 'WORD',
			},
		],
	},
	{
		id: 'subvencions-socials',
		name: 'Subvencions socials',
		description:
			"Històric de convocatòries, annexos per barri i cites d'impacte ciutadà.",
		updated: 'Fa 4 dies',
		filesCount: 11,
		tags: ['Benestar', 'Memòries', 'Auditoria'],
		type: 'grant',
		children: [
			{
				id: 'subvencions-socials-1',
				name: "Programa d'habitatge social",
				description: 'Convocatòria i memòria justificativa',
				updated: 'Fa 4 dies',
				filesCount: 4,
				tags: ['Benestar'],
				type: 'grant',
				fileType: 'PDF',
			},
		],
	},
	{
		id: 'guia-mobilitat',
		name: 'Guia mobilitat verda',
		description:
			'Clàusules que vinculen licitacions amb dades de sensors i KPIs climàtics.',
		updated: 'Fa 6 hores',
		filesCount: 9,
		tags: ['Mobilitat', 'Clima', 'Dashboards'],
		type: 'tender',
	},
	{
		id: 'plantilles-ia',
		name: "Plantilles de xat d'IA",
		description:
			'Prompts per respondre consultes, redactar informes i preparar esmenes jurídiques.',
		updated: 'Fa 3 hores',
		filesCount: 12,
		tags: ['Assistent', 'Compliance', 'Català'],
		type: 'ai',
		children: [
			{
				id: 'plantilles-ia-1',
				name: 'Prompt redacció informes',
				description: 'Plantilla per generar informes tècnics',
				updated: 'Fa 3 hores',
				filesCount: 1,
				tags: ['Assistent'],
				type: 'ai',
				fileType: 'TXT',
			},
			{
				id: 'plantilles-ia-2',
				name: 'Prompt consultes jurídiques',
				description: 'Plantilla per respondre consultes legals',
				updated: 'Fa 5 hores',
				filesCount: 1,
				tags: ['Compliance'],
				type: 'ai',
				fileType: 'TXT',
			},
		],
	},
] as const

function TenderVaultDirectory() {
	const [expanded, setExpanded] = useState<Record<string, boolean>>({})
	const [searchText, setSearchText] = useState('')
	const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
	const [sorting, setSorting] = useState<SortingState>([])

	const toggleTag = (tag: string) => {
		setSelectedTags(prev => {
			const next = new Set(prev)
			if (next.has(tag)) {
				next.delete(tag)
			} else {
				next.add(tag)
			}
			return next
		})
	}

	const clearFilters = () => {
		setSearchText('')
		setSelectedTags(new Set())
	}

	// Flatten folders and children for filtering
	const allItems = useMemo(() => {
		const items: FolderItem[] = []
		FOLDERS.forEach(folder => {
			items.push(folder)
			if (folder.children) {
				items.push(...folder.children)
			}
		})
		return items
	}, [])

	// Filter items
	const filteredItems = useMemo(() => {
		return allItems.filter(item => {
			// Search text filter
			if (searchText) {
				const searchLower = searchText.toLowerCase()
				const matchesSearch =
					item.name.toLowerCase().includes(searchLower) ||
					item.description.toLowerCase().includes(searchLower) ||
					item.tags.some(tag => tag.toLowerCase().includes(searchLower))
				if (!matchesSearch) return false
			}

			// Tag filter
			if (selectedTags.size > 0) {
				const hasSelectedTag = item.tags.some(tag => selectedTags.has(tag))
				if (!hasSelectedTag) return false
			}

			return true
		})
	}, [allItems, searchText, selectedTags])

	// Get visible folders (only show folders that match or have matching children)
	const visibleFolders = useMemo(() => {
		return FOLDERS.filter(folder => {
			// Check if folder itself matches
			const folderMatches = filteredItems.some(item => item.id === folder.id)
			// Check if any child matches
			const childMatches =
				folder.children?.some(child =>
					filteredItems.some(item => item.id === child.id),
				) ?? false
			return folderMatches || childMatches
		})
	}, [filteredItems])

	// Build table data with parent-child relationships
	const tableData = useMemo<TableRow[]>(() => {
		const rows: TableRow[] = []
		visibleFolders.forEach(folder => {
			// Add folder row
			rows.push({
				...folder,
				isChild: false,
			})
			// Add children if folder is expanded and has matching children
			if (expanded[folder.id] && folder.children) {
				const visibleChildren = folder.children.filter(child =>
					filteredItems.some(item => item.id === child.id),
				)
				visibleChildren.forEach(child => {
					rows.push({
						...child,
						isChild: true,
						parentId: folder.id,
					})
				})
			}
		})
		return rows
	}, [visibleFolders, expanded, filteredItems])

	// Define columns
	const columns = useMemo<ColumnDef<TableRow>[]>(
		() => [
			{
				accessorKey: 'name',
				header: () => (
					<div className='flex items-center gap-[var(--spacing-xs)]'>
						<FolderClosed className='h-4 w-4' aria-hidden />
						Nom
					</div>
				),
				cell: ({ row, getValue }) => {
					const isChild = row.original.isChild ?? false
					const hasChildren =
						!isChild &&
						row.original.children &&
						row.original.children.length > 0
					const isExpanded = expanded[row.original.id] ?? false
					const isFolder = !isChild

					return (
						<div
							className={`flex items-center gap-[var(--spacing-sm)] ${
								isChild ? 'pl-[var(--spacing-xl)]' : ''
							}`}
						>
							{hasChildren && (
								<button
									type='button'
									onClick={() => {
										setExpanded(prev => ({
											...prev,
											[row.original.id]: !prev[row.original.id],
										}))
									}}
									className='inline-flex items-center justify-center w-4 h-4'
								>
									{isExpanded ? (
										<ChevronDown
											className='h-4 w-4 text-[var(--on-surface-variant)]'
											aria-hidden
										/>
									) : (
										<ChevronRight
											className='h-4 w-4 text-[var(--on-surface-variant)]'
											aria-hidden
										/>
									)}
								</button>
							)}
							{isFolder && (
								<FolderClosed
									className='h-4 w-4 text-[var(--on-surface-variant)]'
									aria-hidden
								/>
							)}
							<span
								className={`${
									isChild
										? 'text-[var(--font-size-body-s)]'
										: 'text-[var(--font-size-body-m)]'
								} font-medium`}
							>
								{getValue() as string}
							</span>
						</div>
					)
				},
			},
			{
				id: 'type',
				accessorFn: row => {
					const isChild = row.isChild ?? false
					if (isChild) {
						return row.fileType ?? 'OTHER'
					}
					return 'FOLDER'
				},
				header: ({ column }) => {
					const sorted = column.getIsSorted()
					return (
						<button
							type='button'
							onClick={() => column.toggleSorting()}
							className='flex items-center gap-[var(--spacing-xs)] hover:text-[var(--primary)] transition'
						>
							<Tag className='h-4 w-4' aria-hidden />
							<span>Tipus</span>
							{!sorted && (
								<ArrowUpDown className='h-3 w-3 text-[var(--on-surface-variant)]' />
							)}
							{sorted === 'asc' && (
								<ArrowUp className='h-3 w-3 text-[var(--primary)]' />
							)}
							{sorted === 'desc' && (
								<ArrowDown className='h-3 w-3 text-[var(--primary)]' />
							)}
						</button>
					)
				},
				cell: ({ row }) => {
					const isChild = row.original.isChild ?? false
					if (isChild && row.original.fileType) {
						return (
							<span className='inline-flex items-center rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-[var(--font-size-label-s)] font-medium text-[var(--on-surface)]'>
								{row.original.fileType}
							</span>
						)
					}
					if (!isChild) {
						return (
							<span className='inline-flex items-center gap-[var(--spacing-xxs)]'>
								<FolderClosed
									className='h-4 w-4 text-[var(--on-surface-variant)]'
									aria-hidden
								/>
								<span className='text-[var(--font-size-label-s)] text-[var(--on-surface-variant)]'>
									Carpeta
								</span>
							</span>
						)
					}
					return null
				},
				sortingFn: (rowA, rowB) => {
					const aIsChild = rowA.original.isChild ?? false
					const bIsChild = rowB.original.isChild ?? false
					const aType = aIsChild
						? (rowA.original.fileType ?? 'OTHER')
						: 'FOLDER'
					const bType = bIsChild
						? (rowB.original.fileType ?? 'OTHER')
						: 'FOLDER'
					return aType.localeCompare(bType)
				},
			},
			{
				accessorKey: 'description',
				header: () => (
					<div className='flex items-center gap-[var(--spacing-xs)]'>
						<FileText className='h-4 w-4' aria-hidden />
						Descripció
					</div>
				),
				cell: ({ row, getValue }) => {
					const isChild = row.original.isChild ?? false
					return (
						<span
							className={`text-[var(--font-size-body-s)] ${
								isChild
									? 'text-[var(--on-surface-variant)]'
									: 'text-[var(--on-surface-variant)]'
							}`}
						>
							{getValue() as string}
						</span>
					)
				},
			},
			{
				accessorKey: 'updated',
				header: () => (
					<div className='flex items-center gap-[var(--spacing-xs)]'>
						<Clock className='h-4 w-4' aria-hidden />
						Actualitzat
					</div>
				),
				cell: ({ getValue }) => (
					<span className='text-[var(--font-size-body-s)] text-[var(--on-surface-variant)]'>
						{getValue() as string}
					</span>
				),
			},
			{
				accessorKey: 'filesCount',
				header: () => (
					<div className='flex items-center gap-[var(--spacing-xs)]'>
						<FileCheck className='h-4 w-4' aria-hidden />
						Fitxers
					</div>
				),
				cell: ({ getValue }) => (
					<span className='text-[var(--font-size-body-s)] text-[var(--on-surface-variant)]'>
						{getValue() as number} fitxers
					</span>
				),
			},
			{
				accessorKey: 'tags',
				header: () => (
					<div className='flex items-center gap-[var(--spacing-xs)]'>
						<Tag className='h-4 w-4' aria-hidden />
						Etiquetes
					</div>
				),
				cell: ({ getValue }) => {
					const tags = getValue() as readonly string[]
					return (
						<div className='flex flex-wrap gap-[var(--spacing-xs)]'>
							{tags.map((tag: string) => (
								<span
									key={tag}
									className='rounded-full border border-[var(--outline-variant)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-[var(--font-size-label-s)] text-[var(--on-surface-variant)]'
								>
									{tag}
								</span>
							))}
						</div>
					)
				},
			},
		],
		[expanded],
	)

	const table = useReactTable({
		data: tableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		state: {
			sorting,
		},
		getRowId: row => row.id,
	})

	return (
		<section className='px-[var(--spacing-sm)] py-[var(--spacing-xl)] md:px-[var(--spacing-lg)] md:py-[var(--spacing-xxl)]'>
			<div className='mx-auto max-w-6xl space-y-[var(--spacing-md)]'>
				<p className='text-[var(--font-size-label-l)] font-semibold uppercase tracking-[0.2em] text-[var(--primary)]'>
					Licitacions & Subvencions
				</p>
			</div>

			<div className='mx-auto mt-[var(--spacing-xl)] max-w-6xl grid gap-[var(--spacing-lg)] md:grid-cols-[320px,1fr]'>
				<aside className='space-y-[var(--spacing-lg)]'>
					<div className='rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-[var(--spacing-lg)] space-y-[var(--spacing-md)]'>
						<div className='flex items-center justify-between gap-[var(--spacing-sm)]'>
							<div className='flex items-center gap-[var(--spacing-xs)]'>
								<Filter
									className='h-4 w-4 text-[var(--on-surface-variant)]'
									aria-hidden
								/>
								<p className='text-[var(--font-size-title-s)] font-semibold'>
									Filtres
								</p>
							</div>
							{(searchText || selectedTags.size > 0) && (
								<button
									type='button'
									onClick={clearFilters}
									className='inline-flex items-center gap-[var(--spacing-xxs)] rounded-full bg-[var(--surface)] border border-[var(--outline-variant)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-[var(--font-size-label-s)] text-[var(--on-surface-variant)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
								>
									<X className='h-3 w-3' aria-hidden />
									Netejar
								</button>
							)}
						</div>

						<div className='space-y-[var(--spacing-sm)]'>
							<div className='relative'>
								<Search
									className='absolute left-[var(--spacing-sm)] top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--on-surface-variant)]'
									aria-hidden
								/>
								<input
									type='text'
									placeholder='Cercar...'
									value={searchText}
									onChange={e => setSearchText(e.target.value)}
									className='w-full rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface)] pl-[var(--spacing-xl)] pr-[var(--spacing-sm)] py-[var(--spacing-xs)] text-[var(--font-size-body-s)] text-[var(--on-surface)] placeholder:text-[var(--on-surface-variant)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]'
								/>
							</div>

							<div>
								<p className='mb-[var(--spacing-xs)] text-[var(--font-size-label-s)] font-medium text-[var(--on-surface-variant)]'>
									Etiquetes
								</p>
								<div className='flex flex-wrap gap-[var(--spacing-xs)]'>
									{ALL_TAGS.map(tag => {
										const isSelected = selectedTags.has(tag)
										return (
											<button
												type='button'
												key={tag}
												onClick={() => toggleTag(tag)}
												className={`rounded-full border px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-[var(--font-size-label-s)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
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
						</div>
					</div>
				</aside>

				<div className='space-y-[var(--spacing-md)] min-w-0'>
					<div className='rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface-container)] overflow-x-auto'>
						<table className='w-full min-w-[800px] border-collapse'>
							<thead>
								{table.getHeaderGroups().map(headerGroup => (
									<tr
										key={headerGroup.id}
										className='border-b border-[var(--outline-variant)] bg-[var(--surface-container-low)]'
									>
										{headerGroup.headers.map(header => (
											<th
												key={header.id}
												className='px-[var(--spacing-md)] py-[var(--spacing-sm)] text-left text-[var(--font-size-label-m)] font-semibold text-[var(--on-surface-variant)]'
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody>
								{table.getRowModel().rows.map(row => {
									const isChild = row.original.isChild ?? false
									return (
										<tr
											key={row.id}
											className={`border-b border-[var(--outline-variant)] transition hover:bg-[var(--surface-container-low)] ${
												isChild ? 'bg-[var(--surface-container-low)]' : ''
											}`}
										>
											{row.getVisibleCells().map(cell => (
												<td
													key={cell.id}
													className='px-[var(--spacing-md)] py-[var(--spacing-md)]'
												>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</td>
											))}
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>

					<div className='rounded-[var(--radius-xl)] border border-dashed border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-[var(--spacing-lg)] text-center text-[var(--font-size-body-m)] text-[var(--on-surface-variant)]'>
						Prepara una nova carpeta demo abans de la reunió i arrossega les
						darreres plantilles: la graella Data Collector reconeix
						automàticament els enllaços i els mostra com a cites contextuals.
					</div>
				</div>
			</div>
		</section>
	)
}

export const Route = createFileRoute('/tenders')({
	component: TenderVaultDirectory,
	head: () => ({
		meta: [
			{
				title: 'Directori Tenders & Grants',
			},
			{
				name: 'description',
				content:
					'Carpetes tipus Google Drive per revisar licitacions, subvencions i plantilles de xat d’IA sense connexió.',
			},
		],
	}),
})
