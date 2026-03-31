# AI Quote Builder

## Categoria
Documentos

## Descripcion
GPT-4o Vision analiza fotos de propiedad y sugiere cuales de los items estandar de renovacion/reparacion son necesarios. Estima precio por item basado en severidad del dano visible. Sesgo conservador: solo sugiere lo que es CLARAMENTE visible en las fotos.

## Cuando Usar
- Necesitas cotizar renovaciones/reparaciones rapidamente con fotos
- Quieres un primer estimado antes de enviar al tecnico
- Estandarizar la cotizacion con un catalogo de items fijo

## Cuando NO Usar
- Reparaciones que no son visibles en fotos (plomeria interna, electricidad)
- Cuando se requiere presupuesto exacto (esto es estimado)

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `LLM_API_KEY` | secret | OpenAI API key | `"sk-xxxx"` |
| `STANDARD_ITEMS` | object[] | Catalogo de items con precio referencia | Ver ejemplo |

## Variables Opcionales

| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `MAX_PHOTOS` | number | `8` | Max fotos a analizar |
| `BIAS` | string | `"conservative"` | Sesgo: conservative o aggressive |

## Ejemplo de Configuracion Minima
```json
{
  "STANDARD_ITEMS": [
    {"name": "Pintura interior", "min": 800, "max": 2000},
    {"name": "Pisos", "min": 1500, "max": 4000},
    {"name": "Cocina", "min": 2000, "max": 5000},
    {"name": "Bano", "min": 1000, "max": 3000},
    {"name": "Techo", "min": 500, "max": 2000}
  ]
}
```

## Limitaciones
- Es estimado, no presupuesto final
- Precision: ~70-80% de items identificados correctamente
- Costo: ~$0.10 por cotizacion (8 fotos)

## Origen
Production deployment
