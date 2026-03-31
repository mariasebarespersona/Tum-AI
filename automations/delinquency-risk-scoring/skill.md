# Delinquency Risk Scoring

## Categoria
Pagos & Cobros

## Descripcion
Clasifica clientes por riesgo de mora: critical (>90 dias), high (>60 dias), medium (>30 dias), low (0-30 dias). Agrega montos vencidos, calcula dias de atraso, y rankea top N clientes en riesgo por severidad.

## Cuando Usar
- Necesitas priorizar a quien cobrar primero
- Quieres un dashboard de riesgo de cartera
- Reportes de delinquency para inversores o auditoria

## Cuando NO Usar
- Cartera con pocos clientes (<10) donde no necesitas scoring
- Pagos unicos (no recurrentes)

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `DB_CONNECTION` | secret | Conexion a BD | `"postgresql://..."` |
| `RISK_THRESHOLDS` | object | Umbrales en dias | `{critical: 90, high: 60, medium: 30}` |

## Variables Opcionales

| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `TOP_N` | number | `10` | Cuantos clientes en riesgo mostrar |

## Ejemplo de Configuracion Minima
```json
{
  "RISK_THRESHOLDS": {"critical": 90, "high": 60, "medium": 30},
  "TOP_N": 10
}
```

## Limitaciones
- Solo basado en dias de atraso (no considera historial de pago o monto)
- No predice riesgo futuro, solo mide atraso actual

## Origen
Production deployment
