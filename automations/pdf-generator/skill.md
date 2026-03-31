# PDF Generator

## Categoria
Documentos

## Descripcion
Genera PDFs con templates parametrizados. Soporta tablas, imagenes, firmas, multiples paginas. Branding configurable (logo, colores, tipografia). Base para contratos, facturas, reportes.

## Cuando Usar
- Generar contratos con datos dinamicos
- Crear facturas/recibos
- Reportes con tablas y graficos
- Certificados y constancias

## Cuando NO Usar
- Documentos editables (usar DOCX)
- Documentos que cambian frecuentemente de formato

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `TEMPLATES` | object[] | Templates con campos dinamicos | Ver ejemplo |
| `COMPANY_INFO` | object | Nombre, logo, direccion | `{"name": "Mi Empresa", "logo_url": "..."}` |

## Dependencias Externas
- `reportlab` — Libreria Python para generacion de PDF

## Ejemplo de Configuracion Minima
```json
{
  "TEMPLATES": [
    {"id": "invoice", "sections": ["header", "items_table", "total", "footer"]},
    {"id": "contract", "sections": ["header", "parties", "terms", "signatures"]}
  ],
  "COMPANY_INFO": {
    "name": "Mi Empresa LLC",
    "logo_url": "https://...",
    "address": "123 Main St"
  }
}
```

## Limitaciones
- Formato fijo por template (no WYSIWYG)
- Solo PDF (no Excel/Word)
- Templates requieren cambio de codigo para modificar layout

## Origen
Production deployment
