# Document Auto-Gen & Storage

## Categoria
Documentos

## Descripcion
Auto-genera documentos en eventos del negocio y los sube a cloud storage con metadata. Detecta duplicados. Configurable por tipo de evento y template de documento.

## Cuando Usar
- Generar contrato automaticamente al cerrar venta
- Crear factura al recibir pago
- Generar reporte mensual automaticamente
- Almacenar documentos con metadata buscable

## Cuando NO Usar
- Documentos que requieren aprobacion manual antes de generar
- Almacenamiento de archivos muy grandes (>50MB)

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `STORAGE_PROVIDER` | string | Proveedor de storage | `"supabase"` |
| `STORAGE_BUCKET` | string | Nombre del bucket | `"documents"` |
| `TRIGGERS` | object[] | Eventos que disparan generacion | Ver ejemplo |

## Variables Opcionales

| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `DEDUP_CHECK` | boolean | `true` | Verificar duplicados |
| `RETENTION_DAYS` | number | `365` | Dias de retencion |

## Dependencias Externas
- `pdf-generator` — Para generar los documentos PDF
- Cloud storage (S3, GCS, Supabase Storage) — Cloud storage

## Ejemplo de Configuracion Minima
```json
{
  "STORAGE_PROVIDER": "supabase",
  "STORAGE_BUCKET": "documents",
  "TRIGGERS": [
    {"event": "contract_activated", "template": "contract", "folder": "contracts/"},
    {"event": "payment_received", "template": "receipt", "folder": "receipts/"}
  ]
}
```

## Limitaciones
- Depende de pdf-generator para la generacion
- Cloud storage requerido (no local)

## Origen
Production deployment
