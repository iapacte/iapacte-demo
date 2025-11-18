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

const civicSecondary = 'var(--md3-sys-color-secondary)'
const civicPrimary = 'var(--md3-sys-color-primary)'
const civicTertiary = 'var(--md3-sys-color-tertiary)'

const tenderScrutinizerNodes: FlowNode[] = [
	{
		id: 'vault-loader',
		type: 'custom',
		position: { x: 80, y: 140 },
		data: {
			title: 'Tender Vault Loader',
			icon: '📂',
			status: 'Synced hourly',
			description: 'Indexes procurement PDFs, annexes, and guidelines.',
			accentColor: civicSecondary,
			outputs: [
				{ id: 'vault-output', label: 'Tender files', color: civicSecondary },
			],
			parameters: [
				{
					id: 'loader-source',
					label: 'Source',
					type: 'str',
					value: 'S3://iapacte-tenders',
				},
				{ id: 'loader-volume', label: 'Docs synced', type: 'int', value: 4821 },
			],
		},
	},
	{
		id: 'compliance-nlp',
		type: 'custom',
		position: { x: 360, y: 120 },
		data: {
			title: 'Compliance NLP',
			icon: '🧠',
			status: 'Evaluating clauses',
			description: 'Extracts obligations, deadlines, and scoring dimensions.',
			accentColor: civicPrimary,
			inputs: [
				{ id: 'nlp-input', label: 'Tender files', color: civicSecondary },
			],
			outputs: [{ id: 'nlp-output', label: 'Findings', color: civicPrimary }],
			parameters: [
				{
					id: 'nlp-model',
					label: 'Model',
					type: 'str',
					value: 'juridic-text-002',
				},
				{
					id: 'nlp-risk',
					label: 'Risk thresholds',
					type: 'str',
					value: 'High/Med/Low',
				},
			],
		},
	},
	{
		id: 'risk-score',
		type: 'custom',
		position: { x: 640, y: 100 },
		data: {
			title: 'Risk Scoring',
			icon: '⚖️',
			status: '76% compliant',
			description: 'Maps findings to municipal rulebook and budgets.',
			accentColor: civicTertiary,
			inputs: [
				{ id: 'risk-input-findings', label: 'Findings', color: civicPrimary },
				{
					id: 'risk-input-ledger',
					label: 'Ledger records',
					color: civicSecondary,
				},
			],
			outputs: [
				{
					id: 'risk-output',
					label: 'Compliance insights',
					color: civicTertiary,
				},
			],
			parameters: [
				{
					id: 'risk-budget',
					label: 'Budget link',
					type: 'str',
					value: 'ERP:CAPEX-2025',
				},
				{ id: 'risk-alert', label: 'Alert threshold', type: 'int', value: 70 },
			],
		},
	},
	{
		id: 'legal-brief',
		type: 'custom',
		position: { x: 920, y: 140 },
		data: {
			title: 'Legal Brief Generator',
			icon: '📜',
			status: 'Draft ready',
			description: 'Produces summary + next steps for the legal desk.',
			accentColor: civicSecondary,
			inputs: [
				{ id: 'brief-input-risk', label: 'Risk summary', color: civicTertiary },
			],
			outputs: [
				{ id: 'brief-output', label: 'Brief PDF', color: civicSecondary },
			],
			parameters: [
				{
					id: 'brief-language',
					label: 'Language',
					type: 'str',
					value: 'Catalan',
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
			title: 'Intent Gateway',
			icon: '🛎️',
			status: 'Listening',
			description: 'Classifies chats into service, permit, or alert.',
			outputs: [
				{ id: 'intent-output', label: 'Intent label', color: civicPrimary },
			],
			parameters: [
				{
					id: 'intent-latency',
					label: 'Latency',
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
			title: 'Service Request Flow',
			icon: '🧹',
			status: 'Queued',
			description: 'Creates tickets in maintenance DB and fetches ETA.',
			accentColor: civicSecondary,
			inputs: [
				{ id: 'service-intent', label: 'Intent label', color: civicPrimary },
			],
			outputs: [
				{ id: 'service-output', label: 'Ticket ID', color: civicSecondary },
			],
		},
	},
	{
		id: 'permit-guide',
		type: 'custom',
		position: { x: 360, y: 220 },
		data: {
			title: 'Permit Guidance',
			icon: '📑',
			status: 'Auto-answering',
			description: 'Looks up policy docs and preps personalized checklist.',
			accentColor: civicPrimary,
			inputs: [
				{ id: 'permit-intent', label: 'Intent label', color: civicPrimary },
			],
			outputs: [
				{ id: 'permit-output', label: 'Guidance', color: civicPrimary },
			],
		},
	},
	{
		id: 'alert-bridge',
		type: 'custom',
		position: { x: 360, y: 360 },
		data: {
			title: 'Alert Bridge',
			icon: '🚨',
			status: 'Idle',
			description: 'Routes urgent safety alerts to duty officers.',
			accentColor: civicTertiary,
			inputs: [
				{ id: 'alert-intent', label: 'Intent label', color: civicPrimary },
			],
			outputs: [
				{ id: 'alert-output', label: 'Dispatch payload', color: civicTertiary },
			],
		},
	},
	{
		id: 'chat-responder',
		type: 'custom',
		position: { x: 660, y: 220 },
		data: {
			title: 'Chat Responder',
			icon: '💬',
			status: 'Streaming reply',
			description: 'Composes final response referencing workflow outcome.',
			accentColor: civicSecondary,
			inputs: [
				{ id: 'responder-service', label: 'Ticket ID', color: civicSecondary },
				{ id: 'responder-permit', label: 'Guidance', color: civicPrimary },
				{
					id: 'responder-alert',
					label: 'Dispatch payload',
					color: civicTertiary,
				},
			],
			outputs: [
				{
					id: 'responder-output',
					label: 'Chat message',
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
			title: 'Budget Scheduler',
			icon: '⏱️',
			status: 'Nightly',
			description: 'Triggers ERP, open data, and news pipelines.',
			outputs: [
				{ id: 'scheduler-output', label: 'Cron tick', color: civicSecondary },
			],
		},
	},
	{
		id: 'erp-connector',
		type: 'custom',
		position: { x: 340, y: 80 },
		data: {
			title: 'ERP Connector',
			icon: '💼',
			status: 'Synced',
			accentColor: civicPrimary,
			inputs: [{ id: 'erp-input', label: 'Cron tick', color: civicSecondary }],
			outputs: [{ id: 'erp-output', label: 'Spend feed', color: civicPrimary }],
		},
	},
	{
		id: 'news-sentiment',
		type: 'custom',
		position: { x: 340, y: 240 },
		data: {
			title: 'News Sentiment',
			icon: '📰',
			status: 'Parsing 12 papers',
			accentColor: civicTertiary,
			inputs: [{ id: 'news-input', label: 'Cron tick', color: civicSecondary }],
			outputs: [
				{ id: 'news-output', label: 'Sentiment feed', color: civicTertiary },
			],
		},
	},
	{
		id: 'anomaly-detector',
		type: 'custom',
		position: { x: 620, y: 150 },
		data: {
			title: 'Anomaly Detector',
			icon: '📈',
			status: 'Flagged 2 items',
			description: 'Compares spend against news & KPIs.',
			inputs: [
				{ id: 'anomaly-spend', label: 'Spend feed', color: civicPrimary },
				{ id: 'anomaly-news', label: 'Sentiment feed', color: civicTertiary },
			],
			outputs: [{ id: 'anomaly-output', label: 'Alerts', color: civicPrimary }],
		},
	},
	{
		id: 'finance-brief',
		type: 'custom',
		position: { x: 900, y: 150 },
		data: {
			title: 'Finance Brief',
			icon: '📊',
			status: 'Ready for CFO',
			inputs: [{ id: 'brief-input', label: 'Alerts', color: civicPrimary }],
			outputs: [{ id: 'brief-output', label: 'Digest', color: civicSecondary }],
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
			title: 'Incident Webhook',
			icon: '📡',
			status: 'Live',
			description: 'Receives events from 112 and local police.',
			outputs: [
				{
					id: 'incident-output',
					label: 'Incident payload',
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
			title: 'Severity Branch',
			icon: '🧭',
			status: 'Medium',
			inputs: [
				{
					id: 'severity-input',
					label: 'Incident payload',
					color: civicSecondary,
				},
			],
			outputs: [
				{ id: 'severity-low', label: 'Low', color: civicSecondary },
				{ id: 'severity-med', label: 'Medium', color: civicPrimary },
				{ id: 'severity-high', label: 'High', color: civicTertiary },
			],
		},
	},
	{
		id: 'geo-context',
		type: 'custom',
		position: { x: 620, y: 60 },
		data: {
			title: 'Geo Context',
			icon: '🗺️',
			status: 'Ready',
			inputs: [
				{ id: 'geo-input', label: 'Low incidents', color: civicSecondary },
			],
			outputs: [
				{ id: 'geo-output', label: 'Map overlays', color: civicSecondary },
			],
		},
	},
	{
		id: 'policy-rules',
		type: 'custom',
		position: { x: 620, y: 220 },
		data: {
			title: 'Policy Rules',
			icon: '📘',
			status: 'Resolving ...',
			inputs: [
				{ id: 'policy-input', label: 'Medium incidents', color: civicPrimary },
			],
			outputs: [
				{ id: 'policy-output', label: 'Playbook', color: civicPrimary },
			],
		},
	},
	{
		id: 'crisis-ops',
		type: 'custom',
		position: { x: 620, y: 360 },
		data: {
			title: 'Crisis Ops Escalation',
			icon: '🛡️',
			status: 'Idle',
			inputs: [
				{ id: 'crisis-input', label: 'High incidents', color: civicTertiary },
			],
			outputs: [
				{ id: 'crisis-output', label: 'Tasking', color: civicTertiary },
			],
		},
	},
	{
		id: 'multilingual-brief',
		type: 'custom',
		position: { x: 900, y: 200 },
		data: {
			title: 'Multilingual Brief',
			icon: '🌐',
			status: 'CAT / SPA / ENG',
			inputs: [
				{ id: 'brief-geo', label: 'Map overlays', color: civicSecondary },
				{ id: 'brief-policy', label: 'Playbook', color: civicPrimary },
				{ id: 'brief-crisis', label: 'Tasking', color: civicTertiary },
			],
			outputs: [
				{ id: 'brief-output', label: 'SMS + Email', color: civicSecondary },
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
			title: 'Mobility Ingest',
			icon: '🚌',
			status: 'Streaming',
			description: 'Reads mobility sensors, bike docks, and traffic cams.',
			outputs: [
				{ id: 'sensor-output', label: 'Mobility data', color: civicSecondary },
			],
		},
	},
	{
		id: 'survey-sync',
		type: 'custom',
		position: { x: 80, y: 320 },
		data: {
			title: 'Citizen Survey Sync',
			icon: '🗳️',
			status: 'Weekly',
			outputs: [
				{ id: 'survey-output', label: 'Survey data', color: civicPrimary },
			],
		},
	},
	{
		id: 'feature-lab',
		type: 'custom',
		position: { x: 360, y: 220 },
		data: {
			title: 'Feature Lab',
			icon: '🧪',
			status: 'Mixing',
			inputs: [
				{ id: 'lab-mobility', label: 'Mobility data', color: civicSecondary },
				{ id: 'lab-survey', label: 'Survey data', color: civicPrimary },
			],
			outputs: [
				{ id: 'lab-output', label: 'Feature set', color: civicSecondary },
			],
		},
	},
	{
		id: 'insight-writer',
		type: 'custom',
		position: { x: 640, y: 220 },
		data: {
			title: 'Insight Writer',
			icon: '✍️',
			status: '4 highlights',
			inputs: [
				{ id: 'insight-input', label: 'Feature set', color: civicSecondary },
			],
			outputs: [
				{ id: 'insight-output', label: 'Narrative', color: civicPrimary },
			],
		},
	},
	{
		id: 'spreadsheet-sync',
		type: 'custom',
		position: { x: 920, y: 220 },
		data: {
			title: 'Civic Spreadsheet Sync',
			icon: '📊',
			status: 'Writing rows',
			inputs: [{ id: 'sheet-input', label: 'Narrative', color: civicPrimary }],
			outputs: [
				{ id: 'sheet-output', label: 'Shared grid', color: civicSecondary },
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
		title: 'Tender Scrutinizer',
		category: 'Procurement intelligence',
		summary:
			'Automates clause extraction, compliance scoring, and legal briefs for tender reviews.',
		metrics: ['4821 docs indexed', '76% compliance score'],
		nodes: tenderScrutinizerNodes,
		edges: tenderScrutinizerEdges,
	},
	{
		id: 'citizen-switchboard',
		title: 'Citizen Response Switchboard',
		category: 'Frontdesk automation',
		summary:
			'Detects chat intent and routes each flow to the right data-backed workflow.',
		metrics: ['<15s resolution', '3 intents auto-routed'],
		nodes: citizenSwitchboardNodes,
		edges: citizenSwitchboardEdges,
	},
	{
		id: 'budget-pulse',
		title: 'Budget Pulse Analyzer',
		category: 'Finance oversight',
		summary:
			'Combines ERP spend, news sentiment, and KPIs to surface anomalies for finance teams.',
		metrics: ['2 alerts flagged', 'Nightly digest'],
		nodes: budgetPulseNodes,
		edges: budgetPulseEdges,
	},
	{
		id: 'emergency-brief',
		title: 'Emergency Brief Generator',
		category: 'Crisis response',
		summary:
			'Turns incident webhooks into multilingual briefings with branching severity.',
		metrics: ['<60s briefing', 'Tri-language output'],
		nodes: emergencyBriefNodes,
		edges: emergencyBriefEdges,
	},
	{
		id: 'urban-pulse',
		title: 'Urban Pulse Insight Mixer',
		category: 'City analytics',
		summary:
			'Mixes mobility sensors and citizen surveys to push insights to the civic spreadsheet.',
		metrics: ['4 insights/night', 'Grid auto-sync'],
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
