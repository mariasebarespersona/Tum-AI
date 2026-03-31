# Payment Lifecycle Manager

## Categoria
Pagos & Cobros

## Descripcion
Maquina de estados automatica para pagos. Transiciones: scheduled→pending (N dias antes del vencimiento), pending→late (si paso la fecha). Se ejecuta diariamente via scheduler. Actualiza en batch todos los pagos que cumplan la condicion.

## Cuando Usar
- Tienes pagos programados que cambian de estado con el tiempo
- Necesitas que el sistema refleje automaticamente que un pago esta proximo o vencido
- Quieres evitar que alguien tenga que revisar manualmente los estados

## Cuando NO Usar
- Pagos con un solo estado (pagado/no pagado)
- Sistemas donde los estados los cambia el usuario manualmente
- Pagos instantaneos (no hay "scheduled")

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `DB_CONNECTION` | secret | Conexion a BD | `"postgresql://..."` |
| `STATUS_TRANSITIONS` | object[] | Reglas de transicion | Ver ejemplo |
| `CHECK_CRON` | string | Frecuencia de ejecucion | `"0 0 * * *"` |

## Variables Opcionales

| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `TIMEZONE` | string | `"UTC"` | Zona horaria para calcular fechas |

## Dependencias Externas
- Base de datos PostgreSQL
- Background scheduler (APScheduler o similar)

## Ejemplo de Configuracion Minima
```json
{
  "STATUS_TRANSITIONS": [
    {"from": "scheduled", "to": "pending", "condition": "days_until_due <= 5"},
    {"from": "pending", "to": "late", "condition": "days_past_due > 0"}
  ],
  "CHECK_CRON": "0 0 * * *"
}
```

## Limitaciones
- Solo transiciones forward (no revierte late→pending)
- No envia notificaciones (usar payment-reminders para eso)
- Depende de que el scheduler este corriendo

## Origen
Production deployment
