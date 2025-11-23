import type { FlowEdge, FlowNode } from '~components/flow'

export type WorkflowDefinition = {
	id: string
	title: string
	category: string
	summary: string
	metrics: string[]
	nodes: FlowNode[]
	edges: FlowEdge[]
}

const civicSecondary = 'var(--secondary)'
const civicPrimary = 'var(--primary)'
const civicTertiary = 'var(--tertiary)'

const tenderScrutinizerNodes: FlowNode[] = [
	{
		id: 'vault-loader',
		type: 'custom',
		position: { x: 80, y: 140 },
		data: {
			title: "Carregador de l'arxiu de licitacions",
			icon: '📂',
			status: 'Sincronitzat cada hora',
			description: 'Indexa PDFs de contractació, annexos i directrius.',
			accentColor: civicSecondary,
			outputs: [
				{
					id: 'vault-output',
					label: 'Arxius de licitació',
					color: civicSecondary,
				},
			],
			parameters: [
				{
					id: 'loader-source',
					label: 'Font',
					type: 'str',
					value: 'S3://iapacte-tenders',
				},
				{
					id: 'loader-volume',
					label: 'Documents sincronitzats',
					type: 'int',
					value: 4821,
				},
			],
		},
	},
	{
		id: 'compliance-nlp',
		type: 'custom',
		position: { x: 360, y: 120 },
		data: {
			title: 'NLP de compliment',
			icon: '🧠',
			status: 'Avaluant clàusules',
			description: 'Extreu obligacions, terminis i dimensions de puntuació.',
			accentColor: civicPrimary,
			inputs: [
				{
					id: 'nlp-input',
					label: 'Arxius de licitació',
					color: civicSecondary,
				},
			],
			outputs: [{ id: 'nlp-output', label: 'Resultats', color: civicPrimary }],
			parameters: [
				{
					id: 'nlp-model',
					label: 'Model',
					type: 'str',
					value: 'juridic-text-002',
				},
				{
					id: 'nlp-risk',
					label: 'Llindars de risc',
					type: 'str',
					value: 'Alt/Mig/Baix',
				},
			],
		},
	},
	{
		id: 'risk-score',
		type: 'custom',
		position: { x: 640, y: 100 },
		data: {
			title: 'Puntuació de risc',
			icon: '⚖️',
			status: '76% conforme',
			description:
				'Relaciona els resultats amb el reglament municipal i els pressupostos.',
			accentColor: civicTertiary,
			inputs: [
				{ id: 'risk-input-findings', label: 'Resultats', color: civicPrimary },
				{
					id: 'risk-input-ledger',
					label: 'Registres del llibre major',
					color: civicSecondary,
				},
			],
			outputs: [
				{
					id: 'risk-output',
					label: 'Informes de compliment',
					color: civicTertiary,
				},
			],
			parameters: [
				{
					id: 'risk-budget',
					label: 'Enllaç pressupostari',
					type: 'str',
					value: 'ERP:CAPEX-2025',
				},
				{ id: 'risk-alert', label: "Llindar d'alerta", type: 'int', value: 70 },
			],
		},
	},
	{
		id: 'legal-brief',
		type: 'custom',
		position: { x: 920, y: 140 },
		data: {
			title: "Generador d'informes legals",
			icon: '📜',
			status: 'Esborrany llest',
			description: 'Genera resum i passos següents per a la taula jurídica.',
			accentColor: civicSecondary,
			inputs: [
				{
					id: 'brief-input-risk',
					label: 'Resum de risc',
					color: civicTertiary,
				},
			],
			outputs: [
				{
					id: 'brief-output',
					label: "PDF de l'informe",
					color: civicSecondary,
				},
			],
			parameters: [
				{
					id: 'brief-language',
					label: 'Idioma',
					type: 'str',
					value: 'Català',
				},
			],
		},
	},
]

