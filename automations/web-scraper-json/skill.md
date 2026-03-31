# JSON API Scraper

## Categoría
Data Collection

## Descripción
Scraper configurable para APIs JSON públicas. Soporta filtros dinámicos, paginación, transformación de datos, y upsert a base de datos con detección de duplicados.

## Cuándo Usar
- Necesitas extraer datos periódicamente de APIs JSON públicas
- Monitoreo de competencia (precios, inventario, listings)
- Agregación de datos de múltiples fuentes en un solo lugar
- ETL ligero: extraer → transformar → cargar

## Cuándo NO Usar
- APIs que requieren autenticación OAuth compleja (usar web-scraper-browser)
- Sitios sin API que requieren renderizar JavaScript
- Scraping a gran escala (1M+ registros) — usar Scrapy o similar

## Variables Requeridas

| Variable | Tipo | Descripción | Ejemplo |
|----------|------|-------------|---------|
| `SOURCES` | object[] | Lista de APIs a scrapear | Ver ejemplo |
| `DB_CONNECTION` | secret | Conexión a BD para almacenar | `"postgresql://..."` |
| `DB_TABLE` | string | Tabla destino | `"market_listings"` |
| `UNIQUE_KEY` | string | Campo para detectar duplicados | `"source_url"` |
| `SCHEDULE_CRON` | string | Frecuencia de ejecución | `"0 */6 * * *"` |

## Ejemplo de SOURCES
```json
[
  {
    "name": "vmf-homes",
    "url": "https://api.example.com/listings",
    "method": "GET",
    "headers": {},
    "params": {
      "state": "TX",
      "min_price": 5000,
      "max_price": 80000
    },
    "response_path": "data.listings",
    "field_mapping": {
      "title": "$.listingTitle",
      "price": "$.askingPrice",
      "url": "$.detailUrl",
      "address": "$.address.full"
    },
    "max_results": 150
  }
]
```

## Dependencias Externas
- HTTP client (httpx/aiohttp)
- PostgreSQL para almacenamiento

## Limitaciones
- Solo APIs JSON (no XML, no HTML)
- No maneja rate limiting automático (implementar si needed)
- field_mapping usa JSONPath simple, no expresiones complejas

## Origen
Production deployment
