import { workflowsById } from './workflows.data'

export type ProductWorkflowMeta = {
	id: string
	persona: string
	dataUsed: string[]
	steps: string[]
}

export const productWorkflows: ProductWorkflowMeta[] = [
	{
		id: 'tender-scrutinizer',
		persona: 'Intervenció / Jurídic',
		dataUsed: ['Contractacions', 'Annexos', 'Pressupost'],
		steps: [
			'Llegeix expedients i annexos de contractació',
			"Aplica plantilla d'IA per detectar riscos",
			'Puntua compliment i prepara informe legal',
		],
	},
	{
		id: 'citizen-switchboard',
		persona: 'Atenció ciutadana',
		dataUsed: ['Incidències', 'Registre de consultes'],
		steps: [
			'Classifica la consulta per servei i urgència',
			'Envia derivació a l’equip correcte',
			'Respon amb llenguatge planer i traçable',
		],
	},
	{
		id: 'budget-pulse',
		persona: 'Caps de servei / Finances',
		dataUsed: ['ERP pressupostari', 'KPIs de servei', 'Notícies'],
		steps: [
			'Llegeix execució i KPIs per barri o programa',
			'Detecta desviacions i tendències',
			'Notifica responsables amb recomanacions',
		],
	},
	{
		id: 'emergency-brief',
		persona: 'Alcaldia / Emergències',
		dataUsed: ['Incidències en temps real', 'Mapa de barris'],
		steps: [
			'Agrupa incidències i severitat',
			'Genera briefing per roda de premsa',
			'Assigna següents passos a equips implicats',
		],
	},
	{
		id: 'urban-pulse',
		persona: 'Caps de servei / Mobilitat',
		dataUsed: ['Sensors de mobilitat', 'Enquestes ciutadanes'],
		steps: [
			'Fusiona dades de sensors i enquestes',
			'Calcula impacte per barri',
			'Envia insights a la graella cívica',
		],
	},
].filter(meta => workflowsById[meta.id])

export type ProductTemplate = {
	id: string
	name: string
	persona: string
	inputs: string[]
	outputType: string
	relatedWorkflows: string[]
	markdown: string
}

export const productTemplates: ProductTemplate[] = [
	{
		id: 'informe-comissio',
		name: 'Informe per a comissió',
		persona: 'Intervenció / Secretaria',
		inputs: ['Línies de contractació', 'Risc', 'Barri'],
		outputType: 'Informe estructurat',
		relatedWorkflows: ['tender-scrutinizer'],
		markdown: `# Informe per a comissió

- **Expedient:** {{expedient}}
- **Import:** {{import}}
- **Risc:** {{risc}}
- **Barri:** {{barri}}

## Recomanació
{{recomanacio}}

## Passos següents
{{accions}}`,
	},
	{
		id: 'consulta-veinal',
		name: 'Resposta a consulta veïnal',
		persona: 'Atenció ciutadana',
		inputs: ['Incidències registrades', 'Servei responsable', 'Estat'],
		outputType: 'Resposta en llenguatge planer',
		relatedWorkflows: ['citizen-switchboard'],
		markdown: `Hola,

Hem registrat la teva consulta sobre **{{tema}}** al **{{barri}}**.

- Estat actual: {{estat}}
- Equip responsable: {{servei}}
- Proper pas: {{seguent_pas}}

Gràcies per avisar-nos. Et mantindrem informada.`,
	},
	{
		id: 'esmenes-juridiques',
		name: "Esborrany d'esmenes jurídiques",
		persona: 'Serveis jurídics',
		inputs: [
			'Clàusules de licitació',
			"Plantilla d'esmenes",
			'Riscos detectats',
		],
		outputType: 'Esborrany amb referències de clàusules',
		relatedWorkflows: ['tender-scrutinizer'],
		markdown: `# Esmenes proposades

## Clàusula {{numero}}
- Text original: {{text_original}}
- Risc detectat: {{risc}}
- Esmena suggerida: {{esmena}}
- Motiu: {{motiu}}

## Nota final
Aquest esborrany s'ha de validar per Secretaria/Intervenció.`,
	},
	{
		id: 'briefing-crisi',
		name: 'Briefing de crisi',
		persona: 'Alcaldia / Comunicació',
		inputs: ['Incidències actives', 'Barris afectats', 'Severitat'],
		outputType: 'Punts clau per roda de premsa',
		relatedWorkflows: ['emergency-brief'],
		markdown: `# Briefing de crisi

## Situació actual
- Incidències crítiques: {{incidencies_crit}}
- Barris afectats: {{barris}}

## Missatges clau
1. {{missatge_1}}
2. {{missatge_2}}
3. {{missatge_3}}

## Accions immediates
- {{accio_1}}
- {{accio_2}}
- {{accio_3}}`,
	},
]

export type ProductConnector = {
	id: string
	name: string
	type: 'Font' | 'Destinació' | 'Bidireccional'
	status: 'Simulat' | 'Previst'
	description: string
}

