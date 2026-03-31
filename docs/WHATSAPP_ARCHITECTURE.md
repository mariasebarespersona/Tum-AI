# WhatsApp Channel — Architecture & Integration Guide

## Overview

`whatsapp-channel` es una automatización de infraestructura que añade WhatsApp como canal de comunicación a la plataforma Tumai. Funciona como `email-scheduler` pero para WhatsApp: cualquier automatización puede importarlo y usarlo para enviar o recibir mensajes.

**Proveedor**: Twilio WhatsApp API
**Stack**: FastAPI (webhook) + PostgreSQL (state) + Twilio SDK (mensajería)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      TUMAI PLATFORM                          │
│                                                              │
│  OUTBOUND (Automatizaciones → WhatsApp)                     │
│  ┌────────────────┐ ┌──────────────┐ ┌───────────────────┐  │
│  │payment-reminders│ │overdue-alerts│ │contract-completion│  │
│  └───────┬────────┘ └──────┬───────┘ └────────┬──────────┘  │
│          │                 │                   │             │
│          ▼                 ▼                   ▼             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              whatsapp-channel                        │    │
│  │                                                      │    │
│  │  send_text()  send_template()  send_media()         │    │
│  │  handle_incoming()  route_message()                  │    │
│  │  get_conversation_history()                          │    │
│  │                                                      │    │
│  └──────────────────┬──────────────┬───────────────────┘    │
│                     │              │                         │
│  INBOUND (WhatsApp → Automatizaciones)                     │
│                     │              │                         │
│          ┌──────────┘              └──────────┐             │
│          ▼                                    ▼             │
│  ┌────────────────┐              ┌──────────────────┐      │
│  │ai-data-assistant│              │ai-voice-processor│      │
│  │ai-photo-classif.│              │(audio → text)    │      │
│  └────────────────┘              └──────────────────┘      │
│                                                              │
└──────────────────────────┬───────────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │  PostgreSQL   │
                    │  ─────────  │
                    │  conversations│
                    │  messages     │
                    │  notif_log   │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │ Twilio API  │
                    │ ──────────  │
                    │ Send/Receive│
                    │ Templates   │
                    │ Media       │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │  WhatsApp   │
                    │  (usuario)  │
                    └─────────────┘
```

## Data Flow: Outbound (Automatización → Cliente)

```
1. CRON trigger (e.g., 9am daily)
2. payment-reminders queries DB for payments in reminder window
3. For each payment:
   a. Check dedup_key in whatsapp_notification_log → skip if exists
   b. Call whatsapp_channel.send_template(phone, template_sid, variables)
   c. Twilio sends WhatsApp message via Meta Cloud API
   d. Log to whatsapp_messages + whatsapp_notification_log
   e. Optionally also send email via email-scheduler
```

## Data Flow: Inbound (Cliente → Automatización)

```
1. User sends WhatsApp message
2. Meta delivers to Twilio
3. Twilio POSTs to our webhook: POST /webhooks/whatsapp
4. whatsapp_channel.handle_incoming():
   a. Validate X-Twilio-Signature
   b. Parse: from, body, media_url, media_type
   c. Resolve client by phone number (clients table)
   d. Get or create conversation (whatsapp_conversations)
   e. Log message (whatsapp_messages)
5. whatsapp_channel.route_message():
   a. If conversation has active_automation → continue there
   b. If media is audio → ai-voice-processor
   c. If media is image → ai-photo-classifier
   d. Else → ai-data-assistant (default)
