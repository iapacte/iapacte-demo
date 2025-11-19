import { resolve } from 'node:path'
import { paraglideVitePlugin } from '@inlang/paraglide-js'
import tailwindcss from '@tailwindcss/vite'
import { nitroV2Plugin } from '@tanstack/nitro-v2-vite-plugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import wasm from 'vite-plugin-wasm'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig(() => ({
	build: {
		target: 'esnext', // Prevent the usage of top-level await (vite-plugin-top-level-await) for Loro CRDT
	},
	resolve: {
		alias: [
			{
				find: '~components',
				replacement: resolve(__dirname, 'src/components'),
			},
			{
				find: '~components/ui',
				replacement: resolve(__dirname, 'src/components/ui'),
			},
			{
				find: '~lib',
				replacement: resolve(__dirname, 'src/lib'),
			},
			{
				find: '~hooks',
				replacement: resolve(__dirname, 'src/hooks'),
			},
		],
	},
	plugins: [
		tailwindcss(),
		paraglideVitePlugin({
			project: '../../packages/shared/ui/localization/project.inlang',
			outdir: '../../packages/shared/ui/localization/src/paraglide',
		}),
		tanstackStart(),
		...nitroV2Plugin({
			preset: 'node-server',
			output: {
				dir: '.output',
			},
		}),
		tsConfigPaths(),
		react({
			babel: {
				plugins: [['babel-plugin-react-compiler', {}]],
			},
		}),
		wasm(),
	],
	server: {
		open: false,
		port: 3000,
	},
}))
