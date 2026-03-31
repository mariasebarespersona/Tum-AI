# Transaction Ledger Sync

## Categoria
Contabilidad

## Descripcion
Al registrar un flujo de capital (inversion, desembolso, ingreso, retorno), auto-crea la transaccion contable correspondiente con el tipo correcto (ingreso/gasto) y vincula al flujo para audit trail. Actualiza balance running despues de cada flujo.

## Cuando Usar
- Gestionas flujos de capital (inversiones, desembolsos, retornos)
- Necesitas que cada movimiento de capital tenga su contraparte contable
- Quieres audit trail completo entre flujos y contabilidad

## Cuando NO Usar
- Flujos sin impacto contable
- Contabilidad que se lleva en sistema externo (QuickBooks, Xero)

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `DB_CONNECTION` | secret | Conexion a BD | `"postgresql://..."` |
| `FLOW_TYPE_MAPPING` | object | Mapeo de tipo de flujo a tipo contable | Ver ejemplo |
| `ACCOUNTS` | object | Cuentas contables por tipo | `{investment: "ING-001"}` |

## Ejemplo de Configuracion Minima
```json
{
  "FLOW_TYPE_MAPPING": {
    "investment_in": {"type": "income", "account": "ING-INV"},
    "acquisition_out": {"type": "expense", "account": "GAS-ADQ"},
    "rent_income": {"type": "income", "account": "ING-REN"},
    "return_out": {"type": "expense", "account": "GAS-RET"}
  }
}
```

## Limitaciones
- Mapeo es 1:1 (un flujo = una transaccion). No soporta asientos compuestos
- No genera reportes — solo registra transacciones

## Origen
Production deployment