export const productConnectors: ProductConnector[] = [
	{
		id: 'm365',
		name: 'Microsoft 365',
		type: 'Bidireccional',
		status: 'Simulat',
		description:
			'Llegeix i desa fitxers de contractació i plantilles de comissió.',
	},
	{
		id: 'mysql',
		name: 'MySQL municipal',
		type: 'Font',
		status: 'Simulat',
		description: 'Consulta dades de contractacions, subvencions i indicadors.',
	},
	{
		id: 'padro',
		name: 'Padró demogràfic',
		type: 'Font',
		status: 'Simulat',
		description:
			'Aporta context de població i barris per informes i subvencions.',
	},
	{
		id: 'opendata',
		name: 'Portal de dades obertes',
		type: 'Font',
		status: 'Simulat',
		description: 'Inclou licitacions publicades, KPIs i sèries temporals.',
	},
	{
		id: 'expedients',
		name: "Sistema d'expedients",
		type: 'Font',
		status: 'Previst',
		description:
			'Recupera estat i documents signats per vincular-los a la demo.',
	},
	{
		id: 'bi-municipal',
		name: 'BI municipal',
		type: 'Destinació',
		status: 'Previst',
		description:
			'Envia indicadors agregats a quadres de comandament existents.',
	},
]

export type VaultFolder = {
	id: string
	name: string
	description: string
	updated: string
	items: VaultItem[]
}

export type VaultItem = {
	id: string
	name: string
	type: 'folder' | 'pdf' | 'doc' | 'sheet' | 'txt'
	updated: string
	size: string
	description: string
}

export const tendersVault: VaultFolder[] = [
	{
		id: 'licitacions-2024',
		name: 'Licitacions 2024',
		description:
			'Expedients amb memòries, clausules i pressupostos per a la comissió.',
		updated: 'Ahir',
		items: [
			{
				id: 'licitacions-2024-1',
				name: 'Renovació Plaça Major.pdf',
				type: 'pdf',
				updated: 'Ahir',
				size: '4,2 MB',
				description: 'Expedient complet amb pressupost i plànols.',
			},
			{
				id: 'licitacions-2024-2',
				name: 'Serveis de neteja 2025.docx',
				type: 'doc',
				updated: 'Fa 2 dies',
				size: '1,1 MB',
				description: 'Contracte anual de neteja viària i KPI.',
			},
			{
				id: 'licitacions-2024-3',
				name: 'Informe de risc Q2.pdf',
				type: 'pdf',
				updated: 'Fa 3 dies',
				size: '860 KB',
				description: 'Etiqueta riscos i propostes d’esmena.',
			},
		],
	},
	{
		id: 'subvencions-socials',
		name: 'Subvencions socials',
		description:
			"Històric de convocatòries, annexos per barri i cites d'impacte ciutadà.",
		updated: 'Fa 4 dies',
		items: [
			{
				id: 'subvencions-socials-1',
				name: 'Habitatge social - convocatòria.pdf',
				type: 'pdf',
				updated: 'Fa 4 dies',
				size: '2,4 MB',
				description: 'Convocatòria i memòria justificativa.',
			},
			{
				id: 'subvencions-socials-2',
				name: 'Annexos barri nord.xlsx',
				type: 'sheet',
				updated: 'Fa 2 dies',
				size: '540 KB',
				description: 'Imports per barri i entitat.',
			},
		],
	},
	{
		id: 'plantilles-ia',
		name: "Plantilles de xat d'IA",
		description:
			'Prompts per respondre consultes, redactar informes i preparar esmenes.',
		updated: 'Fa 3 hores',
		items: [
			{
				id: 'plantilles-ia-1',
				name: 'Prompt redacció informes.txt',
				type: 'txt',
				updated: 'Fa 3 hores',
				size: '12 KB',
				description: 'Plantilla per generar informes tècnics.',
			},
			{
				id: 'plantilles-ia-2',
				name: 'Prompt consultes jurídiques.txt',
				type: 'txt',
				updated: 'Fa 5 hores',
				size: '9 KB',
				description: 'Plantilla per respondre consultes legals.',
			},
			{
				id: 'plantilles-ia-3',
				name: 'Prompt resposta veïnal.txt',
				type: 'txt',
				updated: 'Fa 1 dia',
				size: '7 KB',
				description: 'Resposta en llenguatge planer a incidències.',
			},
		],
	},
]

export type DataCard = {
	id: string
	name: string
	rows: string
	area: string
	fields: string[]
}

export const dataCards: DataCard[] = [
	{
		id: 'contractacions',
		name: 'Línies de contractació',
		rows: '25 files demo',
		area: 'Intervenció / Contractació',
		fields: ['Expedient', 'Fase', 'Risc', 'Import', 'Barri'],
	},
	{
		id: 'subvencions',
		name: 'Subvencions municipals',
		rows: '18 files demo',
		area: 'Benestar i promoció econòmica',
		fields: ['Programa', 'Estat', 'Barri', 'Import', 'Impacte'],
	},
	{
		id: 'incidencies',
		name: 'Incidències veïnals',
		rows: '40 files demo',
		area: 'Atenció ciutadana',
		fields: ['Tipus', 'Barri', 'Estat', 'Servei responsable'],
	},
	{
		id: 'indicadors',
		name: 'Indicadors de servei',
		rows: '12 files demo',
		area: 'Caps de servei',
		fields: ['Servei', 'Indicador', 'Objectiu', 'Valor actual'],
	},
]
