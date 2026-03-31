# Tumai — Estrategia de Verticales y Estandarizacion

## El Insight Clave

Las automatizaciones de Tumai NO deben estar atadas a la terminologia de un cliente.
"RTO Completion Cascade" es lenguaje de Maninos. El 90% de clientes de real estate no hacen RTO.

Lo que SI hacen todos:
- Cobrar rentas mensuales
- Calcular mora
- Generar contratos
- Evaluar propiedades
- Clasificar gastos

**La automatizacion debe describir la FUNCION, no el caso de uso especifico.**

---

## Estandarizacion: De "Maninos-Specific" a "Industry-Generic"

### Antes (atado a Maninos)
```
rto-completion-cascade    → Solo aplica a Rent-to-Own
rto-payment-reminders     → Solo aplica a RTO
investor-return-logic     → Solo aplica si tienes inversores
ai-renovation-autofill    → Solo aplica a renovaciones de casas
```

### Despues (estandarizado por funcion)
```
contract-completion-cascade  → Aplica a CUALQUIER contrato con pagos
payment-reminders            → Aplica a CUALQUIER pago recurrente
capital-return-manager       → Aplica a CUALQUIER estructura con inversores o socios
ai-quote-builder             → Aplica a CUALQUIER cotizacion con fotos
```

### Tabla de Estandarizacion Completa

| ID Anterior | ID Estandar (Tumai) | Nombre | Por que el cambio |
|---|---|---|---|
| `rto-completion-cascade` | `contract-completion-cascade` | Contract Completion Cascade | No solo RTO — aplica a lease, financing, rent |
| `payment-schedule-gen` | `recurring-payment-gen` | Recurring Payment Generator | No solo contratos — aplica a suscripciones, cuotas |
| `dti-calculator` | `affordability-calculator` | Affordability Calculator | DTI es un tipo — puede ser DTI, income ratio, etc. |
| `mora-risk-scoring` | `delinquency-risk-scoring` | Delinquency Risk Scoring | "Mora" es termino latino — "delinquency" es universal |
| `payment-status-machine` | `payment-lifecycle` | Payment Lifecycle Manager | "Machine" es tecnico — "Lifecycle" es de negocio |
| `ai-renovation-autofill` | `ai-quote-builder` | AI Quote Builder | No solo renovacion — aplica a reparaciones, servicios |
| `ai-property-evaluator` | `ai-asset-inspector` | AI Asset Inspector | No solo propiedades — aplica a vehiculos, equipos |
| `sale-price-recommender` | `market-price-advisor` | Market Price Advisor | No solo ventas — aplica a pricing de cualquier activo |
| `investor-return-logic` | `capital-return-manager` | Capital Return Manager | No solo inversores — aplica a socios, prestamistas |
| `capital-flow-accounting` | `ledger-sync` | Transaction Ledger Sync | Mas generico — cualquier flujo→contabilidad |
| `kpi-dashboard` | `portfolio-kpi-engine` | Portfolio KPI Engine | Mas claro que es para carteras/portfolios |
| `financial-report-gen` | `periodic-report-gen` | Periodic Report Generator | No solo financiero — aplica a cualquier reporte |
| `bank-reconciliation` | `transaction-reconciler` | Transaction Reconciler | No solo bancos — aplica a pasarelas de pago, etc. |
| `ai-account-classifier` | `ai-transaction-classifier` | AI Transaction Classifier | No solo cuentas — clasifica cualquier transaccion |
| `ai-assistant-qa` | `ai-data-assistant` | AI Data Q&A | Mas descriptivo de la funcion |
| — | `late-fee-calculator` | Late Fee Calculator | Ya estaba bien |
| — | `email-scheduler` | Email Scheduler | Ya estaba bien |
| — | `payment-reminders` | Payment Reminders | Eliminado "RTO" del prefijo |

---

## Verticales: Paquetes Pre-Armados

### Vertical 1: "Property Rental Management"
**Para:** Empresas que rentan propiedades (departamentos, casas, locales, mobile homes)
**Automatizaciones incluidas (20):**

