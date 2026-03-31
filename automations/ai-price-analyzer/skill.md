# AI Price Analyzer

## Categoria
AI Agents

## Descripcion
LLM analiza datos de mercado y recomienda estrategia de precios: conservador, target, agresivo. Incluye ROI estimado, margenes, y comparacion con competencia.

## Cuando Usar
- Definir precio de venta optimo para un activo
- Evaluar margenes de diferentes estrategias
- Comparar contra competencia del mercado

## Cuando NO Usar
- Mercados sin datos comparables
- Activos unicos sin referencia de precio

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `LLM_API_KEY` | secret | OpenAI API key | `"sk-xxxx"` |
| `PRICING_RULES` | object | Reglas: margen minimo, techo, piso | `{"min_margin": 15, "max_market_pct": 80}` |

## Variables Opcionales

| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `LLM_MODEL` | string | `gpt-4o` | Modelo a usar |

## Dependencias Externas
- `openai` — SDK de OpenAI

## Ejemplo de Configuracion Minima
```json
{
  "PRICING_RULES": {
    "min_margin": 15,
    "max_market_pct": 80,
    "strategies": ["conservative", "target", "aggressive"]
  }
}
```

## Limitaciones
- Depende de datos de mercado actualizados
- Recomendacion, no precio final

## Origen
Production deployment
