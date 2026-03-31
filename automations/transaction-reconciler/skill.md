# Transaction Reconciler

## Categoria
Contabilidad

## Descripcion
Matching automatico de movimientos bancarios contra transacciones contables sin conciliar. Algoritmo de scoring: monto exacto (50pts), dentro de 1% (35pts), dentro de 5% (15pts), mas direccion, proximidad de fecha, y similitud de nombre. Retorna confianza: high (80+), medium (60-79), low (50-59).

## Cuando Usar
- Tienes movimientos bancarios importados que necesitan conciliar contra transacciones
- Quieres reducir el matching manual mes a mes
- Necesitas un primer pase automatico antes de revision humana

## Cuando NO Usar
- Movimientos que no tienen contraparte en el sistema (nuevos, sin registrar)
- Reconciliaciones complejas con splits o pagos parciales multiples
- Cuando se requiere matching 1:N (un movimiento contra varias transacciones)

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `DB_CONNECTION` | secret | Conexion a BD contable | `"postgresql://..."` |
| `MATCH_THRESHOLDS` | object | Umbrales de confianza | `{high: 80, medium: 60, low: 50}` |

## Variables Opcionales

| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `AMOUNT_TOLERANCE` | number | `5` | Tolerancia de monto (%) |
| `DATE_WINDOW_DAYS` | number | `7` | Ventana de dias para matching |
| `MIN_SCORE` | number | `50` | Score minimo para considerar match |

## Dependencias Externas
- Base de datos PostgreSQL

## Esquema de Base de Datos Requerido
```sql
-- Movimientos bancarios importados
CREATE TABLE bank_statement_movements (
    id UUID PRIMARY KEY,
    statement_id UUID NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    amount NUMERIC(12,2) NOT NULL,
    counterparty TEXT,
    reconciled BOOLEAN DEFAULT false,
    matched_transaction_id UUID
);

-- Transacciones contables
CREATE TABLE accounting_transactions (
    id UUID PRIMARY KEY,
    date DATE NOT NULL,
    description TEXT,
    amount NUMERIC(12,2) NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')),
    reconciled BOOLEAN DEFAULT false
);
```

## Ejemplo de Configuracion Minima
```json
{
  "MATCH_THRESHOLDS": {"high": 80, "medium": 60, "low": 50},
  "AMOUNT_TOLERANCE": 5,
  "DATE_WINDOW_DAYS": 7
}
```

## Limitaciones
- Solo matching 1:1 (un movimiento = una transaccion)
- No detecta pagos parciales automaticamente
- Requiere que ambos lados (banco y contabilidad) esten cargados

## Origen
Production deployment
