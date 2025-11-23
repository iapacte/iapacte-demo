import { createFileRoute, notFound, redirect } from '@tanstack/react-router'

import { productTemplates } from '~lib/product.data'

export const Route = createFileRoute('/product/templates/$templateId')({
	beforeLoad: ({ params }) => {
		const template = productTemplates.find(
			item => item.id === params.templateId,
		)
		if (!template) {
			throw notFound()
		}
		throw redirect({
			to: '/product/templates',
			search: { templateId: params.templateId },
		})
	},
	component: () => null,
})
