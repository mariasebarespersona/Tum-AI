# Portfolio KPI Engine

## Categoria
Contabilidad

## Descripcion
Calcula KPIs financieros en tiempo real: collection rate (cobrado/esperado), delinquency rate (vencido/total), aging buckets (0-30, 31-60, 61-90, 90+ dias), y ranking de clientes en riesgo con monto y dias de atraso.

## Cuando Usar
- Dashboard ejecutivo de cartera/portfolio
- Monitoreo de accounts receivable
- Reportes para inversores sobre salud de la cartera

## Cuando NO Usar
- Metricas que requieren datos externos (mercado, competencia)
- KPIs de una sola vez (sin pagos recurrentes)

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `DB_CONNECTION` | secret | Conexion a BD | `"postgresql://..."` |
| `METRICS` | string[] | KPIs a calcular | `["collection_rate", "delinquency_rate", "aging"]` |

## Variables Opcionales

| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `AGING_BUCKETS` | object[] | `[0-30, 31-60, 61-90, 90+]` | Buckets personalizados |
| `TOP_AT_RISK` | number | `10` | Cuantos clientes en riesgo mostrar |

## Ejemplo de Configuracion Minima
```json
{
  "METRICS": ["collection_rate", "delinquency_rate", "aging", "at_risk_clients"],
  "TOP_AT_RISK": 10
}
```

## Limitaciones
- Calculo en tiempo real (puede ser lento con +10K pagos, considerar cache)
- No incluye proyecciones futuras

## Origen
Production deployment
