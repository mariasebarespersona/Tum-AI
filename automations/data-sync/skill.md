# Cross-System Data Sync

## Categoria
Infraestructura

## Descripcion
Sincronizacion entre sistemas con deteccion de duplicados, consistencia eventual, y logging de conflictos. Mapeo configurable de campos entre origen y destino.

## Cuando Usar
- Sync entre portales o sistemas internos
- ETL periodico entre bases de datos
- Replicacion de datos entre ambientes
- Backup incremental

## Cuando NO Usar
- Sync en tiempo real (usar webhooks/CDC)
- Volumenes >1M registros por sync (usar herramientas dedicadas)

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `SOURCE_DB` | secret | Conexion a BD origen | `"postgresql://..."` |
| `TARGET_DB` | secret | Conexion a BD destino | `"postgresql://..."` |
| `SYNC_RULES` | object[] | Reglas de mapeo de campos | Ver ejemplo |
| `SCHEDULE_CRON` | string | Frecuencia | `"0 */2 * * *"` |

## Dependencias Externas
- `background-scheduler` — Para ejecucion periodica

## Ejemplo de Configuracion Minima
```json
{
  "SYNC_RULES": [
    {"source_table": "properties", "target_table": "listings", "key": "id", "fields": ["name", "price", "status"]}
  ],
  "SCHEDULE_CRON": "0 */2 * * *"
}
```

## Limitaciones
- Consistencia eventual (no transaccional)
- No maneja conflictos de escritura concurrente
- Performance depende del volumen de datos

## Origen
Production deployment
