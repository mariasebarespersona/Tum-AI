# Email Scheduler

## Categoría
Comunicación

## Descripción
Sistema de cola de emails con templates HTML personalizables, scheduling por cron, reintentos automáticos, y tracking de estado (pending → sent → failed).

## Cuándo Usar
- Necesitas enviar emails automáticos basados en eventos del negocio
- Quieres templates HTML con variables dinámicas ({{name}}, {{amount}}, etc.)
- Necesitas reintentos automáticos cuando falla el envío
- Quieres tracking de qué emails se enviaron y cuáles fallaron

## Cuándo NO Usar
- Emails transaccionales en tiempo real (usa el API de tu email provider directo)
- Campañas de marketing masivo (usa Mailchimp, Brevo, etc.)
- Notificaciones push (usa otro módulo)

## Variables Requeridas

| Variable | Tipo | Descripción | Ejemplo |
|----------|------|-------------|---------|
| `EMAIL_PROVIDER` | string | Proveedor de email | `"resend"` |
| `EMAIL_API_KEY` | secret | API key del proveedor | `"re_xxxx"` |
| `EMAIL_FROM` | string | Email remitente | `"noreply@company.com"` |
| `EMAIL_FROM_NAME` | string | Nombre remitente | `"Mi Empresa"` |
| `DB_CONNECTION` | secret | Conexión a base de datos | `"postgresql://..."` |
| `SCHEDULE_CRON` | string | Frecuencia de procesamiento | `"*/30 * * * *"` |
| `MAX_RETRIES` | number | Intentos máximos por email | `3` |

## Variables Opcionales

| Variable | Tipo | Default | Descripción |
|----------|------|---------|-------------|
| `TEMPLATES_DIR` | string | `"./templates"` | Directorio de templates HTML |
| `BATCH_SIZE` | number | `50` | Emails por lote |
| `TIMEZONE` | string | `"UTC"` | Zona horaria |

## Dependencias Externas
- Proveedor de email: Resend, SendGrid, o AWS SES
- Base de datos: PostgreSQL (para cola de emails)

## Esquema de Base de Datos Requerido
```sql
CREATE TABLE scheduled_emails (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email_type TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    subject TEXT NOT NULL,
    template_data JSONB DEFAULT '{}',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    scheduled_for TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Ejemplo de Configuración Mínima
```json
{
  "EMAIL_PROVIDER": "resend",
  "EMAIL_FROM": "noreply@mycompany.com",
  "EMAIL_FROM_NAME": "My Company",
  "SCHEDULE_CRON": "*/30 * * * *",
  "MAX_RETRIES": 3
}
```

## Limitaciones
- No soporta adjuntos de más de 10MB (limitación de Resend)
- Templates deben ser HTML estático con variables Jinja2 — no soporta lógica compleja
- La cola es FIFO — no hay prioridades (todavía)

## Origen
Production deployment
