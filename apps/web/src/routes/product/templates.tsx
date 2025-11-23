import { Dialog } from '@base-ui-components/react/dialog'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'

import { productTemplates } from '~lib/product.data'

export const Route = createFileRoute('/product/templates')({
	validateSearch: search => ({
		templateId:
			typeof search.templateId === 'string' ? search.templateId : undefined,
	}),
	component: ProductTemplates,
	head: () => ({
		meta: [
			{
				title: 'Plantilles d’IA governades',
			},
			{
				name: 'description',
				content:
					'Catàleg de plantilles d’IA amb dades municipals simulades i sortides traçables.',
			},
		],
	}),
})

function ProductTemplates() {
	const { templateId } = Route.useSearch()
	const navigate = Route.useNavigate()

	const activeTemplate = useMemo(
		() =>
			templateId
				? productTemplates.find(template => template.id === templateId)
				: null,
		[templateId],
	)

	useEffect(() => {
		if (templateId && !activeTemplate) {
			navigate({
				to: '/product/templates',
				replace: true,
				search: prev => ({ ...prev, templateId: undefined }),
			})
		}
	}, [templateId, activeTemplate, navigate])

	const closeDialog = () =>
		navigate({
			to: '/product/templates',
			replace: true,
			search: prev => ({ ...prev, templateId: undefined }),
		})

	return (
		<section className='mx-auto flex w-full max-w-6xl flex-col gap-[var(--spacing-xl)] px-[var(--spacing-lg)] py-[var(--spacing-xxl)]'>
			<header className='space-y-[var(--spacing-sm)]'>
				<p className='text-[var(--font-size-label-l)] uppercase tracking-wide text-[var(--primary)]'>
					Producte / Plantilles d’IA
				</p>
				<div className='space-y-[var(--spacing-xs)]'>
					<h1 className='text-[var(--font-size-display-s)] font-semibold'>
						Plantilles d’IA governades
					</h1>
					<p className='text-[var(--font-size-body-l)] text-[var(--on-surface-variant)] max-w-3xl'>
						Totes les plantilles estan lligades a dades municipals simulades i
						pensades per ser mostrades en directe sense dependències externes.
					</p>
				</div>
				<div className='flex flex-wrap gap-[var(--spacing-sm)]'>
					<Link
						to='/product/workflows'
						className='inline-flex items-center gap-[var(--spacing-xxs)] rounded-[var(--radius-lg)] border border-[var(--primary)] bg-[var(--primary-container)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--font-size-label-m)] text-[var(--primary)] transition hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
					>
						Veure workflows relacionats
					</Link>
					<Link
						to='/'
						className='inline-flex items-center gap-[var(--spacing-xxs)] rounded-[var(--radius-lg)] border border-[var(--outline-variant)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--font-size-label-m)] text-[var(--on-surface)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
					>
						Tornar al hub de demo
					</Link>
				</div>
			</header>

			<div className='overflow-x-auto rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface-container)] shadow-elevation-1'>
				<div className='min-w-[960px]'>
					<div className='grid grid-cols-5 items-center bg-[var(--surface-container-high)] px-[var(--spacing-md)] py-[var(--spacing-sm)] text-[var(--font-size-label-m)] text-[var(--on-surface-variant)]'>
						<span>Plantilla</span>
						<span>Per a qui</span>
						<span>Dades d’entrada</span>
						<span>Sortida</span>
						<span className='text-right'>Accions</span>
					</div>
					<ul className='divide-y divide-[var(--outline-variant)]'>
						{productTemplates.map(template => (
							<li
								key={template.id}
								className='grid grid-cols-5 items-start gap-[var(--spacing-sm)] px-[var(--spacing-md)] py-[var(--spacing-md)] text-[var(--font-size-body-m)]'
							>
								<div className='space-y-[var(--spacing-xxs)] pr-[var(--spacing-md)]'>
									<Link
										to='/product/templates'
										search={{ templateId: template.id }}
										className='font-semibold text-[var(--font-size-body-l)] text-[var(--primary)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
									>
										{template.name}
									</Link>
								</div>
								<div className='text-[var(--font-size-body-m)] text-[var(--on-surface)]'>
									{template.persona}
								</div>
								<div className='text-[var(--font-size-body-m)] text-[var(--on-surface-variant)]'>
									{template.inputs.join(', ')}
								</div>
								<div className='text-[var(--font-size-body-m)] text-[var(--on-surface)]'>
									{template.outputType}
								</div>
								<div className='flex justify-end'>
									<Link
										to='/product/templates'
										search={{ templateId: template.id }}
										className='rounded-[var(--radius-lg)] border border-[var(--outline-variant)] px-[var(--spacing-md)] py-[var(--spacing-xxs)] text-[var(--font-size-label-m)] text-[var(--primary)] transition hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
									>
										Veure plantilla
									</Link>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>

			<Dialog.Root
				open={Boolean(activeTemplate)}
				onOpenChange={isOpen => {
					if (!isOpen) {
						closeDialog()
					}
				}}
			>
				<Dialog.Portal>
					<Dialog.Backdrop className='fixed inset-0 bg-[color-mix(in_srgb,var(--scrim)_60%,transparent)] backdrop-blur-[4px] transition duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute' />
					<Dialog.Viewport className='fixed inset-0 flex items-center justify-center px-[var(--spacing-lg)] py-[var(--spacing-xl)]'>
						<Dialog.Popup className='relative w-full max-w-4xl rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface)] p-[var(--spacing-xl)] text-[var(--on-surface)] shadow-elevation-1 transition duration-200 data-[starting-style]:translate-y-[var(--spacing-xs)] data-[starting-style]:opacity-0 data-[ending-style]:translate-y-[var(--spacing-xs)] data-[ending-style]:opacity-0'>
							<div className='flex flex-wrap items-start justify-between gap-[var(--spacing-sm)]'>
								<div className='space-y-[var(--spacing-xxs)]'>
									<Dialog.Title className='text-[var(--font-size-title-l)] font-semibold'>
										{activeTemplate?.name}
									</Dialog.Title>
									<Dialog.Description className='text-[var(--font-size-body-m)] text-[var(--on-surface-variant)]'>
										{activeTemplate
											? `Per a ${activeTemplate.persona} · Sortida: ${activeTemplate.outputType}`
											: 'Plantilla simulada'}
									</Dialog.Description>
									<div className='flex flex-wrap gap-[var(--spacing-xxs)] text-[var(--font-size-label-m)]'>
										{activeTemplate?.inputs.map(input => (
											<span
												key={input}
												className='rounded-full bg-[var(--primary-container)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-[var(--primary)]'
											>
												{input}
											</span>
										))}
									</div>
								</div>
								<Dialog.Close className='rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container-high)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-[var(--font-size-label-m)] text-[var(--on-surface)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'>
									Tancar
								</Dialog.Close>
							</div>

							{activeTemplate?.relatedWorkflows.length ? (
								<div className='mt-[var(--spacing-sm)] flex flex-wrap gap-[var(--spacing-xs)] text-[var(--font-size-label-m)] text-[var(--on-surface-variant)]'>
									{activeTemplate.relatedWorkflows.map(flowId => (
										<Link
											key={flowId}
											to='/product/workflows/$workflowId'
											params={{ workflowId: flowId }}
											className='rounded-full border border-[var(--outline-variant)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)] text-[var(--primary)] hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]'
										>
											Workflow: {flowId}
										</Link>
									))}
								</div>
							) : null}

							<div className='mt-[var(--spacing-md)] space-y-[var(--spacing-xxs)]'>
								<p className='text-[var(--font-size-title-s)] font-semibold'>
									Plantilla (markdown)
								</p>
								<pre className='max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface-container-low)] p-[var(--spacing-md)] text-[var(--font-size-body-m)] text-[var(--on-surface)]'>
									{activeTemplate?.markdown}
								</pre>
							</div>
						</Dialog.Popup>
					</Dialog.Viewport>
				</Dialog.Portal>
			</Dialog.Root>
		</section>
	)
}
