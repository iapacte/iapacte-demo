import { memo, useMemo } from 'react'
import { type NodeProps, Position } from 'reactflow'

import Handle from './handle'
import ParameterRenderer from './parameter_renderer'

export interface NodePort {
	id: string
	label: string
	color?: string
	description?: string
}

export interface NodeParameter {
	id: string
	label: string
	type: string
	value?: unknown
	placeholder?: string
}

export interface CustomNodeData {
	title: string
	icon?: string
	status?: string
	description?: string
	accentColor?: string
	inputs?: NodePort[]
	outputs?: NodePort[]
	parameters?: NodeParameter[]
}

function CustomNodeComponent({ data, selected }: NodeProps<CustomNodeData>) {
	const nodeData = data ?? { title: 'Node' }
	const {
		title,
		icon,
		status,
		description,
		accentColor,
		inputs = [],
		outputs = [],
		parameters = [],
	} = nodeData

	// Expose an accent color through CSS var so edges/handles can stay in sync
	const accentStyle = useMemo(
		() =>
			accentColor
				? ({
						['--node-accent-color' as any]: accentColor,
					} as Record<string, string>)
				: undefined,
		[accentColor],
	)

	const iconSymbol =
		icon ?? (title ? title.trim().slice(0, 1).toUpperCase() : '•')

	const baseClasses =
		'relative flex flex-col rounded-[var(--radius-lg)] border border-[var(--outline-variant)] bg-[var(--surface)] text-[var(--on-surface)] transition-shadow duration-200'
	const selectedClasses = selected
		? ' border-[var(--primary)] ring-2 ring-[var(--primary)]/40'
		: ''

	return (
		<div className={`${baseClasses}${selectedClasses}`} style={accentStyle}>
			<span
				className='pointer-events-none absolute inset-y-0 start-0 w-1 rounded-l-[var(--radius-lg)]'
				style={{ backgroundColor: 'var(--node-accent-color, var(--primary))' }}
				aria-hidden
			/>
			<div className='grid grid-cols-[auto_1fr] items-center gap-[var(--spacing-sm)] border-b border-[var(--outline-variant)] bg-[var(--surface-container)]/40 px-[var(--spacing-lg)] py-[var(--spacing-sm)]'>
				<div className='grid h-8 w-8 place-items-center rounded-full text-[var(--font-size-title-s)] font-semibold text-[var(--primary)]'>
					{iconSymbol}
				</div>
				<div className='flex flex-col gap-[var(--spacing-xxs)]'>
					<div className='text-[var(--font-size-title-s)] font-semibold'>
						{title}
					</div>
					{status ? (
						<div className='text-[var(--font-size-label-m)] text-[var(--on-surface-variant)]'>
							{status}
						</div>
					) : null}
				</div>
			</div>
			{description ? (
				<div className='px-[var(--spacing-lg)] pt-[var(--spacing-sm)] text-[var(--font-size-body-s)] text-[var(--on-surface-variant)]'>
					{description}
				</div>
			) : null}
			<div className='flex flex-col gap-[var(--spacing-md)] px-[var(--spacing-lg)] pb-[var(--spacing-lg)]'>
				{parameters.length > 0 ? (
					<div className='flex flex-col gap-[var(--spacing-sm)]'>
						{parameters.map(parameter => (
							<div
								className='grid grid-cols-[minmax(120px,1fr)_minmax(140px,1fr)] items-center gap-[var(--spacing-sm)]'
								key={parameter.id}
							>
								<div className='text-[var(--font-size-label-m)] font-medium text-[var(--on-surface-variant)]'>
									{parameter.label}
								</div>
								<ParameterRenderer templateData={parameter} />
							</div>
						))}
					</div>
				) : null}
				{inputs.length > 0 || outputs.length > 0 ? (
					<div className='grid grid-cols-2 gap-[var(--spacing-lg)]'>
						<div className='flex flex-col gap-[var(--spacing-sm)]'>
							<span className='sr-only'>Entrades</span>
							{/* Inputs/targets live on the left column */}
							{inputs.map(input => (
								<div
									className='flex items-center gap-[var(--spacing-sm)]'
									key={input.id}
								>
									<Handle
										id={input.id}
										type='target'
										position={Position.Left}
										accentColor={input.color ?? 'var(--primary)'}
									/>
									<div className='flex flex-col gap-[var(--spacing-xxs)] text-start'>
										<span className='text-[var(--font-size-label-m)]'>
											{input.label}
										</span>
										{input.description ? (
											<span className='text-[var(--font-size-label-s)] text-[var(--on-surface-variant)]'>
												{input.description}
											</span>
										) : null}
									</div>
								</div>
							))}
						</div>
						<div className='flex flex-col items-end gap-[var(--spacing-sm)]'>
							<span className='sr-only'>Sortides</span>
							{/* Outputs/sources live on the right column */}
							{outputs.map(output => (
								<div
									className='flex items-center gap-[var(--spacing-sm)]'
									key={output.id}
								>
									<div className='flex flex-col items-end gap-[var(--spacing-xxs)] text-end'>
										<span className='text-[var(--font-size-label-m)]'>
											{output.label}
										</span>
										{output.description ? (
											<span className='text-[var(--font-size-label-s)] text-[var(--on-surface-variant)]'>
												{output.description}
											</span>
										) : null}
									</div>
									<Handle
										id={output.id}
										type='source'
										position={Position.Right}
										accentColor={output.color ?? 'var(--primary)'}
									/>
								</div>
							))}
						</div>
					</div>
				) : null}
			</div>
		</div>
	)
}

export const CustomNode = memo(CustomNodeComponent)
CustomNode.displayName = 'CustomNode'

export default CustomNode
