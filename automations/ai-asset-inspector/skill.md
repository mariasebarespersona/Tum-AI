# AI Asset Inspector

## Categoria
AI Agents

## Descripcion
GPT-4o Vision analiza fotos de propiedades contra un checklist configurable (26-point checklist). Retorna score 0-100 y recomendacion (BUY/REVIEW/NO). Respeta evaluaciones manuales previas del empleado — no sobreescribe lo que el humano ya marco.

## Cuando Usar
- Necesitas evaluar activos fisicos con fotos antes de comprar
- Quieres estandarizar inspecciones con un checklist automatizado
- Quieres reducir visitas presenciales innecesarias

## Cuando NO Usar
- Evaluaciones que requieren inspeccion fisica obligatoria (ej: estructura)
- Fotos de baja calidad o insuficientes
- Decisiones regulatorias donde se requiere inspector certificado

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `LLM_API_KEY` | secret | OpenAI API key | `"sk-xxxx"` |
| `CHECKLIST_ITEMS` | object[] | Items del checklist con criterios | `[{id: "roof", name: "Techo", criteria: "Sin danos visibles"}]` |
| `SCORE_THRESHOLDS` | object | Umbrales de decision | `{buy: 80, review: 60}` |

## Variables Opcionales

| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `MAX_PHOTOS` | number | `10` | Max fotos a analizar por evaluacion |
| `RESPECT_MANUAL` | string | `"true"` | No sobreescribir evaluaciones manuales |
| `SUMMARY_MODEL` | string | `"gpt-4o-mini"` | Modelo para generar resumen ejecutivo |

## Dependencias Externas
- OpenAI API (GPT-4o Vision + GPT-4o-mini)

## Ejemplo de Configuracion Minima
```json
{
  "CHECKLIST_ITEMS": [
    {"id": "roof", "name": "Techo", "criteria": "Sin goteras, sin danos visibles"},
    {"id": "floors", "name": "Pisos", "criteria": "Sin hundimientos, sin danos mayores"},
    {"id": "kitchen", "name": "Cocina", "criteria": "Funcional, sin danos en gabinetes"}
  ],
  "SCORE_THRESHOLDS": {"buy": 80, "review": 60}
}
```

## Limitaciones
- Costo: ~$0.10-0.20 por evaluacion (10 fotos)
- No puede evaluar estructura interna (plomeria, electricidad)
- Precision depende de calidad y cobertura de fotos
- Items no fotografiados se marcan como "needs_photo"

## Origen
Production deployment