const tenderScrutinizerEdges: FlowEdge[] = [
	{
		id: 'vault-to-nlp',
		source: 'vault-loader',
		sourceHandle: 'vault-output',
		target: 'compliance-nlp',
		targetHandle: 'nlp-input',
		type: 'custom',
		data: { accentColor: civicSecondary },
	},
	{
		id: 'nlp-to-risk',
		source: 'compliance-nlp',
		sourceHandle: 'nlp-output',
		target: 'risk-score',
		targetHandle: 'risk-input-findings',
		type: 'custom',
		data: { accentColor: civicPrimary },
	},
	{
		id: 'risk-to-brief',
		source: 'risk-score',
		sourceHandle: 'risk-output',
		target: 'legal-brief',
		targetHandle: 'brief-input-risk',
		type: 'custom',
		data: { accentColor: civicTertiary },
	},
]

const citizenSwitchboardNodes: FlowNode[] = [
	{
		id: 'intent-gateway',
		type: 'custom',
		position: { x: 100, y: 200 },
		data: {
			title: "Porta d'intencions",
			icon: '🛎️',
			status: 'Escoltant',
			description: 'Classifica xats en servei, permís o alerta.',
			outputs: [
				{
					id: 'intent-output',
					label: "Etiqueta d'intenció",
					color: civicPrimary,
				},
			],
			parameters: [
				{
					id: 'intent-latency',
					label: 'Latència',
					type: 'str',
					value: '<250ms',
				},
			],
		},
	},
	{
		id: 'service-request',
		type: 'custom',
		position: { x: 360, y: 80 },
		data: {
			title: 'Flux de sol·licituds de servei',
			icon: '🧹',
			status: 'A la cua',
			description:
				"Crea tiquets a la base de dades de manteniment i obté l'ETA.",
			accentColor: civicSecondary,
			inputs: [
				{
					id: 'service-intent',
					label: "Etiqueta d'intenció",
					color: civicPrimary,
				},
			],
			outputs: [
				{ id: 'service-output', label: 'ID de tiquet', color: civicSecondary },
			],
		},
	},
	{
		id: 'permit-guide',
		type: 'custom',
		position: { x: 360, y: 220 },
		data: {
			title: 'Guia de permisos',
			icon: '📑',
			status: 'Resposta automàtica',
			description:
				'Consulta documents de polítiques i prepara una llista personalitzada.',
			accentColor: civicPrimary,
			inputs: [
				{
					id: 'permit-intent',
					label: "Etiqueta d'intenció",
					color: civicPrimary,
				},
			],
			outputs: [
				{ id: 'permit-output', label: 'Orientació', color: civicPrimary },
			],
		},
	},
	{
		id: 'alert-bridge',
		type: 'custom',
		position: { x: 360, y: 360 },
		data: {
			title: "Pont d'alertes",
			icon: '🚨',
			status: 'Inactiu',
			description:
				'Envia alertes urgents de seguretat als oficials de guàrdia.',
			accentColor: civicTertiary,
			inputs: [
				{
					id: 'alert-intent',
					label: "Etiqueta d'intenció",
					color: civicPrimary,
				},
			],
			outputs: [
				{
					id: 'alert-output',
					label: 'Dades de desplegament',
					color: civicTertiary,
				},
			],
		},
	},
	{
		id: 'chat-responder',
		type: 'custom',
		position: { x: 660, y: 220 },
		data: {
			title: 'Responent de xat',
			icon: '💬',
			status: 'Resposta en flux',
			description:
				'Composa la resposta final fent referència al resultat del flux.',
			accentColor: civicSecondary,
			inputs: [
				{
					id: 'responder-service',
					label: 'ID de tiquet',
					color: civicSecondary,
				},
				{ id: 'responder-permit', label: 'Orientació', color: civicPrimary },
				{
					id: 'responder-alert',
					label: 'Dades de desplegament',
					color: civicTertiary,
				},
			],
			outputs: [
				{
					id: 'responder-output',
					label: 'Missatge de xat',
					color: civicSecondary,
				},
			],
		},
	},
]