**Core — Pagos (todo cliente de rentas necesita esto):**
1. `recurring-payment-gen` — Calendario de rentas
2. `payment-lifecycle` — scheduled→pending→late→paid
3. `late-fee-calculator` — Mora automatica
4. `delinquency-risk-scoring` — Ranking de riesgo
5. `payment-reminders` — Recordatorios antes/despues
6. `overdue-alerts` — Alerta diaria al admin
7. `email-scheduler` — Emails automaticos
8. `background-scheduler` — Tareas periodicas

**Contabilidad:**
9. `ai-transaction-classifier` — Clasificar gastos/ingresos
10. `transaction-reconciler` — Conciliar banco
11. `ledger-sync` — Flujos→contabilidad
12. `portfolio-kpi-engine` — KPIs de cartera
13. `periodic-report-gen` — Reportes mensuales

**Documentos:**
14. `pdf-generator` — Contratos, recibos
15. `contract-pdf-gen` — Contrato al firmar
16. `document-storage` — Docs en eventos

**AI:**
17. `ai-data-assistant` — Chatbot de datos del negocio
18. `ai-asset-inspector` — Evaluar propiedades con fotos
19. `ai-quote-builder` — Cotizar reparaciones
20. `ai-photo-classifier` — Clasificar fotos de propiedades

**Opcionales (si aplica):**
- `affordability-calculator` — Si el cliente hace screening de inquilinos
- `rules-engine` — Si necesita reglas de calificacion

---

### Vertical 2: "Buy-Renovate-Sell"
**Para:** Empresas que compran, renuevan, y venden/rentan propiedades (tipo Maninos)
**Automatizaciones incluidas: TODAS (35)**

Incluye todo de Vertical 1 +
- `web-scraper-json` — Buscar propiedades en el mercado
- `web-scraper-browser` — Consultar registros gubernamentales
- `screenshot-extractor` — Extraer datos de clasificados
- `rules-engine` — Filtros de compra (precio, zona, condicion)
- `price-predictor` — Prediccion de precios por segmento
- `ai-cost-estimator` — Presupuesto de renovacion con IA
- `ai-price-analyzer` — Estrategia de venta
- `ai-voice-processor` — Notas de campo por voz
- `market-price-advisor` — Precio recomendado de venta
- `financial-analyzer` — LTV, ROI, breakeven
- `investment-analyzer` — Evaluar compras potenciales
- `capital-return-manager` — Retornos a inversores
- `contract-completion-cascade` — Cierre de contrato
- `affordability-calculator` — Screening financiero
- `data-sync` — Sync entre sistemas

---

### Vertical 3: "Service Business Operations"
**Para:** Empresas de servicios (HVAC, plomeria, electricidad, limpieza, mantenimiento)
**Automatizaciones incluidas (15):**

**Core:**
1. `email-scheduler` — Comunicacion con clientes
2. `payment-reminders` — Recordatorio de facturas
3. `late-fee-calculator` — Penalizacion por pago tardio
4. `recurring-payment-gen` — Contratos de mantenimiento
5. `payment-lifecycle` — Estado de facturas
6. `overdue-alerts` — Alertas de cuentas vencidas
7. `background-scheduler` — Tareas periodicas

**Contabilidad:**
8. `ai-transaction-classifier` — Clasificar gastos/ingresos
9. `transaction-reconciler` — Conciliar banco
10. `portfolio-kpi-engine` — KPIs de negocio

**Documentos:**
11. `pdf-generator` — Facturas, cotizaciones
12. `periodic-report-gen` — Reportes mensuales

**AI:**
13. `ai-quote-builder` — Cotizar servicios con fotos
14. `ai-data-assistant` — Chatbot de datos
15. `ai-voice-processor` — Notas de campo por voz

---

### Vertical 4: "Lending & Financing"
**Para:** Empresas de prestamos, financiamiento, microfinanzas, lease-to-own
**Automatizaciones incluidas (18):**

**Core — Pagos:**
1. `recurring-payment-gen` — Calendario de cuotas
2. `payment-lifecycle` — Estado de pagos
3. `late-fee-calculator` — Mora automatica
4. `delinquency-risk-scoring` — Riesgo de cartera
5. `affordability-calculator` — DTI y capacidad de pago
6. `investment-analyzer` — Evaluar viabilidad
7. `contract-completion-cascade` — Cierre de prestamo
8. `capital-return-manager` — Retorno de capital

