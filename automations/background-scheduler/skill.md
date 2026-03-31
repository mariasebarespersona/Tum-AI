# Background Scheduler

## Categoria
Infraestructura

## Descripcion
Scheduler centralizado con cron/interval triggers, logging, historial de ejecuciones, y timezone. Singleton pattern para evitar duplicados. Base para todas las tareas periodicas.

## Cuando Usar
- Ejecutar tareas en horarios especificos (cron)
- Procesamiento periodico de colas
- ETL programado
- Health checks y mantenimiento

## Cuando NO Usar
- Tareas que requieren ejecucion en tiempo real (usar webhooks)
- Jobs de larga duracion (>10 min, usar queue workers)

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `TIMEZONE` | string | Zona horaria | `"US/Central"` |
| `JOBS` | object[] | Lista de jobs con triggers | Ver ejemplo |

## Variables Opcionales

| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `MAX_HISTORY` | number | `100` | Cuantas ejecuciones guardar |
| `LOG_LEVEL` | string | `INFO` | Nivel de logging |

## Dependencias Externas
- `apscheduler` — Advanced Python Scheduler

## Ejemplo de Configuracion Minima
```json
{
  "TIMEZONE": "US/Central",
  "JOBS": [
    {"id": "check-payments", "trigger": "cron", "cron": "0 0 * * *", "function": "check_payment_statuses"},
    {"id": "send-reminders", "trigger": "cron", "cron": "0 9 * * *", "function": "send_reminders"}
  ]
}
```

## Limitaciones
- Singleton: solo una instancia por proceso
- No persiste jobs entre reinicios (se reconfiguran al startup)
- Precision de ±1 segundo

## Origen
Production deployment