const citizenSwitchboardEdges: FlowEdge[] = [
	{
		id: 'intent-to-service',
		source: 'intent-gateway',
		sourceHandle: 'intent-output',
		target: 'service-request',
		targetHandle: 'service-intent',
		type: 'custom',
		data: { accentColor: civicSecondary },
	},
	{
		id: 'intent-to-permit',
		source: 'intent-gateway',
		sourceHandle: 'intent-output',
		target: 'permit-guide',
		targetHandle: 'permit-intent',
		type: 'custom',
		data: { accentColor: civicPrimary },
	},
	{
		id: 'intent-to-alert',
		source: 'intent-gateway',
		sourceHandle: 'intent-output',
		target: 'alert-bridge',
		targetHandle: 'alert-intent',
		type: 'custom',
		data: { accentColor: civicTertiary },
	},
	{
		id: 'service-to-chat',
		source: 'service-request',
		sourceHandle: 'service-output',
		target: 'chat-responder',
		targetHandle: 'responder-service',
		type: 'custom',
		data: { accentColor: civicSecondary },
	},
	{
		id: 'permit-to-chat',
		source: 'permit-guide',
		sourceHandle: 'permit-output',
		target: 'chat-responder',
		targetHandle: 'responder-permit',
		type: 'custom',
		data: { accentColor: civicPrimary },
	},
	{
		id: 'alert-to-chat',
		source: 'alert-bridge',
		sourceHandle: 'alert-output',
		target: 'chat-responder',
		targetHandle: 'responder-alert',
		type: 'custom',
		data: { accentColor: civicTertiary },
	},
]

const budgetPulseNodes: FlowNode[] = [
	{
		id: 'scheduler',
		type: 'custom',
		position: { x: 80, y: 160 },
		data: {
			title: 'Programador de pressupost',
			icon: '⏱️',
			status: 'Cada nit',
			description: 'Activa canals ERP, dades obertes i notícies.',
			outputs: [
				{ id: 'scheduler-output', label: 'Tic de cron', color: civicSecondary },
			],
		},
	},
	{
		id: 'erp-connector',
		type: 'custom',
		position: { x: 340, y: 80 },
		data: {
			title: 'Connector ERP',
			icon: '💼',
			status: 'Sincronitzat',
			accentColor: civicPrimary,
			inputs: [
				{ id: 'erp-input', label: 'Tic de cron', color: civicSecondary },
			],
			outputs: [
				{ id: 'erp-output', label: 'Flux de despesa', color: civicPrimary },
			],
		},
	},
	{
		id: 'news-sentiment',
		type: 'custom',
		position: { x: 340, y: 240 },
		data: {
			title: 'Sentiment de notícies',
			icon: '📰',
			status: 'Analitzant 12 mitjans',
			accentColor: civicTertiary,
			inputs: [
				{ id: 'news-input', label: 'Tic de cron', color: civicSecondary },
			],
			outputs: [
				{ id: 'news-output', label: 'Flux de sentiment', color: civicTertiary },
			],
		},
	},
	{
		id: 'anomaly-detector',
		type: 'custom',
		position: { x: 620, y: 150 },
		data: {
			title: "Detector d'anomalies",
			icon: '📈',
			status: '2 elements marcats',
			description: 'Compara la despesa amb notícies i KPI.',
			inputs: [
				{ id: 'anomaly-spend', label: 'Flux de despesa', color: civicPrimary },
				{
					id: 'anomaly-news',
					label: 'Flux de sentiment',
					color: civicTertiary,
				},
			],
			outputs: [
				{ id: 'anomaly-output', label: 'Alertes', color: civicPrimary },
			],
		},
	},
	{
		id: 'finance-brief',
		type: 'custom',
		position: { x: 900, y: 150 },
		data: {
			title: 'Informe financer',
			icon: '📊',
			status: 'Llest per al CFO',
			inputs: [{ id: 'brief-input', label: 'Alertes', color: civicPrimary }],
			outputs: [{ id: 'brief-output', label: 'Resum', color: civicSecondary }],
		},
	},
]

