# AI Voice Processor

## Categoria
AI Agents

## Descripcion
Whisper transcribe audio + LLM extrae datos estructurados: intenciones, entidades, cantidades. Ideal para trabajo de campo hands-free donde el usuario dicta notas o comandos.

## Cuando Usar
- Notas de campo por voz (inspecciones, visitas)
- Dictado de reportes
- Comandos hands-free en operaciones
- Servicio al cliente por voz

## Cuando NO Usar
- Audio con mucho ruido de fondo
- Idiomas no soportados por Whisper
- Transcripcion legal que requiere precision 100%

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `LLM_API_KEY` | secret | OpenAI API key | `"sk-xxxx"` |
| `INTENTS` | string[] | Intenciones a detectar | `["add_item", "note", "command"]` |

## Variables Opcionales

| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `LANGUAGE` | string | `es` | Idioma principal |
| `MAX_DURATION_SEC` | number | `120` | Duracion maxima de audio |

## Dependencias Externas
- `openai` — SDK de OpenAI (Whisper + LLM)

## Ejemplo de Configuracion Minima
```json
{
  "INTENTS": ["add_item", "note", "update_status", "command"],
  "LANGUAGE": "es"
}
```

## Limitaciones
- Whisper tiene latencia de 2-5 segundos
- Precision: ~90% en ambientes silenciosos
- Costo: ~$0.006/minuto (Whisper) + ~$0.03 (LLM)

## Origen
Production deployment
