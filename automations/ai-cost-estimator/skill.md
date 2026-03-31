# AI Cost Estimator

## Categoria
AI Agents

## Descripcion
LLM analiza condiciones/descripcion de un proyecto y estima costos desglosados: materiales, mano de obra, contingencias. Retorna presupuesto estructurado con rangos min/max por categoria.

## Cuando Usar
- Presupuesto rapido de obra o reparacion
- Cotizacion de servicios basada en descripcion
- Estimacion antes de enviar tecnico
- Presupuestos estandarizados por categoria

## Cuando NO Usar
- Cuando se requiere presupuesto exacto firmado
- Proyectos que requieren inspeccion fisica obligatoria

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `LLM_API_KEY` | secret | OpenAI API key | `"sk-xxxx"` |
| `COST_CATEGORIES` | object[] | Categorias con rangos de costo | `[{"name": "materiales", "min": 500, "max": 5000}]` |

## Variables Opcionales

| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `LLM_MODEL` | string | `gpt-4o` | Modelo a usar |
| `CONTINGENCY_PERCENT` | number | `10` | % de contingencia |

## Dependencias Externas
- `openai` — SDK de OpenAI para llamadas al LLM

## Ejemplo de Configuracion Minima
```json
{
  "COST_CATEGORIES": [
    {"name": "Materiales", "min": 500, "max": 5000},
    {"name": "Mano de obra", "min": 300, "max": 3000},
    {"name": "Contingencias", "min": 100, "max": 500}
  ]
}
```

## Limitaciones
- Es estimado, no presupuesto final
- Precision depende de la calidad de la descripcion
- Costo: ~$0.05 por estimacion

## Origen
Production deployment
