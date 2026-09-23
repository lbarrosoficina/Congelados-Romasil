# Congelados Romasil

Sitio web estático de Congelados Romasil. El contenido publicado está en `dist/` y el repositorio principal es:

- GitHub: <https://github.com/lbarrosoficina/Congelados-Romasil>
- Rama de publicación: `main`
- Sitio Netlify: <https://congelados-romasil.netlify.app/>
- Dominio: <https://congeladosromasil.cl/>

## Documentación por área

- [Operación de la web](docs/WEB.md): NIC Chile, Cloudflare DNS, GitHub, Netlify y Vercel.
- [Operación del correo](docs/CORREO.md): Gmail, Cloudflare Email Routing, Resend y FormSubmit.
- [Cómo iniciar otra conversación](docs/INICIAR-CONVERSACION.md): textos listos para separar el trabajo de web y correo.
- [Instrucciones para agentes](AGENTS.md): reglas obligatorias de trabajo y publicación por lotes.

## Regla principal de publicación

Los cambios se acumulan y prueban localmente. No se crea un commit ni se sube nada a GitHub hasta que el usuario diga expresamente “publica los cambios”, “sube a GitHub” o “cierra el lote”.

Un `push` a `main` puede iniciar despliegues automáticos en Netlify y Vercel.

## Seguridad

No guardar en GitHub contraseñas, códigos de verificación, claves API, tokens ni credenciales. Las claves necesarias para servicios externos deben almacenarse como variables de entorno en la plataforma correspondiente.
