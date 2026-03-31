# Screenshot Data Extractor

## Categoria
Data Collection

## Descripcion
GPT-4 Vision extrae datos estructurados de screenshots o paginas web. Retorna JSON segun schema definido. Puede tomar screenshot de URL automaticamente con Playwright.

## Cuando Usar
- Parsear clasificados online
- Digitalizar formularios en papel/imagen
- Extraer datos de facturas escaneadas
- OCR inteligente con estructura

## Cuando NO Usar
- Documentos con formato estandar (usar parsers dedicados)
- Volumenes altos (>100/dia, costo se acumula)

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `LLM_API_KEY` | secret | OpenAI API key | `"sk-xxxx"` |
| `OUTPUT_SCHEMA` | object | Schema de datos a extraer | Ver ejemplo |

## Variables Opcionales

| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `EXTRACTION_PROMPT` | string | — | Prompt personalizado para la extraccion |

## Dependencias Externas
- `openai` — SDK de OpenAI (Vision API)
- `playwright` — Para screenshots automaticos de URLs

## Ejemplo de Configuracion Minima
```json
{
  "OUTPUT_SCHEMA": {
    "fields": [
      {"name": "price", "type": "number"},
      {"name": "address", "type": "string"},
      {"name": "bedrooms", "type": "number"},
      {"name": "sqft", "type": "number"}
    ]
  }
}
```

## Limitaciones
- Precision: ~85-90% dependiendo de calidad de imagen
- Costo: ~$0.10 por screenshot
- Requiere imagenes legibles

## Origen
Production deployment