const budgetPulseEdges: FlowEdge[] = [
	{
		id: 'scheduler-to-erp',
		source: 'scheduler',
		sourceHandle: 'scheduler-output',
		target: 'erp-connector',
		targetHandle: 'erp-input',
		type: 'custom',
		data: { accentColor: civicPrimary },
	},
	{
		id: 'scheduler-to-news',
		source: 'scheduler',
		sourceHandle: 'scheduler-output',
		target: 'news-sentiment',
		targetHandle: 'news-input',
		type: 'custom',
		data: { accentColor: civicTertiary },
	},
	{
		id: 'erp-to-anomaly',
		source: 'erp-connector',
		sourceHandle: 'erp-output',
		target: 'anomaly-detector',
		targetHandle: 'anomaly-spend',
		type: 'custom',
		data: { accentColor: civicPrimary },
	},
	{
		id: 'news-to-anomaly',
		source: 'news-sentiment',
		sourceHandle: 'news-output',
		target: 'anomaly-detector',
		targetHandle: 'anomaly-news',
		type: 'custom',
		data: { accentColor: civicTertiary },
	},
	{
		id: 'anomaly-to-brief',
		source: 'anomaly-detector',
		sourceHandle: 'anomaly-output',
		target: 'finance-brief',
		targetHandle: 'brief-input',
		type: 'custom',
		data: { accentColor: civicPrimary },
	},
]

const emergencyBriefNodes: FlowNode[] = [
	{
		id: 'incident-webhook',
		type: 'custom',
		position: { x: 120, y: 160 },
		data: {
			title: "Webhook d'incidents",
			icon: '📡',
			status: 'En directe',
			description: 'Rep esdeveniments del 112 i la policia local.',
			outputs: [
				{
					id: 'incident-output',
					label: "Dades de l'incident",
					color: civicSecondary,
				},
			],
		},
	},
	{
		id: 'severity-branch',
		type: 'custom',
		position: { x: 360, y: 160 },
		data: {
			title: 'Bifurcació de severitat',
			icon: '🧭',
			status: 'Mitjà',
			inputs: [
				{
					id: 'severity-input',
					label: "Dades de l'incident",
					color: civicSecondary,
				},
			],
			outputs: [
				{ id: 'severity-low', label: 'Baix', color: civicSecondary },
				{ id: 'severity-med', label: 'Mitjà', color: civicPrimary },
				{ id: 'severity-high', label: 'Alt', color: civicTertiary },
			],
		},
	},
	{
		id: 'geo-context',
		type: 'custom',
		position: { x: 620, y: 60 },
		data: {
			title: 'Context geogràfic',
			icon: '🗺️',
			status: 'Llest',
			inputs: [
				{ id: 'geo-input', label: 'Incidents baixos', color: civicSecondary },
			],
			outputs: [
				{ id: 'geo-output', label: 'Capes de mapa', color: civicSecondary },
			],
		},
	},
	{
		id: 'policy-rules',
		type: 'custom',
		position: { x: 620, y: 220 },
		data: {
			title: 'Regles de polítiques',
			icon: '📘',
			status: 'Resolent ...',
			inputs: [
				{ id: 'policy-input', label: 'Incidents mitjans', color: civicPrimary },
			],
			outputs: [
				{ id: 'policy-output', label: "Manual d'acció", color: civicPrimary },
			],
		},
	},
	{
		id: 'crisis-ops',
		type: 'custom',
		position: { x: 620, y: 360 },
		data: {
			title: "Escalada d'operacions de crisi",
			icon: '🛡️',
			status: 'Inactiu',
			inputs: [
				{ id: 'crisis-input', label: 'Incidents alts', color: civicTertiary },
			],
			outputs: [
				{
					id: 'crisis-output',
					label: 'Assignació de tasques',
					color: civicTertiary,
				},
			],
		},
	},
	{
		id: 'multilingual-brief',
		type: 'custom',
		position: { x: 900, y: 200 },
		data: {
			title: 'Informe multilingüe',
			icon: '🌐',
			status: 'CAT / SPA / ENG',
			inputs: [
				{ id: 'brief-geo', label: 'Capes de mapa', color: civicSecondary },
				{ id: 'brief-policy', label: "Manual d'acció", color: civicPrimary },
				{
					id: 'brief-crisis',
					label: 'Assignació de tasques',
					color: civicTertiary,
				},
			],
			outputs: [
				{
					id: 'brief-output',
					label: 'SMS + Correu electrònic',
					color: civicSecondary,
				},
			],
		},
	},
]

