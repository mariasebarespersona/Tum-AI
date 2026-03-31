// ═══════════════════════════════════════════════════════════════
// TUMAI — Automation Catalog v2.1 (36 automations)
// All names are INDUSTRY-GENERIC. No client-specific terminology.
// ═══════════════════════════════════════════════════════════════

export type Category =
  | 'communication'
  | 'data'
  | 'ai'
  | 'documents'
  | 'analytics'
  | 'infrastructure'
  | 'accounting'
  | 'payments';

export interface AutomationVariable {
  name: string;
  type: 'string' | 'secret' | 'number' | 'object' | 'object[]' | 'string[]' | 'boolean';
  required: boolean;
  description: string;
  example?: string;
  default?: string;
}

export interface Automation {
  id: string;
  name: string;
  shortName: string;
  description: string;
  category: Category;
  status: 'production' | 'draft' | 'planned';
  icon: string;
  variables: AutomationVariable[];
  dependencies: string[];
  origin: string;
  useCases: string[];
  verticals: string[];
}

export const categoryMeta: Record<Category, { label: string; color: string }> = {
  payments:       { label: 'Payments & Collections', color: '#f97316' },
  accounting:     { label: 'Accounting',             color: '#06b6d4' },
  ai:             { label: 'AI Agents',              color: '#8b5cf6' },
  communication:  { label: 'Communication',          color: '#3b82f6' },
  documents:      { label: 'Documents',              color: '#f59e0b' },
  data:           { label: 'Data Collection',        color: '#10b981' },
  analytics:      { label: 'Analytics & Rules',      color: '#ef4444' },
  infrastructure: { label: 'Infrastructure',         color: '#6b7280' },
};

