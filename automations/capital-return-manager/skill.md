# Capital Return Manager

## Categoria
Pagos & Cobros

## Descripcion
Al pagar retorno a un inversor: actualiza monto retornado, cambia status de la inversion (partial_return si parcial, returned si completo), registra flujo de capital, y crea transaccion contable para audit trail.

## Cuando Usar
- Gestionas inversiones con retornos periodicos o al vencimiento
- Necesitas tracking de cuanto se ha devuelto a cada inversor
- Quieres audit trail contable de cada retorno

## Cuando NO Usar
- Inversiones sin retorno (donaciones, equity puro)
- Retornos que no requieren registro contable

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `DB_CONNECTION` | secret | Conexion a BD | `"postgresql://..."` |
| `RETURN_STATUSES` | object | Mapeo de estados segun % retornado | `{partial: "<100%", complete: "100%"}` |

## Ejemplo de Configuracion Minima
```json
{
  "RETURN_STATUSES": {
    "partial_return": "amount_returned < total_invested",
    "returned": "amount_returned >= total_invested"
  }
}
```

## Limitaciones
- No calcula interes/rendimiento — solo registra montos devueltos
- Status es binario (parcial/completo), no hay estados intermedios

## Origen
Production deployment