const emergencyBriefEdges: FlowEdge[] = [
	{
		id: 'incident-to-branch',
		source: 'incident-webhook',
		sourceHandle: 'incident-output',
		target: 'severity-branch',
		targetHandle: 'severity-input',
		type: 'custom',
		data: { accentColor: civicSecondary },
	},
	{
		id: 'branch-to-geo',
		source: 'severity-branch',
		sourceHandle: 'severity-low',
		target: 'geo-context',
		targetHandle: 'geo-input',
		type: 'custom',
		data: { accentColor: civicSecondary },
	},
	{
		id: 'branch-to-policy',
		source: 'severity-branch',
		sourceHandle: 'severity-med',
		target: 'policy-rules',
		targetHandle: 'policy-input',
		type: 'custom',
		data: { accentColor: civicPrimary },
	},
	{
		id: 'branch-to-crisis',
		source: 'severity-branch',
		sourceHandle: 'severity-high',
		target: 'crisis-ops',
		targetHandle: 'crisis-input',
		type: 'custom',
		data: { accentColor: civicTertiary },
	},
	{
		id: 'geo-to-brief',
		source: 'geo-context',
		sourceHandle: 'geo-output',
		target: 'multilingual-brief',
		targetHandle: 'brief-geo',
		type: 'custom',
		data: { accentColor: civicSecondary },
	},
	{
		id: 'policy-to-brief',
		source: 'policy-rules',
		sourceHandle: 'policy-output',
		target: 'multilingual-brief',
		targetHandle: 'brief-policy',
		type: 'custom',
		data: { accentColor: civicPrimary },
	},
	{
		id: 'crisis-to-brief',
		source: 'crisis-ops',
		sourceHandle: 'crisis-output',
		target: 'multilingual-brief',
		targetHandle: 'brief-crisis',
		type: 'custom',
		data: { accentColor: civicTertiary },
	},
]

const urbanPulseNodes: FlowNode[] = [
	{
		id: 'sensor-ingest',
		type: 'custom',
		position: { x: 80, y: 160 },
		data: {
			title: 'Ingesta de mobilitat',
			icon: '🚌',
			status: 'En streaming',
			description:
				'Llegeix sensors de mobilitat, estacions de bicicletes i càmeres de trànsit.',
			outputs: [
				{
					id: 'sensor-output',
					label: 'Dades de mobilitat',
					color: civicSecondary,
				},
			],
		},
	},
	{
		id: 'survey-sync',
		type: 'custom',
		position: { x: 80, y: 320 },
		data: {
			title: "Sincronització d'enquestes ciutadanes",
			icon: '🗳️',
			status: 'Setmanal',
			outputs: [
				{ id: 'survey-output', label: "Dades d'enquesta", color: civicPrimary },
			],
		},
	},
	{
		id: 'feature-lab',
		type: 'custom',
		position: { x: 360, y: 220 },
		data: {
			title: 'Laboratori de característiques',
			icon: '🧪',
			status: 'Barrejant',
			inputs: [
				{
					id: 'lab-mobility',
					label: 'Dades de mobilitat',
					color: civicSecondary,
				},
				{ id: 'lab-survey', label: "Dades d'enquesta", color: civicPrimary },
			],
			outputs: [
				{
					id: 'lab-output',
					label: 'Conjunt de característiques',
					color: civicSecondary,
				},
			],
		},
	},
	{
		id: 'insight-writer',
		type: 'custom',
		position: { x: 640, y: 220 },
		data: {
			title: "Redactor d'informacions",
			icon: '✍️',
			status: '4 punts destacats',
			inputs: [
				{
					id: 'insight-input',
					label: 'Conjunt de característiques',
					color: civicSecondary,
				},
			],
			outputs: [
				{ id: 'insight-output', label: 'Narrativa', color: civicPrimary },
			],
		},
	},
	{
		id: 'spreadsheet-sync',
		type: 'custom',
		position: { x: 920, y: 220 },
		data: {
			title: 'Sincronització de full de càlcul cívic',
			icon: '📊',
			status: 'Escrivint files',
			inputs: [{ id: 'sheet-input', label: 'Narrativa', color: civicPrimary }],
			outputs: [
				{
					id: 'sheet-output',
					label: 'Graella compartida',
					color: civicSecondary,
				},
			],
		},
	},
]

