# Browser Automation

## Categoria
Data Collection

## Descripcion
Playwright para sitios que requieren JS, login, o interaccion. Secuencia configurable de acciones: click, type, wait, extract. Headless por defecto.

## Cuando Usar
- Consultar registros publicos que requieren login
- Monitoreo de precios en sitios con JS
- Llenado automatico de formularios
- Scraping de sitios sin API

## Cuando NO Usar
- Sitios con API disponible (usar web-scraper-json)
- Sitios con proteccion anti-bot fuerte
- Actividades que violen ToS del sitio

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `TARGET_URL` | string | URL del sitio | `"https://..."` |
| `ACTIONS` | object[] | Secuencia de acciones | Ver ejemplo |

## Variables Opcionales

| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `SCHEDULE_CRON` | string | — | Si es periodico |
| `HEADLESS` | boolean | `true` | Modo headless |
| `TIMEOUT_MS` | number | `30000` | Timeout por accion |

## Dependencias Externas
- `playwright` — Browser automation framework

## Ejemplo de Configuracion Minima
```json
{
  "TARGET_URL": "https://records.example.com",
  "ACTIONS": [
    {"type": "goto", "url": "https://records.example.com/search"},
    {"type": "type", "selector": "#address", "text": "123 Main St"},
    {"type": "click", "selector": "#search-btn"},
    {"type": "wait", "selector": ".results"},
    {"type": "extract", "selector": ".results", "fields": ["owner", "value", "tax"]}
  ]
}
```

## Limitaciones
- Fragil: cambios en la UI del sitio rompen el script
- Lento comparado con API scraping (~5-10s por pagina)
- Requiere mantenimiento periodico

## Origen
Production deployment
