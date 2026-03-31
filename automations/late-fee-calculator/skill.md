# Late Fee Calculator

## Categoria
Pagos & Cobros

## Descripcion
Calcula mora automaticamente al registrar un pago tardio. Grace period configurable. Formula: `late_fee = max(0, (dias_atraso - grace_period)) * fee_per_day`. Crea transaccion separada para la mora. Determina status del pago: paid, partial, o late.

## Cuando Usar
- Cobras mora por pagos tardios (renta, cuotas, facturas)
- Quieres calcular mora automaticamente sin intervencion manual
- Necesitas registro separado de la mora para contabilidad

## Cuando NO Usar
- Moras con formula compuesta (interes sobre interes)
- Mora fija independiente de dias de atraso
- Sistemas donde la mora se negocia caso por caso

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `GRACE_PERIOD_DAYS` | number | Dias de gracia antes de cobrar | `5` |
| `FEE_PER_DAY` | number | Cargo diario en USD | `5` |
| `DB_CONNECTION` | secret | Conexion a BD | `"postgresql://..."` |

## Variables Opcionales

| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `MAX_FEE` | number | `null` | Tope maximo de mora |
| `CREATE_TRANSACTION` | string | `"true"` | Crear transaccion separada para la mora |
| `CURRENCY` | string | `"USD"` | Moneda |

## Dependencias Externas
- Base de datos PostgreSQL

## Ejemplo de Configuracion Minima
```json
{
  "GRACE_PERIOD_DAYS": 5,
  "FEE_PER_DAY": 5,
  "MAX_FEE": 500
}
```

## Limitaciones
- Solo mora lineal (fee × dias). No soporta interes compuesto
- No envia notificacion de mora automaticamente (usar overdue-alerts para eso)
- Requiere que la fecha de pago y fecha de vencimiento esten correctas

## Origen
Production deployment
