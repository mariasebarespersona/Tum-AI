# Investment Analyzer

## Categoria
Pagos & Cobros

## Descripcion
Evalua si un activo es buena inversion: calcula LTV (Loan-to-Value), ROI, meses hasta breakeven, cash flow mensual. Auto-identifica factores de riesgo (LTV>90%, ROI<15%, plazo largo). Recomienda: proceed, caution, o reject.

## Cuando Usar
- Necesitas evaluar rapidamente si vale la pena financiar/comprar un activo
- Quieres estandarizar el analisis de inversion con criterios objetivos
- Due diligence automatico antes de aprobar financiamiento

## Cuando NO Usar
- Inversiones con multiples fuentes de ingreso complejas
- Analisis que requiere due diligence legal

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `DB_CONNECTION` | secret | Conexion a BD | `"postgresql://..."` |
| `TARGET_ROI` | number | ROI objetivo (%) | `20` |
| `RISK_FACTORS` | object[] | Factores de riesgo y umbrales | `[{name: "ltv", max: 90}]` |

## Variables Opcionales

| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `MAX_TERM_MONTHS` | number | `48` | Plazo maximo permitido |

## Ejemplo de Configuracion Minima
```json
{
  "TARGET_ROI": 20,
  "RISK_FACTORS": [
    {"name": "ltv", "max": 90, "label": "LTV too high"},
    {"name": "roi", "min": 15, "label": "ROI too low"},
    {"name": "term", "max": 48, "label": "Term too long"}
  ]
}
```

## Limitaciones
- Modelo estatico (no considera variaciones de mercado futuras)
- No incluye analisis de riesgo de credito del cliente

## Origen
Production deployment
