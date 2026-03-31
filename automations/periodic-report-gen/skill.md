# Periodic Report Generator

## Categoria
Contabilidad

## Descripcion
Auto-genera reportes financieros mensuales en PDF. Agrega metricas del periodo, formatea tablas y secciones, genera PDF con ReportLab, sube a cloud storage, y guarda metadata en BD para acceso futuro.

## Cuando Usar
- Reportes mensuales/trimestrales para inversores o directivos
- Necesitas PDFs profesionales con datos actualizados
- Quieres automatizar la generacion en vez de hacerlo manual en Excel

## Cuando NO Usar
- Reportes ad-hoc con formato variable cada vez
- Datos que requieren analisis manual antes de reportar

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `DB_CONNECTION` | secret | Conexion a BD | `"postgresql://..."` |
| `REPORT_SECTIONS` | string[] | Secciones del reporte | `["summary", "collections", "delinquency"]` |
| `STORAGE_BUCKET` | string | Bucket para subir PDFs | `"reports"` |
| `COMPANY_INFO` | object | Nombre y logo | `{name: "Mi Empresa"}` |

## Ejemplo de Configuracion Minima
```json
{
  "REPORT_SECTIONS": ["summary", "collections", "delinquency", "aging"],
  "STORAGE_BUCKET": "financial-reports",
  "COMPANY_INFO": {"name": "Mi Empresa LLC", "logo_url": "..."}
}
```

## Limitaciones
- Formato fijo (no configurable sin cambiar codigo)
- Solo PDF (no Excel/CSV por ahora)

## Origen
Production deployment
