# Instrucciones de trabajo del proyecto

## Cambios y publicaciones

- Acumular los cambios solicitados por el usuario en el repositorio local.
- Revisar y probar cada cambio localmente, pero no crear commits ni subirlos a GitHub de forma automática.
- Considerar que cada envío a la rama principal de GitHub puede iniciar una nueva publicación en Netlify y consumir créditos.
- Publicar los cambios como un solo lote únicamente cuando el usuario lo autorice de manera explícita, por ejemplo: “sube a GitHub”, “publica los cambios” o “cierra el lote”.
- Antes de publicar, comprobar el conjunto completo de cambios pendientes y resumir qué incluirá el lote.
- Después de la autorización, crear un único commit coherente, subirlo a GitHub y verificar el estado del despliegue en Netlify.
- Si el usuario pide ver el avance antes de publicar, mostrar una vista previa local o describir los cambios pendientes sin subirlos.

## Activación del formulario de pedidos

- El formulario `pedido-romasil` utiliza el endpoint AJAX de FormSubmit para reenviar cada solicitud a `lbarros.oficina@gmail.com` y luego abre WhatsApp al número `+56 9 6231 9733`.
- El formulario debe funcionar desde ambos alojamientos, Netlify y Vercel, sin depender de los servicios de formularios de ninguno de ellos.
- Al publicar por primera vez esta integración, enviar una solicitud de prueba y activar FormSubmit mediante el correo de confirmación que llegará a `lbarros.oficina@gmail.com`.
- Antes de considerar terminado el despliegue, comprobar desde Vercel y Netlify tanto la recepción del correo como la apertura de WhatsApp con el resumen completo.
