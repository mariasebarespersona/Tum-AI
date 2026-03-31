# WhatsApp Channel

## Categoría
Comunicación

## Descripción
Canal de WhatsApp reutilizable para cualquier automatización Tumai. Envío de mensajes (texto, templates, media), recepción via webhook, historial de conversaciones, y routing a otras automatizaciones. Construido sobre Twilio WhatsApp API.

## Cuándo Usar
- Enviar notificaciones por WhatsApp desde cualquier automatización (reminders, alerts, confirmaciones)
- Recibir mensajes de clientes y rutearlos al agente AI correcto
- Crear un chatbot conversacional bidireccional con historial
- Complementar o reemplazar el canal de email con WhatsApp
- Procesar media recibida (fotos, audio, documentos)

## Cuándo NO Usar
- Marketing masivo (usa plataformas especializadas como MessageBird)
- Mensajes que no requieren WhatsApp (usa `email-scheduler`)
- Flujos que requieren WhatsApp Flows nativos de Meta (formularios embebidos)

## Modos de Integración

### Modo 1: Outbound Only (más simple)
La automatización envía mensajes — no necesita webhook.
**Para**: `payment-reminders`, `overdue-alerts`, `contract-completion-cascade`

### Modo 2: Bidireccional
Webhook recibe mensajes, rutea a automatización, envía respuesta.
**Para**: `ai-data-assistant`, `ai-voice-processor`, `ai-photo-classifier`

### Modo 3: Flujos Interactivos
Envía botones/listas, espera selección, continúa flujo.
**Para**: onboarding, encuestas, inicio de compra guiada

## Variables Requeridas

| Variable | Tipo | Descripción | Ejemplo |
|----------|------|-------------|---------|
| `TWILIO_ACCOUNT_SID` | secret | Twilio Account SID | `"ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"` |
| `TWILIO_AUTH_TOKEN` | secret | Twilio Auth Token | `"your_auth_token"` |
| `TWILIO_WHATSAPP_NUMBER` | string | Número WhatsApp de Twilio | `"whatsapp:+14155238886"` |
| `DB_CONNECTION` | secret | Conexión a BD | `"postgresql://..."` |

## Variables Opcionales

| Variable | Tipo | Default | Descripción |
|----------|------|---------|-------------|
| `WEBHOOK_PATH` | string | `"/webhooks/whatsapp"` | Ruta del endpoint webhook |
| `DEFAULT_AUTOMATION` | string | `"ai-data-assistant"` | Automatización por defecto para mensajes inbound |
| `SESSION_TIMEOUT_HOURS` | number | `24` | Horas para expirar una conversación inactiva |
| `MAX_HISTORY_MESSAGES` | number | `20` | Mensajes de historial para contexto LLM |
| `STATUS_CALLBACK_URL` | string | — | URL para delivery receipts de Twilio |

## Dependencias Externas
- **Twilio**: Account con WhatsApp habilitado (sandbox para dev, Business para prod)
- **PostgreSQL (or compatible: Supabase, RDS, Neon)**: Para historial de conversaciones y mensajes

## Dependencias Internas (Automatizaciones)
- `email-scheduler` — Fallback cuando WhatsApp falla
- `ai-data-assistant` — Handler por defecto para mensajes de texto inbound
- `ai-voice-processor` — Handler para notas de voz recibidas
- `ai-photo-classifier` — Handler para fotos recibidas

## API del Módulo

```python
class WhatsAppService:
    # OUTBOUND
    async def send_text(to, body, automation_id) -> dict
    async def send_template(to, template_sid, variables, automation_id) -> dict
    async def send_media(to, media_url, caption, automation_id) -> dict

    # INBOUND
    async def handle_incoming(form_data, request_url, signature) -> dict
    async def route_message(message) -> str  # returns automation_id

    # STATE
    async def get_conversation_history(phone, limit) -> list
    async def get_conversation_as_llm_messages(phone, limit) -> list
```

## Esquema de Base de Datos Requerido

```sql
-- Conversaciones: una por número de teléfono
CREATE TABLE IF NOT EXISTS whatsapp_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone TEXT NOT NULL,
    client_id UUID REFERENCES clients(id),
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'closed', 'expired')),
    active_automation TEXT,
    context JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wa_conv_phone ON whatsapp_conversations(phone, status);

-- Mensajes: historial completo
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN (
        'inbound', 'outbound', 'outbound_template', 'outbound_media')),
    body TEXT DEFAULT '',
    media_url TEXT,
    automation_id TEXT,
    twilio_sid TEXT,
    status TEXT DEFAULT 'sent'
        CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wa_msg_phone ON whatsapp_messages(phone, created_at DESC);

-- Log de notificaciones: previene duplicados
CREATE TABLE IF NOT EXISTS whatsapp_notification_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    automation_id TEXT NOT NULL,
    recipient_phone TEXT NOT NULL,
    template_id TEXT,
    dedup_key TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(dedup_key)
);
```

## Ejemplo de Configuración Mínima
```json
{
  "TWILIO_WHATSAPP_NUMBER": "whatsapp:+14155238886",
  "DEFAULT_AUTOMATION": "ai-data-assistant",
  "SESSION_TIMEOUT_HOURS": 24
}
```

## Regla de 24 Horas de Meta

| Situación | Qué puedes enviar |
|-----------|-------------------|
| Dentro de 24h del último mensaje del usuario | Texto libre, media, interactivos |
| Fuera de la ventana de 24h | Solo templates pre-aprobados (HSM) |

**Implicación**: `payment-reminders` y `overdue-alerts` siempre usan templates (porque inician la conversación). `ai-data-assistant` puede responder con texto libre (porque responde al usuario).

## Limitaciones
- Templates requieren aprobación de Meta (24-48h)
- Media URLs de Twilio expiran — no guardar para uso permanente
- Rate limits: sandbox = 1 msg/seg, Business = 250-100K msg/24h según tier
- Interactive messages (botones/listas) requieren Content Templates de Twilio
- Sin soporte para WhatsApp Flows nativos (formularios embebidos de Meta)

## Origen
Nuevo módulo diseñado para Tumai. Inspirado en patrones de:
- Kapso `integrate-whatsapp` (tipos de mensaje, estructura de webhooks)
- Kapso `automate-whatsapp` (routing, conversation state, execution context)
- production client `email-scheduler` (cola, dedup, reintentos)
