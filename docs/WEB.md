# Operación de la web

Última actualización: 24 de septiembre de 2026.

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
- `netlify.toml` redirige permanentemente cualquier visita a la URL de Netlify hacia la misma ruta en `https://congeladosromasil.cl`.

### Vercel

- Proyecto importado desde el mismo repositorio de GitHub.
- Nombre usado al importarlo: `congelados-romasil`.
- Los registros del dominio principal y `www` apuntan actualmente a Vercel.
- Los cambios en `main` deben generar un nuevo despliegue automáticamente.
- URL de producción confirmada: <https://congelados-romasil.vercel.app/>.
- `vercel.json` define `dist/` como salida y redirige permanentemente la URL `.vercel.app` y `www.congeladosromasil.cl` hacia la misma ruta en el dominio principal.
- La configuración de Domains debe mantener `congeladosromasil.cl` como dominio de producción. El 23 de septiembre de 2026 se comprobó que `www` ya respondía con una redirección permanente al dominio principal.

## Dominio canónico y SEO

- El único dominio canónico e indexable es `https://congeladosromasil.cl`.
- Los enlaces `canonical`, Open Graph, datos estructurados, `sitemap.xml` y `robots.txt` utilizan el dominio principal.
- Netlify funciona como alojamiento secundario y redirige al dominio principal.
- Vercel sirve el dominio principal. Los alias `www` y `.vercel.app` están cubiertos por redirecciones condicionadas por hostname en `vercel.json`; la configuración de Domains mantiene además la redirección de `www` a nivel de plataforma.

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
- Una dirección inexistente muestra la página `404.html`, sin indexación y con enlaces de recuperación.
- La navegación es igual en todas las páginas.
- Las imágenes cargan en escritorio y móvil.
- El mapa muestra Providencia, Ñuñoa y Las Condes.
- El catálogo y sus filtros funcionan.
- El carrito conserva y elimina productos correctamente.
- El formulario solicita nombre, teléfono, correo, dirección y comuna.
- La solicitud llega por correo y después se abre WhatsApp con el resumen.
- Netlify y Vercel muestran la misma versión.
- La URL de Netlify, `www` y la URL `.vercel.app` redirigen a la misma ruta del dominio principal con estado permanente.
- El código fuente de cada página muestra `https://congeladosromasil.cl` en canonical y Open Graph.
- `https://congeladosromasil.cl/robots.txt` enlaza al sitemap del dominio principal.
- No se publicaron secretos ni claves API.

## Estado y asuntos pendientes

- Search Console: propiedad de dominio verificada mediante DNS el 23 de septiembre de 2026. No eliminar el registro TXT de verificación. El sitemap actualizado se debe enviar después de publicar.
- FormSubmit: el usuario confirmó el 24 de septiembre la recepción del correo de prueba.
- Publicación del lote autorizada el 24 de septiembre de 2026. Ante un fallo crítico de navegación o pedidos, restaurar el despliegue anterior desde el alojamiento; no modificar DNS ni correo para revertir contenido.
- El formulario es independiente del alojamiento: usa FormSubmit y después abre WhatsApp.
- El dominio canónico ya está migrado a `https://congeladosromasil.cl` en todas las señales SEO del repositorio.
- Tras publicar, queda verificar mediante una prueba HTTP que Netlify, `www` y `congelados-romasil.vercel.app` redirigen al dominio principal conservando la ruta.
- Antes de modificar DNS, revisar el impacto sobre web y correo.

## Diagnóstico rápido

| Problema | Revisar primero |
|---|---|
| GitHub tiene cambios pero la web no | Estado del despliegue en Netlify y Vercel; rama publicada `main` |
| Netlify y Vercel muestran versiones distintas | Último commit desplegado en cada plataforma y caché del navegador |
| El dominio no abre | Registros `@` y `www`, asignación del dominio en Vercel y certificado TLS |
| El formulario no envía | Consola del navegador, disponibilidad de FormSubmit y activación del destinatario |
| WhatsApp no abre | Número configurado y bloqueo de ventanas o navegación del navegador |
