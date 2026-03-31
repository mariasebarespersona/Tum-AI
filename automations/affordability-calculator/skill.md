# Affordability Calculator

## Categoria
Pagos & Cobros

## Descripcion
Calcula Debt-to-Income ratio automaticamente. Formula: DTI = (total_deudas / total_ingresos) × 100. Auto-aprueba si DTI <= umbral (default 43%). Retorna desglose completo de ingresos y deudas.

## Cuando Usar
- Necesitas evaluar capacidad de pago de un cliente antes de aprobar credito/renta
- Quieres estandarizar la calificacion financiera
- Proceso de onboarding de clientes con evaluacion automatica

## Cuando NO Usar
- Evaluaciones que requieren verificacion de documentos (usar KYC para eso)
- Clientes sin ingresos verificables

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `DB_CONNECTION` | secret | Conexion a BD | `"postgresql://..."` |
| `MAX_DTI` | number | DTI maximo permitido (%) | `43` |
| `INCOME_FIELDS` | string[] | Campos de ingreso | `["monthly_income", "other_income"]` |
| `DEBT_FIELDS` | string[] | Campos de deuda | `["monthly_debts", "proposed_payment"]` |

## Ejemplo de Configuracion Minima
```json
{
  "MAX_DTI": 43,
  "INCOME_FIELDS": ["monthly_income", "other_income"],
  "DEBT_FIELDS": ["monthly_debts", "proposed_payment"]
}
```

## Limitaciones
- No verifica veracidad de ingresos declarados
- DTI es un indicador simplificado — no reemplaza analisis crediticio completo

## Origen
Production deployment
