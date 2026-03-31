# Payment Reminders

## Categoria
Comunicacion

## Descripcion
Recordatorios de pago en ventanas configurables: N dias antes del vencimiento, dia del vencimiento, N dias despues. Evita enviar duplicados. Templates personalizables por tipo de recordatorio.

## Cuando Usar
- Recordatorio de renta antes de vencimiento
- Recordatorio de factura pendiente
- Recordatorio de cuota de prestamo
- Aviso de renovacion

## Cuando NO Usar
- Pagos automaticos (ya se cobran solos)
- Clientes que no quieren recordatorios

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `REMINDER_WINDOWS` | object[] | Ventanas en dias relativos | `[-3, 0, 1, 3, 7]` |
| `DB_CONNECTION` | secret | Conexion a BD | `"postgresql://..."` |

## Variables Opcionales

| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `TEMPLATES` | object | — | Templates por tipo de recordatorio |
| `DEDUP_HOURS` | number | `24` | Horas minimas entre recordatorios |

## Dependencias Externas
- `email-scheduler` — Para enviar los recordatorios

## Ejemplo de Configuracion Minima
```json
{
  "REMINDER_WINDOWS": [-3, 0, 1, 3, 7]
}
```

## Limitaciones
- Solo email por ahora (no SMS/WhatsApp)
- Requiere que los pagos tengan fecha de vencimiento

## Origen
Production deployment
