# Operación de la web

Última actualización: 22 de septiembre de 2026.

Este documento cubre solamente la web. Para correo y reenvíos, consultar [CORREO.md](CORREO.md).

## Arquitectura actual

```text
NIC Chile
  └─ delega DNS a Cloudflare
       ├─ congeladosromasil.cl → Vercel
       └─ www.congeladosromasil.cl → Vercel

GitHub / rama main
  ├─ despliegue automático → Netlify
  └─ despliegue automático → Vercel
```

La fuente de verdad para el código es GitHub. Netlify y Vercel son alojamientos; no se deben editar archivos directamente en sus paneles como sustituto de un cambio en el repositorio.

## Servicios y responsabilidades

### NIC Chile

- Registra y renueva el dominio `congeladosromasil.cl`.
- Delega la administración DNS a Cloudflare.
- Nameservers observados:
  - `conrad.ns.cloudflare.com`
  - `haley.ns.cloudflare.com`
- Cambiar nameservers afecta tanto la web como el correo. No hacerlo sin revisar también [CORREO.md](CORREO.md).

### Cloudflare DNS

Cloudflare administra los registros DNS del dominio.

Registros web observados:

| Nombre | Tipo | Destino | Uso |
|---|---|---|---|
| `@` | A | `216.198.79.1` | Dominio principal hacia Vercel |
| `www` | CNAME | `2f46a3d27ba09ead.vercel-dns-017.com` | Subdominio `www` hacia Vercel |

Los registros de correo también viven en Cloudflare, pero se documentan por separado.

### GitHub

- Repositorio: <https://github.com/lbarrosoficina/Congelados-Romasil>
- Rama principal: `main`
- El sitio publicado está dentro de `dist/`.
- `netlify.toml` indica que Netlify debe publicar `dist/`.
- `.openai/hosting.json` también señala `dist/` como directorio estático.

### Netlify

- URL pública: <https://congelados-romasil.netlify.app/>
- Directorio publicado: `dist/`
- Sitio localmente vinculado con el identificador `979e1d08-16a7-42ba-81b8-6b147527d564`.
- Los cambios en `main` deben generar un nuevo despliegue automáticamente.

### Vercel

- Proyecto importado desde el mismo repositorio de GitHub.
- Nombre usado al importarlo: `congelados-romasil`.
- Los registros del dominio principal y `www` apuntan actualmente a Vercel.
- Los cambios en `main` deben generar un nuevo despliegue automáticamente.
- Confirmar en el panel de Vercel la URL terminada en `.vercel.app` antes de documentarla como URL pública estable.

## Flujo de trabajo por lotes

1. Trabajar localmente en `dist/` y archivos de configuración.
2. Revisar visualmente y probar el cambio local.
3. Acumular solicitudes adicionales sin publicar cada una por separado.
4. Antes de publicar, ejecutar `git status` y resumir todos los archivos modificados.
5. Esperar autorización expresa del usuario.
6. Crear un único commit coherente y subirlo a `main`.
7. Verificar el despliegue de Netlify y Vercel.
8. Probar la portada, Productos, Cómo comprar, Confianza, Privacidad y el checkout.

## Lista de comprobación después de publicar

- La portada carga sin errores.
- La navegación es igual en todas las páginas.
- Las imágenes cargan en escritorio y móvil.
- El mapa muestra Providencia, Ñuñoa y Las Condes.
- El catálogo y sus filtros funcionan.
- El carrito conserva y elimina productos correctamente.
- El formulario solicita nombre, teléfono, correo, dirección y comuna.
- La solicitud llega por correo y después se abre WhatsApp con el resumen.
- Netlify y Vercel muestran la misma versión.
- No se publicaron secretos ni claves API.

## Estado y asuntos pendientes

- El formulario es independiente del alojamiento: usa FormSubmit y después abre WhatsApp.
- Los metadatos SEO, enlaces canónicos y el sitemap todavía usan la URL de Netlify. Cuando `congeladosromasil.cl` se defina como dominio canónico definitivo, deben migrarse en un solo lote.
- Antes de modificar DNS, revisar el impacto sobre web y correo.

## Diagnóstico rápido

| Problema | Revisar primero |
|---|---|
| GitHub tiene cambios pero la web no | Estado del despliegue en Netlify y Vercel; rama publicada `main` |
| Netlify y Vercel muestran versiones distintas | Último commit desplegado en cada plataforma y caché del navegador |
| El dominio no abre | Registros `@` y `www`, asignación del dominio en Vercel y certificado TLS |
| El formulario no envía | Consola del navegador, disponibilidad de FormSubmit y activación del destinatario |
| WhatsApp no abre | Número configurado y bloqueo de ventanas o navegación del navegador |
