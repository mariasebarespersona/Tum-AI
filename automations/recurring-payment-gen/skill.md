# Recurring Payment Generator

## Categoria
Pagos & Cobros

## Descripcion
Al activar un contrato, genera automaticamente N pagos mensuales con fecha de vencimiento, monto, y status inicial. Maneja edge cases de meses sin ese dia (ej: dia 31 en febrero → usa ultimo dia del mes). Pre-asigna status segun fecha actual.

## Cuando Usar
- Activas un contrato de cuotas/renta y necesitas el calendario de pagos completo
- Quieres generar todos los pagos de una vez al inicio
- Necesitas que cada pago tenga su registro en BD para tracking individual

## Cuando NO Usar
- Pagos con montos variables cada mes
- Contratos con pagos irregulares (no mensuales)
- Sistemas pay-as-you-go sin calendario fijo

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `DB_CONNECTION` | secret | Conexion a BD | `"postgresql://..."` |

## Variables Opcionales

| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `PAYMENT_DAY` | number | `1` | Dia del mes para cada pago |
| `INITIAL_STATUS` | string | `"scheduled"` | Status inicial de pagos futuros |

## Dependencias Externas
- Base de datos PostgreSQL

## Esquema de Base de Datos Requerido
```sql
CREATE TABLE contract_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL,
    payment_number INTEGER NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    due_date DATE NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'pending', 'paid', 'partial', 'late')),
    paid_date DATE,
    paid_amount NUMERIC(12,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Ejemplo de Configuracion Minima
```json
{
  "PAYMENT_DAY": 1,
  "INITIAL_STATUS": "scheduled"
}
```

## Limitaciones
- Solo pagos mensuales (no semanal, quincenal, trimestral)
- Monto fijo para todos los pagos (no soporta amortizacion con interes variable)
- No recalcula si se cambia el contrato despues de generar

## Origen
Production deployment
