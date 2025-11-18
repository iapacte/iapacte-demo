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
		'relative flex flex-col rounded-lg border border-outline-variant bg-surface text-on-surface shadow-elevation-md transition-shadow duration-200'
	const selectedClasses = selected
		? ' border-primary ring-2 ring-primary/40'
		: ''

	return (
		<div className={`${baseClasses}${selectedClasses}`} style={accentStyle}>
			<span
				className='pointer-events-none absolute inset-y-0 start-0 w-1 rounded-l-lg'
				style={{ backgroundColor: 'var(--node-accent-color, var(--primary))' }}
				aria-hidden
			/>
			<div className='grid grid-cols-[auto_1fr] items-center gap-sm border-b border-outline-variant bg-surface-container/40 px-lg py-sm'>
				<div className='grid h-8 w-8 place-items-center rounded-full text-title-s font-semibold text-primary'>
					{iconSymbol}
				</div>
				<div className='flex flex-col gap-xxs'>
					<div className='text-title-s font-semibold'>{title}</div>
					{status ? (
						<div className='text-label-m text-on-surface-variant'>{status}</div>
					) : null}
				</div>
			</div>
			{description ? (
				<div className='px-lg pt-sm text-body-s text-on-surface-variant'>
					{description}
				</div>
			) : null}
			<div className='flex flex-col gap-md px-lg pb-lg'>
				{parameters.length > 0 ? (
					<div className='flex flex-col gap-sm'>
						{parameters.map(parameter => (
							<div
								className='grid grid-cols-[minmax(120px,1fr)_minmax(140px,1fr)] items-center gap-sm'
								key={parameter.id}
							>
								<div className='text-label-m font-medium text-on-surface-variant'>
									{parameter.label}
								</div>
								<ParameterRenderer templateData={parameter} />
							</div>
						))}
					</div>
				) : null}
				{inputs.length > 0 || outputs.length > 0 ? (
					<div className='grid grid-cols-2 gap-lg'>
						<div className='flex flex-col gap-sm'>
							<span className='sr-only'>Entrades</span>
							{inputs.map(input => (
								<div className='flex items-center gap-sm' key={input.id}>
									<Handle
										id={input.id}
										type='target'
										position={Position.Left}
										accentColor={input.color}
									/>
									<div className='flex flex-col gap-xxs text-start'>
										<span className='text-label-m'>{input.label}</span>
										{input.description ? (
											<span className='text-label-s text-on-surface-variant'>
												{input.description}
											</span>
										) : null}
									</div>
								</div>
							))}
						</div>
						<div className='flex flex-col items-end gap-sm'>
							<span className='sr-only'>Sortides</span>
							{outputs.map(output => (
								<div className='flex items-center gap-sm' key={output.id}>
									<div className='flex flex-col items-end gap-xxs text-end'>
										<span className='text-label-m'>{output.label}</span>
										{output.description ? (
											<span className='text-label-s text-on-surface-variant'>
												{output.description}
											</span>
										) : null}
									</div>
									<Handle
										id={output.id}
										type='source'
										position={Position.Right}
										accentColor={output.color}
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