const urbanPulseEdges: FlowEdge[] = [
	{
		id: 'sensor-to-lab',
		source: 'sensor-ingest',
		sourceHandle: 'sensor-output',
		target: 'feature-lab',
		targetHandle: 'lab-mobility',
		type: 'custom',
		data: { accentColor: civicSecondary },
	},
	{
		id: 'survey-to-lab',
		source: 'survey-sync',
		sourceHandle: 'survey-output',
		target: 'feature-lab',
		targetHandle: 'lab-survey',
		type: 'custom',
		data: { accentColor: civicPrimary },
	},
	{
		id: 'lab-to-writer',
		source: 'feature-lab',
		sourceHandle: 'lab-output',
		target: 'insight-writer',
		targetHandle: 'insight-input',
		type: 'custom',
		data: { accentColor: civicSecondary },
	},
	{
		id: 'writer-to-sheet',
		source: 'insight-writer',
		sourceHandle: 'insight-output',
		target: 'spreadsheet-sync',
		targetHandle: 'sheet-input',
		type: 'custom',
		data: { accentColor: civicPrimary },
	},
]

export const workflows: WorkflowDefinition[] = [
	{
		id: 'tender-scrutinizer',
		title: 'Analitzador de licitacions',
		category: 'Intel·ligència de contractació',
		summary:
			"Automatitza l'extracció de clàusules, la puntuació de compliment i els informes legals per a les revisions de licitacions.",
		metrics: ['4821 documents indexats', '76% de compliment'],
		nodes: tenderScrutinizerNodes,
		edges: tenderScrutinizerEdges,
	},
	{
		id: 'citizen-switchboard',
		title: 'Centraleta de resposta ciutadana',
		category: "Automatització d'atenció ciutadana",
		summary:
			'Detecta la intenció del xat i redirigeix cada flux al procés adequat recolzat en dades.',
		metrics: ['Resolució <15s', '3 intencions redirigides automàticament'],
		nodes: citizenSwitchboardNodes,
		edges: citizenSwitchboardEdges,
	},
	{
		id: 'budget-pulse',
		title: 'Analitzador de pols pressupostari',
		category: 'Supervisió financera',
		summary:
			'Combina la despesa ERP, el sentiment noticiari i els KPI per detectar anomalies per als equips financers.',
		metrics: ['2 alertes destacades', 'Resum nocturn'],
		nodes: budgetPulseNodes,
		edges: budgetPulseEdges,
	},
	{
		id: 'emergency-brief',
		title: "Generador d'informes d'emergència",
		category: 'Resposta a crisis',
		summary:
			"Transforma webhooks d'incidents en informes multilingües amb branques de severitat.",
		metrics: ['Informe en <60s', 'Sortida tri-idioma'],
		nodes: emergencyBriefNodes,
		edges: emergencyBriefEdges,
	},
	{
		id: 'urban-pulse',
		title: "Mesclador d'insights urbans",
		category: 'Anàlisi urbana',
		summary:
			'Barreja sensors de mobilitat i enquestes ciutadanes per enviar perspectives a la graella cívica.',
		metrics: [
			"4 punts d'informació per nit",
			'Sincronització automàtica de la graella',
		],
		nodes: urbanPulseNodes,
		edges: urbanPulseEdges,
	},
]

export const workflowsById = workflows.reduce<
	Record<string, WorkflowDefinition>
>((acc, workflow) => {
	acc[workflow.id] = workflow
	return acc
}, {})
