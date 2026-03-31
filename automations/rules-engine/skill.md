# Business Rules Engine

## Categoria
Analytics & Rules

## Descripcion
Motor de reglas configurables para validar entidades contra condiciones de negocio. Retorna pass/fail con detalle de cada regla evaluada. Reglas declarativas en JSON.

## Cuando Usar
- Calificar leads o prospectos
- Validar compras contra criterios
- Aprobar/rechazar solicitudes automaticamente
- Filtrar inventario por requisitos
- Compliance checks

## Cuando NO Usar
- Reglas que cambian por transaccion (usar logica custom)
- Decisiones que requieren juicio humano

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `RULES` | object[] | Reglas con condiciones y acciones | Ver ejemplo |
| `ENTITY_SCHEMA` | object | Schema de la entidad a validar | `{"fields": ["price", "location"]}` |

## Dependencias Externas
- Ninguna (logica pura)

## Ejemplo de Configuracion Minima
```json
{
  "RULES": [
    {"name": "max_price", "field": "price", "operator": "<=", "value": 80000, "action": "reject"},
    {"name": "min_sqft", "field": "sqft", "operator": ">=", "value": 500, "action": "reject"},
    {"name": "location", "field": "distance_miles", "operator": "<=", "value": 200, "action": "reject"}
  ],
  "ENTITY_SCHEMA": {
    "fields": ["price", "sqft", "distance_miles", "condition"]
  }
}
```

## Limitaciones
- Reglas simples (comparaciones, no ML)
- No soporta reglas con dependencias entre si

## Origen
Production deployment