export const automations: Automation[] = [
  // ═══════════════════════════════════════════════
  // PAYMENTS & COLLECTIONS (8)
  // ═══════════════════════════════════════════════
  {
    id: 'recurring-payment-gen',
    name: 'Recurring Payment Generator',
    shortName: 'Generar Pagos',
    description: 'Al activar un contrato, genera N pagos recurrentes con fecha, monto, y status. Maneja meses sin ese dia (ej: 31 feb). Soporta mensual, quincenal, semanal.',
    category: 'payments',
    status: 'production',

    icon: 'CalendarDays',
    variables: [
      { name: 'DB_CONNECTION', type: 'secret', required: true, description: 'Conexion a BD' },
      { name: 'FREQUENCY', type: 'string', required: true, description: 'Frecuencia', example: 'monthly' },
      { name: 'PAYMENT_DAY', type: 'number', required: false, description: 'Dia del periodo', default: '1' },
      { name: 'INITIAL_STATUS', type: 'string', required: false, description: 'Status inicial', default: 'scheduled' },
    ],
    dependencies: [],
    origin: 'Production deployment',
    useCases: ['Calendario de rentas', 'Cuotas de prestamo', 'Suscripciones', 'Planes de pago'],
    verticals: ['property-rental', 'buy-renovate-sell', 'lending', 'service-business'],
  },
  {
    id: 'payment-lifecycle',
    name: 'Payment Lifecycle Manager',
    shortName: 'Ciclo de Pagos',
    description: 'Maquina de estados para pagos. Transiciones automaticas basadas en fechas: scheduled→pending→late→paid. Se ejecuta diario via scheduler.',
    category: 'payments',
    status: 'production',

    icon: 'GitBranch',
    variables: [
      { name: 'DB_CONNECTION', type: 'secret', required: true, description: 'Conexion a BD' },
      { name: 'STATUS_TRANSITIONS', type: 'object[]', required: true, description: 'Reglas de transicion con condiciones', example: '[{from: "pending", to: "late", condition: "days_past_due > 0"}]' },
      { name: 'CHECK_CRON', type: 'string', required: true, description: 'Frecuencia', example: '0 0 * * *' },
    ],
    dependencies: ['background-scheduler'],
    origin: 'Production deployment',
    useCases: ['Estado de rentas', 'Estado de facturas', 'Estado de suscripciones', 'Estado de pedidos'],
    verticals: ['property-rental', 'buy-renovate-sell', 'lending', 'service-business', 'accounting'],
  },
  {
    id: 'late-fee-calculator',
    name: 'Late Fee Calculator',
    shortName: 'Calcular Mora',
    description: 'Calcula penalizacion por pago tardio. Grace period + cargo diario configurable. Crea transaccion separada para la mora. Soporta tope maximo.',
    category: 'payments',
    status: 'production',

    icon: 'TimerOff',
    variables: [
      { name: 'DB_CONNECTION', type: 'secret', required: true, description: 'Conexion a BD' },
      { name: 'GRACE_PERIOD_DAYS', type: 'number', required: true, description: 'Dias de gracia', example: '5' },
      { name: 'FEE_PER_DAY', type: 'number', required: true, description: 'Cargo por dia en USD', example: '5' },
      { name: 'MAX_FEE', type: 'number', required: false, description: 'Tope maximo de mora' },
      { name: 'CREATE_TRANSACTION', type: 'boolean', required: false, description: 'Crear transaccion contable', default: 'true' },
    ],
    dependencies: [],
    origin: 'Production deployment',
    useCases: ['Mora de renta', 'Recargo de factura', 'Penalizacion de prestamo', 'Late delivery fee'],
    verticals: ['property-rental', 'buy-renovate-sell', 'lending', 'service-business'],
  },
  {
    id: 'delinquency-risk-scoring',
    name: 'Delinquency Risk Scoring',
    shortName: 'Risk Score',
    description: 'Clasifica pagadores por riesgo: critical (>90d), high (>60d), medium (>30d), low. Agrega montos vencidos y rankea top N en riesgo.',
    category: 'payments',
    status: 'production',

    icon: 'ShieldAlert',
    variables: [
      { name: 'DB_CONNECTION', type: 'secret', required: true, description: 'Conexion a BD' },
      { name: 'RISK_THRESHOLDS', type: 'object', required: true, description: 'Umbrales en dias', example: '{critical: 90, high: 60, medium: 30}' },
      { name: 'TOP_N', type: 'number', required: false, description: 'Cuantos mostrar', default: '10' },
    ],
    dependencies: [],
    origin: 'Production deployment',
    useCases: ['Priorizar cobros', 'Dashboard de riesgo', 'Reporte para inversores', 'Alertas de cartera'],
    verticals: ['property-rental', 'buy-renovate-sell', 'lending', 'accounting'],
  },
  {
    id: 'affordability-calculator',
    name: 'Affordability Calculator',
    shortName: 'Capacidad Pago',
    description: 'Evalua capacidad de pago: calcula ratio deuda/ingreso (DTI), compara contra umbral, retorna aprobado/rechazado con desglose.',
    category: 'payments',
    status: 'production',

    icon: 'Scale',
    variables: [
      { name: 'DB_CONNECTION', type: 'secret', required: true, description: 'Conexion a BD' },
      { name: 'MAX_RATIO', type: 'number', required: true, description: 'Ratio maximo permitido (%)', example: '43' },
      { name: 'INCOME_FIELDS', type: 'string[]', required: true, description: 'Campos de ingreso', example: '["monthly_income"]' },
      { name: 'DEBT_FIELDS', type: 'string[]', required: true, description: 'Campos de deuda', example: '["monthly_debts", "proposed_payment"]' },
    ],
    dependencies: [],
    origin: 'Production deployment',
    useCases: ['Aprobacion de creditos', 'Screening de inquilinos', 'Evaluacion de riesgo', 'Onboarding financiero'],
    verticals: ['property-rental', 'buy-renovate-sell', 'lending'],
  },
  {
    id: 'contract-completion-cascade',
    name: 'Contract Completion Cascade',
    shortName: 'Cerrar Contrato',
    description: 'Al detectar ultimo pago: (1) marca contrato completado, (2) genera documentos legales, (3) crea transferencia de activo, (4) actualiza N tablas en cascada, (5) notifica al cliente.',
    category: 'payments',
    status: 'production',

    icon: 'Workflow',
    variables: [
      { name: 'DB_CONNECTION', type: 'secret', required: true, description: 'Conexion a BD' },
      { name: 'DOCUMENT_TEMPLATES', type: 'string[]', required: true, description: 'Docs a generar', example: '["bill_of_sale", "certificate"]' },
      { name: 'STATUS_UPDATES', type: 'object[]', required: true, description: 'Tablas y status a actualizar' },
      { name: 'NOTIFICATION_TEMPLATE', type: 'string', required: false, description: 'Template de email de cierre' },
    ],
    dependencies: ['pdf-generator', 'document-storage', 'email-scheduler'],
    origin: 'Production deployment',
    useCases: ['Cierre de lease-to-own', 'Finalizacion de prestamo', 'Entrega de activo', 'Cierre de contrato de servicios'],
    verticals: ['buy-renovate-sell', 'lending'],
  },
  {
    id: 'capital-return-manager',
    name: 'Capital Return Manager',
    shortName: 'Retornos',
    description: 'Gestiona devoluciones de capital a inversores/socios. Actualiza monto retornado, cambia status (parcial/completo), registra flujo contable.',
    category: 'payments',
    status: 'production',

    icon: 'HandCoins',
    variables: [
      { name: 'DB_CONNECTION', type: 'secret', required: true, description: 'Conexion a BD' },
      { name: 'RETURN_STATUSES', type: 'object', required: true, description: 'Estados segun % retornado' },
    ],
    dependencies: ['ledger-sync'],
    origin: 'Production deployment',
    useCases: ['Retorno a inversores', 'Pago de dividendos', 'Devolucion de depositos', 'Liquidacion de fondos'],
    verticals: ['buy-renovate-sell', 'lending'],
  },
  {
    id: 'investment-analyzer',
    name: 'Investment Analyzer',
    shortName: 'Analisis Inv.',
    description: 'Evalua viabilidad de inversion: LTV, ROI, breakeven, cash flow mensual. Identifica factores de riesgo. Recomienda: proceed/caution/reject.',
    category: 'payments',
    status: 'production',

    icon: 'SearchCheck',
    variables: [
      { name: 'DB_CONNECTION', type: 'secret', required: true, description: 'Conexion a BD' },
      { name: 'TARGET_ROI', type: 'number', required: true, description: 'ROI objetivo (%)', example: '20' },
      { name: 'RISK_FACTORS', type: 'object[]', required: true, description: 'Factores y umbrales', example: '[{name: "ltv", max: 90}]' },
      { name: 'MAX_TERM_MONTHS', type: 'number', required: false, description: 'Plazo maximo', default: '48' },
    ],
    dependencies: [],
    origin: 'Production deployment',
    useCases: ['Evaluar compra de activos', 'Aprobar financiamiento', 'Due diligence', 'Analisis de leasing'],
    verticals: ['buy-renovate-sell', 'lending'],
  },

  // ═══════════════════════════════════════════════
  // ACCOUNTING (5)
  // ═══════════════════════════════════════════════
  {
    id: 'ai-transaction-classifier',
    name: 'AI Transaction Classifier',
    shortName: 'Clasificar Txns',
    description: 'GPT-4o clasifica transacciones a cuentas contables automaticamente. Reglas: depositos→ingresos, retiros→gastos. Aprende de correcciones previas del usuario.',
    category: 'accounting',
    status: 'production',

    icon: 'BrainCircuit',
    variables: [
      { name: 'LLM_API_KEY', type: 'secret', required: true, description: 'OpenAI API key' },
      { name: 'CHART_OF_ACCOUNTS', type: 'object[]', required: true, description: 'Plan de cuentas' },
      { name: 'CLASSIFICATION_RULES', type: 'object', required: true, description: 'Reglas de clasificacion' },
      { name: 'CORRECTIONS_TABLE', type: 'string', required: false, description: 'Tabla de correcciones para mejorar precision' },
      { name: 'BATCH_SIZE', type: 'number', required: false, description: 'Transacciones por lote', default: '20' },
    ],
    dependencies: ['openai'],
    origin: 'Production deployment',
    useCases: ['Clasificacion contable', 'Categorizar gastos', 'Asignar centro de costo', 'Reconciliar tarjetas'],
    verticals: ['property-rental', 'buy-renovate-sell', 'accounting', 'service-business', 'lending'],
  },
  {
    id: 'transaction-reconciler',
    name: 'Transaction Reconciler',
    shortName: 'Conciliar',
    description: 'Matching automatico entre dos fuentes (banco vs sistema). Scoring: monto (50pts), direccion, fecha, contraparte. Confianza: high/medium/low.',
    category: 'accounting',
    status: 'production',

    icon: 'GitCompareArrows',
    variables: [
      { name: 'DB_CONNECTION', type: 'secret', required: true, description: 'Conexion a BD' },
      { name: 'MATCH_THRESHOLDS', type: 'object', required: true, description: 'Umbrales', example: '{high: 80, medium: 60, low: 50}' },
      { name: 'AMOUNT_TOLERANCE', type: 'number', required: false, description: 'Tolerancia de monto (%)', default: '5' },
      { name: 'DATE_WINDOW_DAYS', type: 'number', required: false, description: 'Ventana de dias', default: '7' },
    ],
    dependencies: [],
    origin: 'Production deployment',
    useCases: ['Reconciliacion bancaria', 'Matching facturas vs pagos', 'Cuadre de pasarelas de pago'],
    verticals: ['property-rental', 'buy-renovate-sell', 'accounting', 'service-business', 'lending'],
  },
  {
    id: 'ledger-sync',
    name: 'Transaction Ledger Sync',
    shortName: 'Sync Contable',
    description: 'Al registrar un evento financiero, auto-crea la transaccion contable correspondiente. Mapea tipo de evento a cuenta contable.',
    category: 'accounting',
    status: 'production',

    icon: 'ArrowLeftRight',
    variables: [
      { name: 'DB_CONNECTION', type: 'secret', required: true, description: 'Conexion a BD' },
      { name: 'EVENT_MAPPING', type: 'object', required: true, description: 'Mapeo evento→cuenta contable' },
    ],
    dependencies: [],
    origin: 'Production deployment',
    useCases: ['Contabilidad automatica', 'Audit trail financiero', 'Sync con ERP', 'Double-entry bookkeeping'],
    verticals: ['property-rental', 'buy-renovate-sell', 'accounting', 'lending'],
  },
  {
    id: 'portfolio-kpi-engine',
    name: 'Portfolio KPI Engine',
    shortName: 'KPIs',
    description: 'Calcula KPIs en tiempo real: collection rate, delinquency rate, aging buckets (0-30, 31-60, 61-90, 90+), ranking de riesgo.',
    category: 'accounting',
    status: 'production',

    icon: 'BarChart3',
    variables: [
      { name: 'DB_CONNECTION', type: 'secret', required: true, description: 'Conexion a BD' },
      { name: 'METRICS', type: 'string[]', required: true, description: 'KPIs a calcular', example: '["collection_rate", "delinquency", "aging"]' },
      { name: 'AGING_BUCKETS', type: 'object[]', required: false, description: 'Buckets', default: '[0-30, 31-60, 61-90, 90+]' },
    ],
    dependencies: [],
    origin: 'Production deployment',
    useCases: ['Dashboard de cartera', 'Accounts receivable', 'Reporte a inversores', 'Monitoreo de portfolio'],
    verticals: ['property-rental', 'buy-renovate-sell', 'accounting', 'lending'],
  },
  {
    id: 'market-price-advisor',
    name: 'Market Price Advisor',
    shortName: 'Precio Mercado',
    description: 'Calcula precio recomendado para un activo usando datos historicos + datos de mercado + regla de techo configurable. Retorna margen y ROI.',
    category: 'accounting',
    status: 'production',

    icon: 'BadgeDollarSign',
    variables: [
      { name: 'DB_CONNECTION', type: 'secret', required: true, description: 'Conexion a BD' },
      { name: 'MAX_MARKET_PERCENT', type: 'number', required: true, description: 'Techo como % del mercado', example: '80' },
      { name: 'PRICE_SOURCES', type: 'string[]', required: true, description: 'Fuentes de datos', example: '["historical", "market_scraping"]' },
    ],
    dependencies: ['price-predictor'],
    origin: 'Production deployment',
    useCases: ['Pricing de activos', 'Avaluo automatico', 'Precio de lista', 'Comparables de mercado'],
    verticals: ['buy-renovate-sell'],
  },

  // ═══════════════════════════════════════════════
  // AI AGENTS (7)
  // ═══════════════════════════════════════════════
  {
    id: 'ai-cost-estimator',
    name: 'AI Cost Estimator',
    shortName: 'Estimar Costos',
    description: 'LLM analiza condiciones/descripcion y estima costos desglosados: materiales, mano de obra, contingencias. Retorna presupuesto estructurado.',
    category: 'ai',
    status: 'production',

    icon: 'Calculator',
    variables: [
      { name: 'LLM_API_KEY', type: 'secret', required: true, description: 'OpenAI API key' },
      { name: 'LLM_MODEL', type: 'string', required: false, description: 'Modelo', default: 'gpt-4o' },
      { name: 'COST_CATEGORIES', type: 'object[]', required: true, description: 'Categorias y rangos' },
    ],
    dependencies: ['openai'],
    origin: 'Production deployment',
    useCases: ['Presupuesto de obra', 'Cotizacion de servicios', 'Estimacion de reparaciones', 'Presupuesto de proyecto'],
    verticals: ['buy-renovate-sell', 'service-business'],
  },
  {
    id: 'ai-price-analyzer',
    name: 'AI Price Analyzer',
    shortName: 'Analizar Precio',
    description: 'LLM analiza mercado y recomienda estrategia de precios: conservador, target, agresivo. Incluye ROI, margenes, y comparacion con competencia.',
    category: 'ai',
    status: 'production',

    icon: 'TrendingUp',
    variables: [
      { name: 'LLM_API_KEY', type: 'secret', required: true, description: 'OpenAI API key' },
      { name: 'PRICING_RULES', type: 'object', required: true, description: 'Reglas: margen minimo, techo, piso' },
    ],
    dependencies: ['openai'],
    origin: 'Production deployment',
    useCases: ['Pricing de productos', 'Estrategia de ventas', 'Optimizacion de margenes'],
    verticals: ['buy-renovate-sell'],
  },
  {
    id: 'ai-photo-classifier',
    name: 'AI Photo Classifier',
    shortName: 'Clasificar Fotos',
    description: 'GPT-4 Vision clasifica imagenes en categorias configurables. Detecta calidad, features, y sugiere ordenamiento.',
    category: 'ai',
    status: 'production',

    icon: 'Camera',
    variables: [
      { name: 'LLM_API_KEY', type: 'secret', required: true, description: 'OpenAI API key' },
      { name: 'CATEGORIES', type: 'string[]', required: true, description: 'Categorias', example: '["exterior", "interior", "damage", "repaired"]' },
      { name: 'QUALITY_THRESHOLD', type: 'number', required: false, description: 'Umbral de calidad (0-100)', default: '70' },
    ],
    dependencies: ['openai'],
    origin: 'Production deployment',
    useCases: ['Clasificar fotos de activos', 'QA de imagenes', 'Verificar estado', 'Catalogar inventario visual'],
    verticals: ['buy-renovate-sell', 'property-rental', 'service-business'],
  },
  {
    id: 'ai-voice-processor',
    name: 'AI Voice Processor',
    shortName: 'Voz→Datos',
    description: 'Whisper transcribe audio + LLM extrae datos estructurados: intenciones, entidades, cantidades. Para trabajo de campo hands-free.',
    category: 'ai',
    status: 'production',

    icon: 'Mic',
    variables: [
      { name: 'LLM_API_KEY', type: 'secret', required: true, description: 'OpenAI API key' },
      { name: 'INTENTS', type: 'string[]', required: true, description: 'Intenciones a detectar', example: '["add_item", "note", "command"]' },
      { name: 'LANGUAGE', type: 'string', required: false, description: 'Idioma', default: 'es' },
    ],
    dependencies: ['openai'],
    origin: 'Production deployment',
    useCases: ['Notas de campo', 'Dictado de reportes', 'Comandos hands-free', 'Servicio al cliente'],
    verticals: ['buy-renovate-sell', 'service-business'],
  },
  {
    id: 'ai-data-assistant',
    name: 'AI Data Q&A',
    shortName: 'Asistente IA',
    description: 'LLM + function calling para responder preguntas sobre datos del negocio con queries reales. No alucina — solo responde con datos de la BD.',
    category: 'ai',
    status: 'production',

    icon: 'MessageSquare',
    variables: [
      { name: 'LLM_API_KEY', type: 'secret', required: true, description: 'OpenAI API key' },
      { name: 'DB_CONNECTION', type: 'secret', required: true, description: 'Conexion a BD' },
      { name: 'TOOLS_SCHEMA', type: 'object[]', required: true, description: 'Queries disponibles para el LLM' },
      { name: 'SYSTEM_PROMPT', type: 'string', required: true, description: 'Contexto del negocio' },
    ],
    dependencies: ['openai'],
    origin: 'Production deployment',
    useCases: ['BI conversacional', 'Chatbot interno', 'Soporte con datos reales', 'Dashboard por voz'],
    verticals: ['property-rental', 'buy-renovate-sell', 'accounting', 'service-business', 'lending'],
  },
  {
    id: 'ai-asset-inspector',
    name: 'AI Asset Inspector',
    shortName: 'Inspeccionar',
    description: 'GPT-4 Vision analiza fotos de un activo contra checklist configurable. Score 0-100. Recomendacion: buy/review/reject. Respeta evaluaciones manuales.',
    category: 'ai',
    status: 'production',

    icon: 'ClipboardCheck',
    variables: [
      { name: 'LLM_API_KEY', type: 'secret', required: true, description: 'OpenAI API key' },
      { name: 'CHECKLIST_ITEMS', type: 'object[]', required: true, description: 'Items con criterios pass/fail' },
      { name: 'SCORE_THRESHOLDS', type: 'object', required: true, description: 'Umbrales de decision', example: '{approve: 80, review: 60}' },
      { name: 'MAX_PHOTOS', type: 'number', required: false, description: 'Max fotos', default: '10' },
    ],
    dependencies: ['openai'],
    origin: 'Production deployment',
    useCases: ['Inspeccion de propiedades', 'QA de vehiculos', 'Evaluacion de danos', 'Verificar estado de equipos'],
    verticals: ['buy-renovate-sell', 'property-rental'],
  },
  {
    id: 'ai-quote-builder',
    name: 'AI Quote Builder',
    shortName: 'Cotizar IA',
    description: 'GPT-4 Vision analiza fotos y sugiere items de un catalogo estandar con precio estimado. Sesgo conservador: solo lo claramente visible.',
    category: 'ai',
    status: 'production',

    icon: 'Hammer',
    variables: [
      { name: 'LLM_API_KEY', type: 'secret', required: true, description: 'OpenAI API key' },
      { name: 'STANDARD_ITEMS', type: 'object[]', required: true, description: 'Catalogo con precios referencia' },
      { name: 'MAX_PHOTOS', type: 'number', required: false, description: 'Max fotos', default: '8' },
    ],
    dependencies: ['openai'],
    origin: 'Production deployment',
    useCases: ['Cotizar reparaciones', 'Estimar obra', 'Presupuesto de mantenimiento', 'Cotizar servicios'],
    verticals: ['buy-renovate-sell', 'service-business', 'property-rental'],
  },

  // ═══════════════════════════════════════════════
  // COMMUNICATION (4)
  // ═══════════════════════════════════════════════
  {
    id: 'email-scheduler',
    name: 'Email Scheduler',
    shortName: 'Emails',
    description: 'Cola de emails con templates HTML, scheduling por cron, reintentos automaticos, y tracking de estado (pending→sent→failed).',
    category: 'communication',
    status: 'production',

    icon: 'Mail',
    variables: [
      { name: 'EMAIL_PROVIDER', type: 'string', required: true, description: 'Proveedor', example: 'resend' },
      { name: 'EMAIL_API_KEY', type: 'secret', required: true, description: 'API key' },
      { name: 'EMAIL_FROM', type: 'string', required: true, description: 'Email remitente' },
      { name: 'SCHEDULE_CRON', type: 'string', required: true, description: 'Frecuencia', example: '*/30 * * * *' },
      { name: 'MAX_RETRIES', type: 'number', required: false, description: 'Intentos maximos', default: '3' },
    ],
    dependencies: ['resend'],
    origin: 'Production deployment',
    useCases: ['Bienvenida', 'Confirmacion de pago', 'Notificaciones', 'Marketing drip'],
    verticals: ['property-rental', 'buy-renovate-sell', 'accounting', 'service-business', 'lending'],
  },
  {
    id: 'payment-reminders',
    name: 'Payment Reminders',
    shortName: 'Recordatorios',
    description: 'Recordatorios de pago en ventanas configurables: N dias antes, dia del vencimiento, N dias despues. Evita duplicados.',
    category: 'communication',
    status: 'production',

    icon: 'Bell',
    variables: [
      { name: 'REMINDER_WINDOWS', type: 'object[]', required: true, description: 'Ventanas en dias', example: '[-3, 0, 1]' },
      { name: 'DB_CONNECTION', type: 'secret', required: true, description: 'Conexion a BD' },
    ],
    dependencies: ['email-scheduler'],
    origin: 'Production deployment',
    useCases: ['Recordatorio de renta', 'Recordatorio de factura', 'Recordatorio de cuota', 'Renewal reminder'],
    verticals: ['property-rental', 'buy-renovate-sell', 'lending', 'service-business'],
  },
  {
    id: 'overdue-alerts',
    name: 'Overdue Alerts',
    shortName: 'Alertas Vencidos',
    description: 'Deteccion diaria de pagos/tareas vencidos con alerta automatica al administrador. Resumen con montos y clientes afectados.',
    category: 'communication',
    status: 'production',

    icon: 'AlertTriangle',
    variables: [
      { name: 'ADMIN_EMAIL', type: 'string', required: true, description: 'Email del admin' },
      { name: 'CHECK_CRON', type: 'string', required: true, description: 'Frecuencia', example: '0 9 * * *' },
      { name: 'DB_CONNECTION', type: 'secret', required: true, description: 'Conexion a BD' },
    ],
    dependencies: ['email-scheduler', 'background-scheduler'],
    origin: 'Production deployment',
    useCases: ['Alertas de mora', 'Alertas de SLA', 'Alertas de inventario', 'Alertas de vencimiento'],
    verticals: ['property-rental', 'buy-renovate-sell', 'lending', 'service-business', 'accounting'],
  },

  {
    id: 'whatsapp-channel',
    name: 'WhatsApp Channel',
    shortName: 'WhatsApp',
    description: 'Canal de WhatsApp reutilizable via Twilio. Envio de mensajes (texto, templates, media), recepcion via webhook, historial de conversaciones, y routing a otras automatizaciones.',
    category: 'communication',
    status: 'planned',
    icon: 'MessageCircle',
    variables: [
      { name: 'TWILIO_ACCOUNT_SID', type: 'secret', required: true, description: 'Twilio Account SID' },
      { name: 'TWILIO_AUTH_TOKEN', type: 'secret', required: true, description: 'Twilio Auth Token' },
      { name: 'TWILIO_WHATSAPP_NUMBER', type: 'string', required: true, description: 'Numero WhatsApp', example: 'whatsapp:+14155238886' },
      { name: 'DEFAULT_AUTOMATION', type: 'string', required: false, description: 'Automatizacion por defecto para inbound', default: 'ai-data-assistant' },
      { name: 'SESSION_TIMEOUT_HOURS', type: 'number', required: false, description: 'Timeout de conversacion', default: '24' },
    ],
    dependencies: ['twilio'],
    origin: 'Tumai platform',
    useCases: ['Recordatorios de pago por WhatsApp', 'Chatbot conversacional', 'Alertas a admin', 'Recepcion de fotos/audio'],
    verticals: ['property-rental', 'buy-renovate-sell', 'lending', 'service-business'],
  },

  // ═══════════════════════════════════════════════
  // DATA COLLECTION (3)
  // ═══════════════════════════════════════════════
  {
    id: 'web-scraper-json',
    name: 'JSON API Scraper',
    shortName: 'API Scraper',
    description: 'Scraper para APIs JSON publicas. Filtros, paginacion, field mapping, y upsert a BD con deduplicacion automatica.',
    category: 'data',
    status: 'production',

    icon: 'Globe',
    variables: [
      { name: 'SOURCES', type: 'object[]', required: true, description: 'APIs: URL, filtros, mapping' },
      { name: 'DB_TABLE', type: 'string', required: true, description: 'Tabla destino' },
      { name: 'UNIQUE_KEY', type: 'string', required: true, description: 'Campo para dedup', example: 'source_url' },
      { name: 'SCHEDULE_CRON', type: 'string', required: true, description: 'Frecuencia', example: '0 */6 * * *' },
    ],
    dependencies: ['httpx', 'background-scheduler'],
    origin: 'Production deployment',
    useCases: ['Monitoreo de competencia', 'Agregacion de listings', 'ETL publico', 'Market intelligence'],
    verticals: ['buy-renovate-sell'],
  },
  {
    id: 'web-scraper-browser',
    name: 'Browser Automation',
    shortName: 'Browser Bot',
    description: 'Playwright para sitios que requieren JS, login, o interaccion. Secuencia configurable de acciones: click, type, wait, extract.',
    category: 'data',
    status: 'production',

    icon: 'Monitor',
    variables: [
      { name: 'TARGET_URL', type: 'string', required: true, description: 'URL' },
      { name: 'ACTIONS', type: 'object[]', required: true, description: 'Secuencia de acciones' },
      { name: 'SCHEDULE_CRON', type: 'string', required: false, description: 'Si es periodico' },
    ],
    dependencies: ['playwright'],
    origin: 'Production deployment',
    useCases: ['Consultar registros publicos', 'Monitoreo de precios', 'Llenado de formularios', 'Testing'],
    verticals: ['buy-renovate-sell'],
  },
  {
    id: 'screenshot-extractor',
    name: 'Screenshot Data Extractor',
    shortName: 'Extraer Datos',
    description: 'GPT-4 Vision extrae datos estructurados de screenshots o paginas web. Retorna JSON segun schema definido.',
    category: 'data',
    status: 'production',

    icon: 'ScanSearch',
    variables: [
      { name: 'LLM_API_KEY', type: 'secret', required: true, description: 'OpenAI API key' },
      { name: 'OUTPUT_SCHEMA', type: 'object', required: true, description: 'Schema de datos a extraer' },
      { name: 'EXTRACTION_PROMPT', type: 'string', required: false, description: 'Prompt personalizado' },
    ],
    dependencies: ['openai', 'playwright'],
    origin: 'Production deployment',
    useCases: ['Parsear clasificados', 'Digitalizar formularios', 'Extraer datos de facturas', 'OCR inteligente'],
    verticals: ['buy-renovate-sell', 'accounting', 'service-business'],
  },

  // ═══════════════════════════════════════════════
  // DOCUMENTS (4)
  // ═══════════════════════════════════════════════
  {
    id: 'pdf-generator',
    name: 'PDF Generator',
    shortName: 'Generar PDFs',
    description: 'Genera PDFs con templates parametrizados. Soporta tablas, imagenes, firmas, multiples paginas. Branding configurable.',
    category: 'documents',
    status: 'production',

    icon: 'FileText',
    variables: [
      { name: 'TEMPLATES', type: 'object[]', required: true, description: 'Templates con campos dinamicos' },
      { name: 'COMPANY_INFO', type: 'object', required: true, description: 'Nombre, logo, direccion' },
    ],
    dependencies: ['reportlab'],
    origin: 'Production deployment',
    useCases: ['Contratos', 'Facturas', 'Reportes', 'Certificados', 'Recibos'],
    verticals: ['property-rental', 'buy-renovate-sell', 'accounting', 'service-business', 'lending'],
  },
  {
    id: 'document-storage',
    name: 'Document Auto-Gen & Storage',
    shortName: 'Auto-Docs',
    description: 'Auto-genera documentos en eventos del negocio y los sube a cloud storage con metadata. Detecta duplicados.',
    category: 'documents',
    status: 'production',

    icon: 'FolderUp',
    variables: [
      { name: 'STORAGE_PROVIDER', type: 'string', required: true, description: 'Proveedor', example: 'supabase' },
      { name: 'STORAGE_BUCKET', type: 'string', required: true, description: 'Bucket' },
      { name: 'TRIGGERS', type: 'object[]', required: true, description: 'Eventos que disparan generacion' },
    ],
    dependencies: ['pdf-generator'],
    origin: 'Production deployment',
    useCases: ['Contrato al cerrar venta', 'Factura al recibir pago', 'Reporte mensual', 'Certificado al completar'],
    verticals: ['property-rental', 'buy-renovate-sell', 'accounting', 'service-business', 'lending'],
  },
  {
    id: 'contract-pdf-gen',
    name: 'Contract PDF Generator',
    shortName: 'Contrato PDF',
    description: 'Al activar contrato, auto-genera PDF con terminos, clausulas legales, datos de las partes. Sube a storage y guarda URL.',
    category: 'documents',
    status: 'production',

    icon: 'FileSignature',
    variables: [
      { name: 'CONTRACT_TEMPLATE', type: 'object', required: true, description: 'Template con clausulas' },
      { name: 'COMPANY_INFO', type: 'object', required: true, description: 'Datos de la empresa' },
      { name: 'STORAGE_BUCKET', type: 'string', required: true, description: 'Bucket' },
    ],
    dependencies: ['pdf-generator'],
    origin: 'Production deployment',
    useCases: ['Contrato de arrendamiento', 'Acuerdo de servicio', 'Pagare', 'Lease agreement'],
    verticals: ['property-rental', 'buy-renovate-sell', 'lending', 'service-business'],
  },
  {
    id: 'periodic-report-gen',
    name: 'Periodic Report Generator',
    shortName: 'Reportes',
    description: 'Auto-genera reportes periodicos en PDF. Agrega metricas, formatea tablas y secciones, sube a storage. Configurable por periodo.',
    category: 'documents',
    status: 'production',

    icon: 'FileSpreadsheet',
    variables: [
      { name: 'DB_CONNECTION', type: 'secret', required: true, description: 'Conexion a BD' },
      { name: 'REPORT_SECTIONS', type: 'string[]', required: true, description: 'Secciones', example: '["summary", "collections", "aging"]' },
      { name: 'STORAGE_BUCKET', type: 'string', required: true, description: 'Bucket' },
      { name: 'COMPANY_INFO', type: 'object', required: true, description: 'Branding' },
      { name: 'FREQUENCY', type: 'string', required: false, description: 'Frecuencia', default: 'monthly' },
    ],
    dependencies: ['pdf-generator'],
    origin: 'Production deployment',
    useCases: ['Reporte mensual', 'Reporte a inversores', 'Auditoria', 'Reporte de ventas'],
    verticals: ['property-rental', 'buy-renovate-sell', 'accounting', 'lending'],
  },

  // ═══════════════════════════════════════════════
  // ANALYTICS & RULES (3)
  // ═══════════════════════════════════════════════
  {
    id: 'price-predictor',
    name: 'Price Predictor',
    shortName: 'Predecir Precio',
    description: 'Prediccion de precios basada en datos historicos. Segmenta por tipo/categoria. Retorna min/max/avg por segmento.',
    category: 'analytics',
    status: 'production',

    icon: 'LineChart',
    variables: [
      { name: 'HISTORICAL_DATA', type: 'string', required: true, description: 'Fuente de datos' },
      { name: 'SEGMENTS', type: 'string[]', required: true, description: 'Campos para segmentar', example: '["type", "size"]' },
      { name: 'TARGET_FIELD', type: 'string', required: true, description: 'Campo a predecir', example: 'sale_price' },
    ],
    dependencies: [],
    origin: 'Production deployment',
    useCases: ['Prediccion de precio', 'Forecast de revenue', 'Estimacion de costos', 'Market analysis'],
    verticals: ['buy-renovate-sell'],
  },
  {
    id: 'rules-engine',
    name: 'Business Rules Engine',
    shortName: 'Reglas',
    description: 'Motor de reglas configurables. Valida entidades contra condiciones. Retorna pass/fail con detalle de cada regla.',
    category: 'analytics',
    status: 'production',

    icon: 'Shield',
    variables: [
      { name: 'RULES', type: 'object[]', required: true, description: 'Reglas con condiciones y acciones' },
      { name: 'ENTITY_SCHEMA', type: 'object', required: true, description: 'Schema a validar' },
    ],
    dependencies: [],
    origin: 'Production deployment',
    useCases: ['Calificar leads', 'Validar compras', 'Aprobar solicitudes', 'Filtrar inventario', 'Compliance checks'],
    verticals: ['buy-renovate-sell', 'lending', 'property-rental'],
  },
  {
    id: 'financial-analyzer',
    name: 'Financial Analyzer',
    shortName: 'Analisis Fin.',
    description: 'Analisis financiero configurable: LTV, ROI, breakeven, cash flow projection, risk scoring. Metricas y parametros por config.',
    category: 'analytics',
    status: 'production',

    icon: 'PieChart',
    variables: [
      { name: 'DB_CONNECTION', type: 'secret', required: true, description: 'Conexion a BD' },
      { name: 'METRICS', type: 'string[]', required: true, description: 'Metricas', example: '["ltv", "roi", "breakeven"]' },
      { name: 'ANALYSIS_PARAMS', type: 'object', required: true, description: 'Parametros' },
    ],
    dependencies: [],
    origin: 'Production deployment',
    useCases: ['Analisis de inversion', 'Evaluacion de prestamos', 'Proyeccion de cash flow', 'Planificacion financiera'],
    verticals: ['buy-renovate-sell', 'lending', 'accounting'],
  },

  // ═══════════════════════════════════════════════
  // INFRASTRUCTURE (2)
  // ═══════════════════════════════════════════════
  {
    id: 'background-scheduler',
    name: 'Background Scheduler',
    shortName: 'Scheduler',
    description: 'Scheduler centralizado con cron/interval triggers, logging, historial de ejecuciones, y timezone. Singleton pattern.',
    category: 'infrastructure',
    status: 'production',

    icon: 'Clock',
    variables: [
      { name: 'TIMEZONE', type: 'string', required: true, description: 'Zona horaria', example: 'US/Central' },
      { name: 'JOBS', type: 'object[]', required: true, description: 'Lista de jobs' },
      { name: 'MAX_HISTORY', type: 'number', required: false, description: 'Historial', default: '100' },
    ],
    dependencies: ['apscheduler'],
    origin: 'Production deployment',
    useCases: ['Tareas periodicas', 'Procesamiento de colas', 'ETL', 'Health checks'],
    verticals: ['property-rental', 'buy-renovate-sell', 'accounting', 'service-business', 'lending'],
  },
  {
    id: 'data-sync',
    name: 'Cross-System Data Sync',
    shortName: 'Sync',
    description: 'Sincronizacion entre sistemas con deteccion de duplicados, consistencia eventual, y logging de conflictos.',
    category: 'infrastructure',
    status: 'production',

    icon: 'RefreshCw',
    variables: [
      { name: 'SOURCE_DB', type: 'secret', required: true, description: 'BD origen' },
      { name: 'TARGET_DB', type: 'secret', required: true, description: 'BD destino' },
      { name: 'SYNC_RULES', type: 'object[]', required: true, description: 'Reglas de mapeo' },
      { name: 'SCHEDULE_CRON', type: 'string', required: true, description: 'Frecuencia', example: '0 */2 * * *' },
    ],
    dependencies: ['background-scheduler'],
    origin: 'Production deployment',
    useCases: ['Sync entre portales', 'ETL periodico', 'Replicacion', 'Backup incremental'],
    verticals: ['property-rental', 'buy-renovate-sell', 'accounting'],
  },
];