**Contabilidad:**
9. `ai-transaction-classifier` — Clasificar movimientos
10. `transaction-reconciler` — Conciliar banco
11. `ledger-sync` — Contabilidad automatica
12. `portfolio-kpi-engine` — KPIs: collection rate, aging, NPL
13. `periodic-report-gen` — Reportes a inversores

**Comunicacion:**
14. `email-scheduler` — Emails automaticos
15. `payment-reminders` — Recordatorios de cuota
16. `overdue-alerts` — Alertas de mora

**Otros:**
17. `background-scheduler` — Jobs periodicos
18. `financial-analyzer` — Proyeccion de cash flow

---

### Vertical 5: "Accounting Standalone"
**Para:** Despachos contables, freelance accountants, PyMEs que quieren contabilidad automatizada
**Automatizaciones incluidas (12):**

**Core:**
1. `ai-transaction-classifier` — Clasificacion automatica con IA
2. `transaction-reconciler` — Reconciliacion bancaria
3. `ledger-sync` — Double-entry automatico
4. `portfolio-kpi-engine` — Metricas financieras

**Reportes:**
5. `periodic-report-gen` — Estados financieros mensuales
6. `pdf-generator` — Facturas, reportes
7. `document-storage` — Almacenamiento de documentos

**Pagos:**
8. `payment-lifecycle` — Tracking de facturas
9. `overdue-alerts` — Alertas de cuentas por cobrar

**Soporte:**
10. `ai-data-assistant` — Preguntas sobre datos contables
11. `email-scheduler` — Comunicacion
12. `background-scheduler` — Procesos periodicos

**Opcionales:**
- `screenshot-extractor` — Digitalizar facturas/recibos
- `financial-analyzer` — Analisis avanzado

---

## Estructura de un Vertical Template

```
verticals/
  property-rental/
    README.md               <- Guia de setup
    schema.sql              <- Tablas necesarias
    automations.json        <- Lista de automatizaciones + config defaults
    seed-data.json          <- Plan de cuentas, categorias iniciales
    env.example             <- Variables de entorno
    customization-guide.md  <- Que personalizar por cliente
```

### automations.json ejemplo:
```json
{
  "vertical": "property-rental",
  "version": "1.0.0",
  "automations": {
    "recurring-payment-gen": {
      "enabled": true,
      "config": {
        "FREQUENCY": "monthly",
        "PAYMENT_DAY": 1,
        "INITIAL_STATUS": "scheduled"
      }
    },
    "payment-lifecycle": {
      "enabled": true,
      "config": {
        "STATUS_TRANSITIONS": [
          {"from": "scheduled", "to": "pending", "condition": "days_until_due <= 5"},
          {"from": "pending", "to": "late", "condition": "days_past_due > 0"}
        ],
        "CHECK_CRON": "0 0 * * *"
      }
    },
    "late-fee-calculator": {
      "enabled": true,
      "config": {
        "GRACE_PERIOD_DAYS": 5,
        "FEE_PER_DAY": 5,
        "MAX_FEE": 150
      }
    }
  }
}
```

---

## Proceso de Onboarding de Nuevo Cliente

```
1. Identificar vertical → "Property Rental Management"
2. tumai deploy property-rental --client=miami-rentals
3. Cliente rellena variables:
   - API keys (email, LLM)
   - Datos empresa (nombre, logo, email)
   - Reglas de negocio (grace period, late fee, max ratio)
   - Plan de cuentas
4. Review en plataforma visual (canvas con nodos)
5. Activar automatizaciones una por una
6. Go live
```

**Tiempo estimado: 1-3 dias** (vs semanas de desarrollo custom)

---

## Pricing por Vertical

| Tier | Que incluye | Precio |
|------|-------------|--------|
| **Rental Starter** | Vertical "Property Rental" (20 automations) | $499/mes |
| **Rental Pro** | + AI agents (classifier, evaluator, Q&A) | $999/mes |
| **Buy-Renovate-Sell** | Todo (35 automations) | $1,499/mes |
| **Service Business** | Vertical servicios (15 automations) | $499/mes |
| **Lending** | Vertical prestamos (18 automations) | $799/mes |
| **Accounting** | Vertical contabilidad (12 automations) | $399/mes |
| **Custom Vertical** | Setup nuevo vertical + automations custom | $2,999/mes + dev |

**Setup fee:** $1,000-$3,000 (one-time, incluye configuracion + training)
