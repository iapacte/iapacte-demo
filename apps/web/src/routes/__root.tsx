import { getIsoLanguageCode } from '@iapacte/shared-ui-localization'
import { getLocale } from '@iapacte/shared-ui-localization/paraglide/runtime'
import type { QueryClient } from '@tanstack/react-query'
import {
	ClientOnly,
	createRootRouteWithContext,
	HeadContent,
	Link,
	Outlet,
	Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { ReactNode } from 'react'

import { NotFound } from '~components'
import { CoFooter } from '~components/ui'
import appCss from '../styles/global.css?url'

export type RouterContext = {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
	notFoundComponent: () => <NotFound data={{}} />,
	head: () => ({
		meta: [
			{ charSet: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{
				title: 'Iapacte Demo Hub',
			},
			{
				name: 'description',
				content:
					'Demo-only flows for the Tender & Knowledge Vault, AI Workflow Studio, and Friendly Civic Spreadsheet.',
			},
			{
				name: 'theme-color',
				content: '#3b6939',
			},
		],
		links: [
			{ rel: 'stylesheet', href: appCss },
			{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
			{
				rel: 'preconnect',
				href: 'https://fonts.gstatic.com',
				crossOrigin: '',
			},
			{
				rel: 'stylesheet',
				href: 'https://fonts.googleapis.com/css2?family=Cardo:wght@400;700&family=Cinzel:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap',
			},
			{ rel: 'icon', href: '/favicon.ico' },
		],
	}),
})

function RootComponent() {
	return (
		<RootDocument>
			<AppChrome>
				<Outlet />
			</AppChrome>
		</RootDocument>
	)
}

function AppChrome({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<div className='flex min-h-screen flex-col bg-surface text-on-surface'>
			<header className='flex flex-wrap items-center justify-between gap-sm border-b border-outline-variant bg-surface-container px-lg py-md shadow-elevation-1'>
				<Link to='/' className='font-semibold text-title-l text-on-surface'>
					Iapacte Demo Hub
				</Link>
			</header>
			<main className='flex-1 overflow-y-auto bg-surface-container-low'>
				{children}
			</main>
			<CoFooter />
		</div>
	)
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	const language = getLocale()
	const htmlLang = getIsoLanguageCode(language)
	const isRTL = ['ar', 'he', 'fa', 'ur'].includes(htmlLang)
	const dir = isRTL ? 'rtl' : 'ltr'

	return (
		<html lang={htmlLang} dir={dir} className='light' data-theme='light'>
			<head>
				<HeadContent />
			</head>
			<body className='m-0 min-h-screen bg-surface text-on-surface font-body'>
				<div id='app-root' className='min-h-screen bg-surface text-on-surface'>
					{children}
				</div>
				<Scripts />
				<ClientOnly fallback={null}>
					{import.meta.env.DEV ? (
						<TanStackRouterDevtools position='bottom-right' />
					) : null}
				</ClientOnly>
			</body>
		</html>
	)
}
