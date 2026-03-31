# Market Price Advisor

## Categoria
Contabilidad

## Descripcion
Calcula precio de venta recomendado usando multiples fuentes: (1) datos historicos de ventas propias, (2) datos de web scraping del mercado. Aplica regla de techo configurable (ej: max 80% del valor de mercado). Retorna desglose con margen y ROI.

## Cuando Usar
- Necesitas recomendar precio de venta basado en datos reales
- Quieres asegurar que no vendes por encima del mercado
- Pricing automatizado para inventario grande

## Cuando NO Usar
- Propiedades unicas sin comparables
- Mercados sin datos historicos suficientes

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `DB_CONNECTION` | secret | Conexion a BD | `"postgresql://..."` |
| `MAX_MARKET_PERCENT` | number | Techo como % del mercado | `80` |
| `MARKET_SOURCES` | string[] | Fuentes de datos | `["historical_sales", "web_scraping"]` |

## Ejemplo de Configuracion Minima
```json
{
  "MAX_MARKET_PERCENT": 80,
  "MARKET_SOURCES": ["historical_sales", "web_scraping"]
}
```

## Limitaciones
- Depende de que haya datos historicos suficientes
- No considera factores subjetivos (ubicacion exacta, vecindario)

## Origen
Production deployment
