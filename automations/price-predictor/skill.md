# Price Predictor

## Categoria
Analytics & Rules

## Descripcion
Prediccion de precios basada en datos historicos. Segmenta por tipo/categoria del activo. Retorna min/max/avg por segmento con intervalos de confianza.

## Cuando Usar
- Predecir precio de venta de un activo
- Forecast de revenue por segmento
- Estimacion de costos futuros
- Market analysis por categoria

## Cuando NO Usar
- Mercados nuevos sin historico
- Activos unicos sin comparables
- Cuando se necesita prediccion con ML avanzado

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `HISTORICAL_DATA` | string | Fuente de datos historicos | `"sales_history"` |
| `SEGMENTS` | string[] | Campos para segmentar | `["type", "size", "location"]` |
| `TARGET_FIELD` | string | Campo a predecir | `"sale_price"` |

## Dependencias Externas
- Ninguna (calculo estadistico puro)

## Ejemplo de Configuracion Minima
```json
{
  "HISTORICAL_DATA": "sales_history",
  "SEGMENTS": ["type", "size"],
  "TARGET_FIELD": "sale_price"
}
```

## Limitaciones
- Requiere minimo 30 registros por segmento
- Prediccion basica (media, mediana, percentiles — no ML)
- No considera tendencias temporales

## Origen
Production deployment
