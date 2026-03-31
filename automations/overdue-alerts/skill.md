# Overdue Alerts

## Categoria
Comunicacion

## Descripcion
Deteccion diaria de pagos/tareas vencidos con alerta automatica al administrador. Resume montos totales y lista los clientes afectados con dias de atraso.

## Cuando Usar
- Alerta diaria de pagos atrasados
- Monitoreo de SLAs vencidos
- Alertas de inventario bajo
- Alertas de documentos por vencer

## Cuando NO Usar
- Alertas en tiempo real (usar webhooks)
- Cuando ya tienes un sistema de alertas dedicado

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `ADMIN_EMAIL` | string | Email del administrador | `"admin@empresa.com"` |
| `CHECK_CRON` | string | Frecuencia de verificacion | `"0 9 * * *"` |
| `DB_CONNECTION` | secret | Conexion a BD | `"postgresql://..."` |

## Dependencias Externas
- `email-scheduler` — Para enviar las alertas
- `background-scheduler` — Para la ejecucion periodica

## Ejemplo de Configuracion Minima
```json
{
  "ADMIN_EMAIL": "admin@empresa.com",
  "CHECK_CRON": "0 9 * * *"
}
```

## Limitaciones
- Frecuencia minima: cada hora (por cron)
- No notifica en tiempo real

## Origen
Production deployment
