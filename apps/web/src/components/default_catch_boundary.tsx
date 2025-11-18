import type { ErrorComponentProps } from '@tanstack/react-router'
import {
	ErrorComponent,
	rootRouteId,
	useMatch,
	useRouter,
} from '@tanstack/react-router'

import { CoButtonText } from '~components/ui'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
	const router = useRouter()
	const isRoot = useMatch({
		strict: false,
		select: state => state.id === rootRouteId,
	})

	return (
		<div
			style={{
				flex: 1,
				padding: '16px',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: '24px',
				minWidth: 0,
			}}
		>
			<ErrorComponent error={error} />
			<div
				style={{
					display: 'flex',
					gap: '8px',
					alignItems: 'center',
					flexWrap: 'wrap',
				}}
			>
				<CoButtonText
					onClick={() => {
						router.invalidate()
					}}
				>
					Try Again
				</CoButtonText>
				{isRoot ? (
					<CoButtonText onClick={() => router.navigate({ to: '/' })}>
						Home
					</CoButtonText>
				) : (
					<CoButtonText onClick={() => router.history.back()}>
						Go Back
					</CoButtonText>
				)}
			</div>
		</div>
	)
}
