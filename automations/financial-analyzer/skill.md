# Financial Analyzer

## Categoria
Analytics & Rules

## Descripcion
Analisis financiero configurable: LTV, ROI, breakeven, cash flow projection, risk scoring. Metricas y parametros por configuracion. Retorna dashboard de metricas con graficos.

## Cuando Usar
- Analisis de inversion antes de comprar
- Evaluacion de prestamos
- Proyeccion de cash flow
- Planificacion financiera

## Cuando NO Usar
- Analisis que requiere auditoria certificada
- Datos financieros incompletos o no confiables

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `DB_CONNECTION` | secret | Conexion a BD | `"postgresql://..."` |
| `METRICS` | string[] | Metricas a calcular | `["ltv", "roi", "breakeven"]` |
| `ANALYSIS_PARAMS` | object | Parametros del analisis | Ver ejemplo |

## Dependencias Externas
- Ninguna externa (calculo puro)

## Ejemplo de Configuracion Minima
```json
{
  "METRICS": ["ltv", "roi", "breakeven", "cash_flow"],
  "ANALYSIS_PARAMS": {
    "discount_rate": 0.08,
    "projection_months": 36,
    "include_expenses": true
  }
}
```

## Limitaciones
- Proyecciones son estimaciones, no garantias
- No considera factores macroeconomicos

## Origen
Production deployment
