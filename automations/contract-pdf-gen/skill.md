# Contract PDF Generator

## Categoria
Documentos

## Descripcion
Al activar un contrato, auto-genera PDF con todos los terminos, clausulas legales, datos del cliente y propiedad. Sube el PDF a cloud storage y guarda la URL publica en la BD.

## Cuando Usar
- Necesitas generar contratos PDF automaticamente al activar/firmar
- Quieres estandarizar el formato de contratos con clausulas legales
- Necesitas que el contrato este disponible online para el cliente

## Cuando NO Usar
- Contratos que requieren firma electronica (usar DocuSign/HelloSign)
- Documentos con formato muy variable por caso

## Variables Requeridas

| Variable | Tipo | Descripcion | Ejemplo |
|----------|------|-------------|---------|
| `CONTRACT_TEMPLATE` | object | Template con clausulas | `{clauses: [...], header: "..."}` |
| `COMPANY_INFO` | object | Datos de la empresa | `{name: "...", address: "..."}` |
| `STORAGE_BUCKET` | string | Bucket para subir | `"contracts"` |

## Ejemplo de Configuracion Minima
```json
{
  "CONTRACT_TEMPLATE": {
    "title": "Contrato de Arrendamiento",
    "clauses": ["Clausula 1: ...", "Clausula 2: ..."]
  },
  "COMPANY_INFO": {"name": "Mi Empresa LLC", "address": "123 Main St"},
  "STORAGE_BUCKET": "transaction-documents"
}
```

## Limitaciones
- PDF es estatico (no editable despues de generado)
- No incluye firma electronica
- Templates hardcoded en codigo (no configurable via UI todavia)

## Origen
Production deployment