// ═══════════════════════════════════════════════
// EDGES — Automation Flow
// ═══════════════════════════════════════════════
export interface AutomationEdge {
  source: string;
  target: string;
  label?: string;
}

export const automationFlow: AutomationEdge[] = [
  // Data → Analysis
  { source: 'web-scraper-json', target: 'rules-engine', label: 'listings' },
  { source: 'screenshot-extractor', target: 'rules-engine', label: 'extracted' },
  { source: 'rules-engine', target: 'market-price-advisor', label: 'qualified' },
  { source: 'price-predictor', target: 'market-price-advisor', label: 'historical' },
  // AI evaluation
  { source: 'ai-photo-classifier', target: 'ai-asset-inspector', label: 'photos' },
  { source: 'ai-asset-inspector', target: 'ai-cost-estimator', label: 'checklist' },
  { source: 'ai-voice-processor', target: 'ai-cost-estimator', label: 'voice notes' },
  { source: 'ai-cost-estimator', target: 'ai-quote-builder', label: 'costs' },
  { source: 'ai-quote-builder', target: 'ai-price-analyzer', label: 'quote' },
  // Sale → Docs → Email
  { source: 'ai-price-analyzer', target: 'pdf-generator', label: 'sale price' },
  { source: 'pdf-generator', target: 'document-storage', label: 'PDF' },
  { source: 'document-storage', target: 'email-scheduler', label: 'doc ready' },
  // Contract flow
  { source: 'affordability-calculator', target: 'recurring-payment-gen', label: 'approved' },
  { source: 'recurring-payment-gen', target: 'contract-pdf-gen', label: 'schedule' },
  { source: 'contract-pdf-gen', target: 'document-storage', label: 'contract' },
  { source: 'investment-analyzer', target: 'affordability-calculator', label: 'risk OK' },
  // Payment lifecycle
  { source: 'payment-lifecycle', target: 'late-fee-calculator', label: 'late' },
  { source: 'late-fee-calculator', target: 'delinquency-risk-scoring', label: 'fee' },
  { source: 'delinquency-risk-scoring', target: 'overdue-alerts', label: 'critical' },
  { source: 'payment-reminders', target: 'payment-lifecycle', label: 'remind' },
  // Completion
  { source: 'contract-completion-cascade', target: 'pdf-generator', label: 'final pay' },
  { source: 'contract-completion-cascade', target: 'email-scheduler', label: 'congrats' },
  { source: 'contract-completion-cascade', target: 'capital-return-manager', label: 'capital free' },
  // Accounting
  { source: 'ai-transaction-classifier', target: 'transaction-reconciler', label: 'classified' },
  { source: 'transaction-reconciler', target: 'ledger-sync', label: 'matched' },
  { source: 'ledger-sync', target: 'portfolio-kpi-engine', label: 'recorded' },
  { source: 'portfolio-kpi-engine', target: 'periodic-report-gen', label: 'metrics' },
  // AI assistant
  { source: 'ai-data-assistant', target: 'portfolio-kpi-engine', label: 'query' },
  { source: 'ai-data-assistant', target: 'financial-analyzer', label: 'query' },
  // Scheduler
  { source: 'background-scheduler', target: 'web-scraper-json', label: 'cron' },
  { source: 'background-scheduler', target: 'data-sync', label: 'cron' },
  { source: 'background-scheduler', target: 'payment-lifecycle', label: 'daily' },
  { source: 'background-scheduler', target: 'payment-reminders', label: 'daily' },
  // WhatsApp channel
  { source: 'payment-reminders', target: 'whatsapp-channel', label: 'reminder' },
  { source: 'overdue-alerts', target: 'whatsapp-channel', label: 'alert' },
  { source: 'contract-completion-cascade', target: 'whatsapp-channel', label: 'notify' },
  { source: 'whatsapp-channel', target: 'ai-data-assistant', label: 'text msg' },
  { source: 'whatsapp-channel', target: 'ai-voice-processor', label: 'audio' },
  { source: 'whatsapp-channel', target: 'ai-photo-classifier', label: 'image' },
];
