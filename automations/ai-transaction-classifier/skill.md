# AI Transaction Classifier

## Categoria
AI Agents

## Descripcion
GPT-4o clasifica automaticamente movimientos bancarios a cuentas contables. Analiza descripcion, monto, y contraparte para sugerir la cuenta correcta. Respeta reglas estrictas: depositos→cuentas de ingreso, retiros→cuentas de gasto. Aprende de correcciones previas del usuario.

## Cuando Usar
- Tienes movimientos bancarios que necesitan cuenta contable asignada
- Quieres reducir el trabajo manual de clasificacion contable
- Tienes un plan de cuentas definido y quieres consistencia

## Cuando NO Usar
- Movimientos que requieren logica de negocio compleja (ej: split entre cuentas)
- Empresas sin plan de cuentas definido
- Cuando se requiere 100% de precision sin revision humana

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `LLM_API_KEY` | secret | OpenAI API key | `"sk-xxxx"` |
| `CHART_OF_ACCOUNTS` | object[] | Plan de cuentas con codigo y nombre | `[{code: "ING-001", name: "Ventas"}]` |
| `CLASSIFICATION_RULES` | object | Reglas: deposito=ingreso, retiro=gasto, cuentas excluidas | Ver ejemplo |

## Variables Opcionales

| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `LLM_MODEL` | string | `"gpt-4o"` | Modelo a usar |
| `CORRECTIONS_TABLE` | string | `null` | Tabla con correcciones previas para mejorar precision |
| `BATCH_SIZE` | number | `20` | Movimientos por lote |

## Dependencias Externas
- OpenAI API (GPT-4o)
- Base de datos con plan de cuentas

## Esquema de Base de Datos Requerido
```sql
CREATE TABLE chart_of_accounts (
    id UUID PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense', 'asset', 'liability', 'equity')),
    parent_id UUID REFERENCES chart_of_accounts(id)
);

CREATE TABLE classification_corrections (
    id UUID PRIMARY KEY,
    movement_description TEXT NOT NULL,
    suggested_account TEXT,
    corrected_account TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Ejemplo de Configuracion Minima
```json
{
  "LLM_MODEL": "gpt-4o",
  "CLASSIFICATION_RULES": {
    "deposit_accounts": "income",
    "withdrawal_accounts": "expense",
    "excluded_accounts": ["balance_sheet"],
    "prefer_custom_codes": true
  },
  "BATCH_SIZE": 20
}
```

## Limitaciones
- Costo: ~$0.02-0.05 por lote de 20 movimientos
- No clasifica a cuentas de balance (activo/pasivo/patrimonio) — solo ingreso/gasto
- Requiere revision humana para movimientos ambiguos
- Precision mejora con correcciones previas (~85% sin correcciones, ~95% con)

## Origen
Production deployment
