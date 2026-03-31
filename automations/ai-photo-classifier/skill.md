# AI Photo Classifier

## Categoria
AI Agents

## Descripcion
GPT-4 Vision clasifica imagenes en categorias configurables. Detecta calidad, features, y sugiere ordenamiento. Util para catalogar inventario visual automaticamente.

## Cuando Usar
- Clasificar fotos de activos por tipo (exterior, interior, dano)
- QA de imagenes (calidad, nitidez)
- Verificar estado de un activo antes/despues
- Catalogar inventario visual

## Cuando NO Usar
- Imagenes que requieren clasificacion con precision medica/legal
- Clasificaciones con mas de 20 categorias (pierde precision)

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `LLM_API_KEY` | secret | OpenAI API key | `"sk-xxxx"` |
| `CATEGORIES` | string[] | Categorias de clasificacion | `["exterior", "interior", "damage"]` |

## Variables Opcionales

| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `QUALITY_THRESHOLD` | number | `70` | Umbral de calidad (0-100) |
| `MAX_PHOTOS` | number | `20` | Max fotos por lote |

## Dependencias Externas
- `openai` — SDK de OpenAI (Vision API)

## Ejemplo de Configuracion Minima
```json
{
  "CATEGORIES": ["exterior", "interior", "damage", "repaired", "document"]
}
```

## Limitaciones
- Precision: ~85% con categorias claras
- Costo: ~$0.03 por foto
- No detecta bien categorias ambiguas

## Origen
Production deployment
