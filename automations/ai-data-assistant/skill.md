# AI Data Q&A

## Categoría
AI Agents

## Descripción
Asistente de IA que responde preguntas sobre datos del negocio usando LLM + function calling. El usuario pregunta en lenguaje natural, el LLM decide qué queries ejecutar contra la base de datos, y formula una respuesta con datos REALES (sin alucinaciones).

## Cuándo Usar
- Los usuarios necesitan consultar datos del negocio sin saber SQL
- Quieres un chatbot interno que responda con datos reales, no inventados
- Necesitas un BI conversacional (Business Intelligence por chat)

## Cuándo NO Usar
- Datos altamente sensibles sin control de acceso por rol
- Queries que requieren JOINs de 5+ tablas (mejor usar dashboards)
- Análisis estadístico avanzado (mejor usar Python/R notebooks)

## Variables Requeridas

| Variable | Tipo | Descripción | Ejemplo |
|----------|------|-------------|---------|
| `LLM_PROVIDER` | string | Proveedor LLM | `"openai"` |
| `LLM_API_KEY` | secret | API key | `"sk-xxxx"` |
| `LLM_MODEL` | string | Modelo a usar | `"gpt-4o"` |
| `DB_CONNECTION` | secret | Conexión a BD | `"postgresql://..."` |
| `TOOLS_SCHEMA` | object[] | Definición de queries disponibles | Ver ejemplo abajo |
| `SYSTEM_PROMPT` | string | Contexto del negocio para el LLM | `"Eres asistente de..."` |

## Variables Opcionales

| Variable | Tipo | Default | Descripción |
|----------|------|---------|-------------|
| `MAX_TOOL_CALLS` | number | `5` | Máximo de queries por pregunta |
| `TEMPERATURE` | number | `0.1` | Creatividad del LLM (bajo = más preciso) |
| `MAX_TOKENS` | number | `2000` | Longitud máxima de respuesta |
| `LANGUAGE` | string | `"es"` | Idioma de respuestas |

## Ejemplo de TOOLS_SCHEMA
```json
[
  {
    "name": "query_sales",
    "description": "Consulta ventas por periodo, tipo, o estado",
    "parameters": {
      "type": "object",
      "properties": {
        "date_from": { "type": "string", "format": "date" },
        "date_to": { "type": "string", "format": "date" },
        "status": { "type": "string", "enum": ["pending", "paid", "completed"] }
      }
    },
    "query_template": "SELECT * FROM sales WHERE created_at >= {{date_from}} AND status = {{status}}"
  }
]
```

## Dependencias Externas
- OpenAI API (o Anthropic, Groq, etc.)
- PostgreSQL (o cualquier BD SQL)

## Limitaciones
- Cada pregunta consume tokens de LLM ($0.01-$0.05 por pregunta aprox)
- No cachea respuestas — cada pregunta ejecuta queries nuevas
- Requiere definir TOOLS_SCHEMA manualmente (por ahora)

## Origen
Production deployment
