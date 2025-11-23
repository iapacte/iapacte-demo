import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import { TenderVaultDirectory } from '~components/tenders-table'
import {
	tendersVault,
	type VaultFolder,
	type VaultItem,
} from '~lib/product.data'

export const Route = createFileRoute('/product/tenders')({
	component: ProductTenders,
	head: () => ({
		meta: [
			{
				title: 'Arxiu de licitacions i subvencions',
			},
			{
				name: 'description',
				content:
					'Vista tipus arxiu per ensenyar expedients, annexos i plantilles d’IA en una sola carpeta.',
			},
		],
	}),
})

function ProductTenders() {
	const [activeFolderId, setActiveFolderId] = useState<string>(
		tendersVault[0]?.id ?? '',
	)

	const activeFolder = useMemo<VaultFolder | undefined>(
		() => tendersVault.find(folder => folder.id === activeFolderId),
		[activeFolderId],
	)

	return (
		<section className='mx-auto flex w-full max-w-6xl flex-col gap-[var(--spacing-xl)] px-[var(--spacing-lg)] py-[var(--spacing-xxl)]'>
			<header className='space-y-[var(--spacing-sm)]'>
				<p className='text-[var(--font-size-label-l)] uppercase tracking-wide text-[var(--primary)]'>
					Producte / Arxiu de licitacions
				</p>
				<div className='space-y-[var(--spacing-xs)]'>
					<h1 className='text-[var(--font-size-display-s)] font-semibold'>
						Arxiu viu de licitacions i subvencions
					</h1>
					<p className='text-[var(--font-size-body-l)] text-[var(--on-surface-variant)] max-w-3xl'>
						Carpetes i fitxers simulats per explicar com l’ajuntament
						centralitza expedients, annexos, memòries i plantilles d’IA sense
						dependre de la xarxa en directe.
					</p>
				</div>
			</header>

			<div className='grid gap-[var(--spacing-md)] md:grid-cols-4'>
				<nav className='md:col-span-1 space-y-[var(--spacing-sm)] rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container)] p-[var(--spacing-md)] shadow-elevation-1'>
					<p className='text-[var(--font-size-label-m)] text-[var(--on-surface-variant)]'>
						Carpetes
					</p>
					<ul className='space-y-[var(--spacing-xxs)]'>
						{tendersVault.map(folder => {
							const isActive = folder.id === activeFolderId
							return (
								<li key={folder.id}>
									<button
										type='button'
										onClick={() => setActiveFolderId(folder.id)}
										className={`flex w-full flex-col rounded-[var(--radius-lg)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
											isActive
												? 'bg-[var(--primary-container)] text-[var(--primary)]'
												: 'hover:bg-[var(--surface-container-high)] text-[var(--on-surface)]'
										}`}
									>
										<span className='font-semibold text-[var(--font-size-body-m)]'>
											{folder.name}
										</span>
										<span className='text-[var(--font-size-body-s)] text-[var(--on-surface-variant)]'>
											{folder.description}
										</span>
									</button>
								</li>
							)
						})}
					</ul>
				</nav>

				<div className='md:col-span-3 space-y-[var(--spacing-md)] rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container)] p-[var(--spacing-lg)] shadow-elevation-1'>
					<div className='flex items-center justify-between gap-[var(--spacing-sm)] border-b border-[var(--outline-variant)] pb-[var(--spacing-sm)]'>
						<div>
							<h2 className='text-[var(--font-size-title-m)] font-semibold'>
								{activeFolder?.name ?? 'Cap carpeta seleccionada'}
							</h2>
							<p className='text-[var(--font-size-body-m)] text-[var(--on-surface-variant)]'>
								{activeFolder?.description}
							</p>
						</div>
						<p className='text-[var(--font-size-body-s)] text-[var(--on-surface-variant)]'>
							Actualitzat: {activeFolder?.updated}
						</p>
					</div>

					<div className='grid gap-[var(--spacing-sm)] md:grid-cols-2'>
						{(activeFolder?.items ?? []).map(item => (
							<VaultCard key={item.id} item={item} />
						))}
						{!activeFolder?.items?.length ? (
							<p className='text-[var(--font-size-body-m)] text-[var(--on-surface-variant)]'>
								Selecciona una carpeta per veure fitxers.
							</p>
						) : null}
					</div>
				</div>
			</div>

			<div className='space-y-[var(--spacing-sm)]' id='taula-demo'>
				<h2 className='text-[var(--font-size-title-m)] font-semibold'>
					Taula demo amb filtres
				</h2>
				<p className='text-[var(--font-size-body-m)] text-[var(--on-surface-variant)]'>
					Mostra la mateixa taula interactiva amb filtres i etiquetes. Tot el
					comportament és offline i determinista.
				</p>
				<div className='rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container-low)] shadow-elevation-1'>
					<TenderVaultDirectory />
				</div>
			</div>
		</section>
	)
}

function VaultCard({ item }: Readonly<{ item: VaultItem }>) {
	const icon = getIcon(item.type)
	return (
		<div className='flex flex-col gap-[var(--spacing-xs)] rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface-container-high)] p-[var(--spacing-md)] shadow-elevation-1'>
			<div className='flex items-start justify-between gap-[var(--spacing-sm)]'>
				<div className='space-y-[var(--spacing-xxs)]'>
					<div className='flex items-center gap-[var(--spacing-xs)]'>
						<span aria-hidden className='text-[var(--font-size-title-m)]'>
							{icon}
						</span>
						<p className='font-semibold text-[var(--font-size-body-l)] text-[var(--on-surface)]'>
							{item.name}
						</p>
					</div>
					<p className='text-[var(--font-size-body-s)] text-[var(--on-surface-variant)]'>
						{item.description}
					</p>
				</div>
				<div className='text-right text-[var(--font-size-label-s)] text-[var(--on-surface-variant)]'>
					<p>{item.updated}</p>
					<p>{item.size}</p>
				</div>
			</div>
		</div>
	)
}

function getIcon(type: VaultItem['type']) {
	switch (type) {
		case 'pdf':
			return '📄'
		case 'doc':
			return '📝'
		case 'sheet':
			return '📊'
		case 'txt':
			return '🔖'
		default:
			return '📁'
	}
}