6. Execute automation handler
7. Return TwiML response to Twilio
```

## Database Schema

### whatsapp_conversations
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| phone | TEXT | E.164 phone number |
| client_id | UUID | FK to clients table (nullable) |
| status | TEXT | active / closed / expired |
| active_automation | TEXT | Current automation handling this convo |
| context | JSONB | Automation-specific state (step, flow data) |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

### whatsapp_messages
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| phone | TEXT | E.164 phone number |
| direction | TEXT | inbound / outbound / outbound_template / outbound_media |
| body | TEXT | Message content |
| media_url | TEXT | URL of attached media (nullable) |
| automation_id | TEXT | Which automation sent/processed this |
| twilio_sid | TEXT | Twilio message SID |
| status | TEXT | sent / delivered / read / failed |
| created_at | TIMESTAMPTZ | |

### whatsapp_notification_log
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| automation_id | TEXT | Source automation |
| recipient_phone | TEXT | |
| template_id | TEXT | Twilio Content Template SID |
| dedup_key | TEXT | Unique key to prevent duplicates |
| sent_at | TIMESTAMPTZ | |

## Integration Map

Which automations connect to whatsapp-channel and how:

| Automation | Direction | What it does | Phase |
|-----------|-----------|-------------|-------|
| **payment-reminders** | Outbound | Template: "Tu pago de $X vence el Y" | 1 (MVP) |
| **overdue-alerts** | Outbound | Template: "Tienes N pagos vencidos por $X" | 1 |
| **contract-completion-cascade** | Outbound | Template: "Tu contrato está completo" | 2 |
| **ai-data-assistant** | Bidirectional | "¿Cuánto debo?" → Claude + tools → respuesta | 2 |
| **ai-voice-processor** | Inbound | Nota de voz → Whisper → texto → procesar | 3 |
| **ai-photo-classifier** | Inbound | Foto → GPT-4 Vision → clasificación | 3 |
| **ai-asset-inspector** | Inbound | Foto de propiedad → score de inspección | 3 |
| **ai-quote-builder** | Inbound | Foto de renovación → cotización | 3 |

## Key Design Decisions

### 1. Twilio over raw Meta Cloud API
- **Pro**: SDK con validación de webhooks, sandbox sin aprobación, soporte telefónico
- **Pro**: Abstrae la complejidad de Meta Business Manager
- **Con**: ~$0.005 extra por mensaje
- **Decisión**: Vale la pena por simplicidad y velocidad de desarrollo

### 2. TwiML Response vs REST Callback
Twilio espera una respuesta XML (TwiML) del webhook para responder al usuario.
Alternativa: responder 200 OK y enviar reply via REST API.
**Decisión**: TwiML para respuestas simples, REST API para respuestas que requieren procesamiento async.

### 3. Conversation State in the database (no Redis)
- Ya tenemos PostgreSQL en el stack
- Las conversaciones no son ultra-high-frequency
- Permite queries SQL para analytics
- Real-time subscriptions disponibles si necesitamos notificar a un dashboard

### 4. Router Simple (media type) vs LLM Router
MVP: router por media type (audio→voz, imagen→fotos, texto→assistant)
Futuro: LLM que clasifique intención del mensaje y rutee al automation correcta.
**Decisión**: Empezar simple, evolucionar cuando haya datos reales de uso.

### 5. Dedup via Unique Key
Cron puede ejecutarse dos veces. El campo `dedup_key` en `whatsapp_notification_log`
con constraint UNIQUE previene envíos duplicados sin lógica adicional.
Formato: `{automation_id}:{entity_id}:{window}` (e.g., `payment_reminder:uuid:3`)

## Meta 24h Session Window

```
                    ← 24h window →
User sends msg      │              │ Window expires
     │              │              │
     ▼              │              ▼
 ┌───────┐    ┌─────┴─────┐   ┌──────────┐
 │Message │    │ Free-form │   │ Template  │
 │received│───▶│  replies  │   │ required  │
 └───────┘    │ allowed   │   │ to re-open│
              └───────────┘   └──────────┘
```

**Impacto en automatizaciones**:
- `payment-reminders`: Siempre inicia conversación → siempre usa template
- `ai-data-assistant`: Responde al usuario → texto libre (dentro de ventana)
- Si el usuario no ha escrito en 24h y queremos contactarlo → template obligatorio

## Implementation Phases

### Phase 1: Outbound MVP
- `WhatsAppService` con `send_text()` y `send_template()`
- Migración SQL para las 3 tablas
- Twilio sandbox configurado
- `payment-reminders` conectado con config `NOTIFICATION_CHANNEL: "whatsapp"`
- `overdue-alerts` enviando resumen diario al admin

### Phase 2: Inbound + Conversational
- Webhook endpoint con validación de firma
- `handle_incoming()` + conversation state
- Router básico (text→ai-data-assistant, audio→voz, imagen→fotos)
- Claude API con historial de conversación y business tools

### Phase 3: Media + Advanced
- Procesamiento de notas de voz (descargar → Whisper → texto)
- Procesamiento de fotos (descargar → GPT-4 Vision)
- Flujos multi-paso con `context` en conversación
- Escalación a humano (detección de intent "quiero hablar con alguien")

### Phase 4: Production
- Twilio WhatsApp Business number (requiere verificación Meta)
- Templates aprobados por Meta
- Status callbacks (delivery receipts → actualizar whatsapp_messages.status)
- Rate limiting y error handling
- Analytics dashboard

## Templates a Crear

### payment_reminder (UTILITY)
```
Hola {{1}} 👋
Tu pago de {{2}} vence el {{3}}.
Responde PAGAR para ver opciones o AYUDA si tienes dudas.
```

### overdue_alert (UTILITY)
```
⚠️ Alerta: {{1}} pagos vencidos por un total de {{2}}.
El más antiguo tiene {{3}} días de retraso.
Revisa el dashboard para detalles.
```

### contract_complete (UTILITY)
```
🎉 ¡Felicidades {{1}}!
Tu contrato para {{2}} ha sido completado exitosamente.
Revisa tu portal de cliente para los documentos finales.
```

## Relación con Automatizaciones Existentes

```
whatsapp-channel es a WhatsApp lo que email-scheduler es a Email.

Ambos son canales de comunicación genéricos que otras automatizaciones usan.
La diferencia: WhatsApp es bidireccional y requiere gestión de sesión.

┌──────────────────────────────────────────────────┐
│           Capa de Comunicación Tumai              │
│                                                   │
│  ┌──────────────┐       ┌──────────────────┐     │
│  │email-scheduler│       │whatsapp-channel  │     │
│  │  (outbound)   │       │(outbound+inbound)│     │
│  └──────────────┘       └──────────────────┘     │
│         ▲                        ▲                │
│         │                        │                │
│  ┌──────┴────────────────────────┴──────────┐    │
│  │  payment-reminders  │  overdue-alerts     │    │
│  │  contract-completion │  ai-data-assistant  │    │
│  └──────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```
