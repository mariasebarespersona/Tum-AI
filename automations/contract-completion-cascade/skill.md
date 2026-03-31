# Contract Completion Cascade

## Categoria
Pagos & Cobros

## Descripcion
Al detectar el ultimo pago de un contrato, ejecuta cascada automatica: (1) marca contrato como completado, (2) genera documentos (Bill of Sale + Titulo), (3) crea registro de transferencia, (4) actualiza status en multiples tablas (contrato, venta, propiedad, cliente), (5) envia email de felicitacion.

## Cuando Usar
- Tienes contratos de cuotas donde al final se transfiere la propiedad
- Necesitas que multiples sistemas se actualicen cuando termina un contrato
- Quieres generar documentos legales automaticamente al completar

## Cuando NO Usar
- Contratos sin transferencia de propiedad al final
- Sistemas donde la finalizacion requiere aprobacion manual

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `DB_CONNECTION` | secret | Conexion a BD | `"postgresql://..."` |
| `DOCUMENT_TEMPLATES` | string[] | Docs a generar | `["bill_of_sale", "title"]` |
| `STATUS_UPDATES` | object[] | Tablas y status a actualizar en cascada | Ver ejemplo |

## Variables Opcionales

| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `COMPLETION_EMAIL` | string | `null` | Template de email |
| `AUTO_TRANSFER` | string | `"true"` | Crear transferencia automaticamente |

## Ejemplo de Configuracion Minima
```json
{
  "DOCUMENT_TEMPLATES": ["bill_of_sale", "title_transfer"],
  "STATUS_UPDATES": [
    {"table": "contracts", "status": "completed"},
    {"table": "sales", "status": "completed"},
    {"table": "properties", "field": "sold", "value": true}
  ]
}
```

## Limitaciones
- Es todo-o-nada: si falla un paso, los anteriores ya se ejecutaron
- Requiere que TODOS los pagos esten marcados como "paid"
- No soporta finalizacion parcial

## Origen
Production deployment
