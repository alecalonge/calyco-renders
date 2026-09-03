# Contexto maestro — Calyco Renders

> Documento vivo para alinear a Codex, Claude Code y cualquier otro asistente que trabaje sobre este proyecto en VS Code.
>
> Este archivo se llama `AGENTS.md` a propósito: Codex, Cursor, GitHub Copilot y la mayoría de los asistentes de código lo leen automáticamente al iniciar sesión en esta carpeta. Claude Code lee `CLAUDE.md`, que en esta carpeta simplemente importa este archivo — no hace falta duplicar contenido, alcanza con editar este.
>
> Última actualización: 3 de septiembre de 2026 (revisión: cómo correr en local, estado real de Git, comando de deploy neutro, breakpoints confirmados y adopción de la convención AGENTS.md).

## 1. Instrucciones para asistentes

Antes de modificar el proyecto:

1. Leer este documento completo.
2. Inspeccionar la estructura y el código existente. No inventar nombres de archivos, clases, selectores ni rutas.
3. Tratar el código actual como fuente de verdad si contradice algún detalle técnico de este documento.
4. Hacer cambios mínimos y localizados. No reconstruir páginas ni crear implementaciones paralelas sin autorización.
5. Preservar todo lo que ya funciona, especialmente la versión de escritorio cuando el pedido afecta solamente a móvil.
6. Evitar CSS duplicado, reglas contradictorias, listeners repetidos y parches acumulativos sin entender la causa.
7. Probar los cambios localmente antes de darlos por terminados.
8. No desplegar a producción ni ejecutar `vercel --prod` salvo pedido explícito de Alejandro.
9. Nunca guardar contraseñas, tokens, claves privadas ni credenciales en el repositorio.
10. Al finalizar, informar con claridad qué archivos se modificaron, qué se corrigió y cómo se verificó.

Cuando se tome una decisión permanente de arquitectura, diseño o comportamiento, actualizar también este archivo.

## 2. Identidad del proyecto

- Marca: **Calyco Renders**.
- Escritura correcta: **Calyco**, con “y”.
- Responsable: Alejandro Calonge.
- Dominio principal: `https://www.calycorenders.com`.
- Actividad: producción de renders 3D de alta calidad, principalmente para griferías y accesorios.
- Marca vinculada al desarrollo: **Calyco Systems**.
- LinkedIn: `https://www.linkedin.com/in/alejandrocalonge/`.
- Correo público: `contacto@calycorenders.com`.

## 3. Objetivo y lenguaje visual

El sitio funciona como portfolio profesional y carta de presentación. Debe transmitir precisión, sofisticación, calidad técnica y una estética premium.

Principios visuales:

- Fondo negro y estética minimalista.
- Interfaz elegante, sobria y delicada.
- Blanco y grises como colores principales; evitar acentos estridentes.
- Animaciones breves y suaves, nunca decorativas en exceso.
- La fotografía y los renders son los protagonistas.
- No mostrar nombres de archivo ni textos técnicos sobre las imágenes.
- Mantener consistencia estricta entre encabezados, navegación y pies de página.

La palabra `calyco` del encabezado se presenta en minúsculas y con tipografía manuscrita Yellowtail. Preservar el logo y las proporciones actuales.

## 4. Arquitectura actual

Sitio estático, sin framework, backend ni CMS.

Estructura esperada — confirmar siempre con el repositorio antes de editar:

```text
/
├── index.html
├── sobre-nosotros.html
├── contacto.html
├── css/
│   └── style.css
├── js/
│   ├── script.js
│   └── portfolio-data.js
├── images/
├── fonts/
└── vercel.json
```

Tecnologías:

- HTML semántico.
- CSS responsive.
- JavaScript nativo.
- Formspree para el formulario de contacto.
- Vercel para hosting, DNS, HTTPS y despliegue.

No incorporar una dependencia, librería o framework para resolver algo que pueda solucionarse limpiamente con la arquitectura existente.

## 5. Encabezado y navegación

El encabezado contiene:

- Isotipo y nombre `calyco`.
- Menú de navegación/hamburguesa según el ancho.
- Instagram.
- LinkedIn, enlazado al perfil de Alejandro.

Reglas:

- Conservar la alineación, escala y espaciado actuales en escritorio.
- Los enlaces externos que abran otra pestaña deben usar `rel="noopener noreferrer"`.
- Los efectos hover deben ser sutiles: cambio leve de opacidad, color, borde o desplazamiento.
- En móvil, ningún elemento puede desbordar el ancho de pantalla.

## 6. Portfolio (`index.html`)

### Escritorio

- El portfolio utiliza una composición tipo masonry que respeta las distintas proporciones de las imágenes.
- Cada proyecto contiene un render final y su wireframe correspondiente.
- El hover conmuta visualmente del render al wireframe.
- El clic abre el lightbox.
- El lightbox no muestra nombres, captions ni nombres de archivos.

### Móvil y dispositivos táctiles

- Una sola columna.
- Cada tarjeta ocupa el ancho disponible y conserva la relación de aspecto real de su imagen.
- El render y el wireframe deben estar exactamente superpuestos.
- Nunca deben verse partidos en dos mitades ni uno al lado del otro.
- Un toque conmuta la tarjeta completa entre render y wireframe.
- El lightbox debe permanecer completamente deshabilitado en móvil/táctil.
- Evitar que un evento táctil produzca después un clic fantasma que abra la imagen.
- No usar alturas mínimas fijas ni reglas de expansión que deformen toda la grilla.

### Carga y rendimiento

- Las imágenes del portfolio están optimizadas en WebP. No volver a PNG salvo necesidad concreta.
- Las imágenes bajo el primer pliegue deben usar carga diferida cuando corresponda.
- Evitar que la grilla aparezca como mosaicos negros que se completan de a uno.
- No reintroducir skeletons con rayas ni placeholders que parezcan errores de carga.
- Existe o debe preservarse una precarga inicial con logo, barra y porcentaje.
- Esa precarga debe mostrarse una sola vez por sesión, no cada vez que se vuelve al portfolio desde otra página.
- No ocultar el portfolio durante varios segundos esperando todas las imágenes si eso produce una pantalla negra prolongada.

## 7. Página “Sobre nosotros”

- Mantener el encabezado y el pie exactamente consistentes con las otras páginas.
- La versión de escritorio ya fue considerada visualmente correcta: los ajustes móviles deben quedar dentro de media queries.
- Evitar un espacio vacío excesivo entre el encabezado y el contenido en móvil.
- Preservar el slider/hero y el texto institucional existentes.

### Sección de clientes — pendiente

Se planea incorporar una sección al final con un título como **“Clientes que confiaron en nosotros”**.

Clientes identificados hasta ahora:

- FV
- Ferrum
- Andez
- Grupo FV
- Franz Viegener
- Peisa
- Boet
- Aqualaf
- Majos
- GRB Mixers

No implementar la sección hasta que Alejandro entregue logos individuales preparados. Preferir SVG o PNG/WebP transparente, todos normalizados visualmente. Orientación prevista: 3 o 4 columnas en escritorio y 2 columnas en móvil.

## 8. Página de contacto

Elementos actuales:

- Slider/imagen de cabecera.
- Datos de contacto superpuestos.
- Formulario conectado a Formspree.

Datos visibles:

- `contacto@calycorenders.com`
- `(+54).11.4292.1486 studio`
- `(+54)911.4087.7089 mobile`
- `alejandro calonge`

Reglas para móvil:

- Los datos no deben quedar desplazados ni recortados hacia la derecha.
- Mantener margen derecho seguro, idealmente de al menos 24 px.
- La escala móvil de esos datos es aproximadamente un 15 % menor que la de escritorio.
- Mantener el email en una línea cuando el ancho lo permita, sin generar overflow.

Formulario:

- Preservar el endpoint existente de Formspree.
- Mostrar éxito únicamente después de una respuesta exitosa real.
- Limpiar campos únicamente después de un envío exitoso.
- Insertar mensajes con `textContent`, no con HTML generado desde entradas del usuario.

WhatsApp:

- Hay un icono junto al número móvil que abre WhatsApp.
- Actualmente es un enlace directo; no asumir que existe un bot.
- Una futura automatización puede comenzar con el mensaje de bienvenida de WhatsApp Business o evolucionar a la API oficial, pero requiere una decisión aparte.

## 9. Pie de página compartido

El footer debe ser idéntico en las tres páginas y estar en el flujo normal del documento, nunca fijo ni posicionado de manera absoluta.

Contenido:

```text
© 2026 Calyco Renders. Todos los derechos reservados.
Diseñado y desarrollado por Calyco Systems
```

Estilo esperado:

- Centrado.
- Gris tenue sobre negro.
- Tipografía discreta.
- Borde superior fino.
- Hover delicado para el enlace de Calyco Systems, si existe.
- Sus estilos deben estar aislados para que las reglas generales de párrafos de cada página no alteren su tamaño o alineación.

Verificar especialmente `sobre-nosotros.html`, porque anteriormente su footer apareció más grande y alineado a la izquierda respecto del de contacto.

Nota (3 sep 2026): el texto del footer en vivo (`www.calycorenders.com`) es idéntico en `sobre-nosotros.html` y `contacto.html`. No se pudo confirmar por este medio si el tamaño/alineación visual sigue desviado — esa parte requiere revisión visual directa (captura o inspección en el navegador), no solo el HTML.

## 10. Hosting, dominio y despliegue

- Plataforma: Vercel.
- Proyecto: `calyco-renders`.
- Equipo: `calyco-systems`.
- Dominio raíz: `calycorenders.com`.
- Dominio canónico: `www.calycorenders.com`.
- El dominio raíz redirige con HTTP 308 hacia `www`.
- Registrador: GoDaddy.
- DNS administrado por Vercel mediante:
  - `ns1.vercel-dns.com`
  - `ns2.vercel-dns.com`
- El certificado SSL está activo.

Despliegue manual habitual (el comando de Vercel CLI es el mismo en PowerShell, bash o zsh; solo requiere tener la CLI instalada y sesión iniciada):

```bash
vercel --prod
```

Antes de desplegar, confirmar:

```bash
vercel whoami
```

Cuenta observada: `alejandrocalonge-2951`. Equipo activo: `calyco-systems`.

No cambiar DNS, dominio, equipo de Vercel ni vínculo del proyecto como parte de una tarea de diseño o código.

## 11. Seguridad

El sitio recibió calificación A+ en Mozilla Observatory después de incorporar cabeceras de seguridad.

Reglas:

- Preservar `vercel.json` y sus cabeceras.
- No debilitar Content Security Policy, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` ni la protección contra iframes sin explicar el motivo.
- Si se agrega un script o servicio externo, actualizar la CSP únicamente con los dominios mínimos necesarios.
- Mantener todos los recursos externos bajo HTTPS.
- Evitar `eval`, `new Function`, `document.write` e inserciones inseguras con `innerHTML`.
- No almacenar secretos en JavaScript, HTML ni archivos públicos.

El correo del dominio se administra externamente mediante Zoho Mail. Las credenciales y datos sensibles de correo nunca deben incorporarse al repositorio.

## 12. Analítica — pendiente

Todavía debe confirmarse la instalación de analítica en el código.

Plan acordado:

1. Activar Vercel Web Analytics desde el panel.
2. Incorporar en todas las páginas estáticas el fragmento exacto indicado por Vercel.
3. Actualizar la CSP si el script lo requiere.
4. Desplegar y verificar eventos en producción.
5. Evaluar Microsoft Clarity para mapas de calor, grabaciones y zonas de abandono.

No afirmar que Analytics o Clarity están instalados sin comprobar primero el código y el panel correspondiente.

## 13. Pruebas mínimas obligatorias

### Cómo levantar el sitio en local

No hay build ni dependencias: alcanza con un servidor estático simple desde la raíz del proyecto, por ejemplo `python -m http.server 8000` o `npx live-server`, y abrir `http://localhost:8000` (o el puerto que corresponda). No usar `file://` directo para evitar diferencias de comportamiento con rutas relativas y CSP.

### Checklist de pruebas

Para cualquier cambio visual o de interacción:

- Escritorio: verificar al menos 1280 px y 1920 px.
- Móvil: verificar 360 px, 390 px y 430 px.
- Confirmar que los anchos de prueba caigan a ambos lados de cada breakpoint real definido en `css/style.css`. Breakpoints confirmados contra el sitio en vivo (3 sep 2026): `max-width: 1100px` (grid portfolio a 3 columnas), `max-width: 768px` (posicionamiento de imágenes del portfolio), `max-width: 760px` (activa el menú hamburguesa y portfolio a 1 columna), `max-width: 600px` (ajustes de header móvil) y `max-width: 480px` (ajuste final de grillas). El footer no tiene media queries propias — su estilo es el mismo en todos los anchos.
- Confirmar que no haya scroll horizontal.
- Navegar entre Portfolio, Sobre nosotros y Contacto varias veces.
- Verificar que el preloader no se repita dentro de la misma sesión.
- En escritorio: hover y lightbox del portfolio.
- En móvil/táctil: conmutación render/wireframe y ausencia total de lightbox.
- Probar menú, Instagram, LinkedIn y WhatsApp.
- Probar el formulario sin generar envíos innecesarios durante el desarrollo.
- Revisar consola del navegador, rutas rotas y errores 404.

Si se cambia el footer, comparar las tres páginas en el mismo ancho.

## 14. Forma de trabajo compartida

Para mantener alineados a Codex y Claude Code:

1. Trabajar siempre sobre la misma carpeta.
   - Ruta local: `D:\Masterworks\CALYCO_RENDERS` (Windows).
   - Estado actual (3 sep 2026): **no hay Git inicializado todavía** (existe `.gitignore` pero no hay carpeta `.git`). No hay repositorio remoto en GitHub/GitLab; el despliegue se hace directo con `vercel --prod` desde esta carpeta.
   - Recomendación: correr `git init` en esta carpeta (no requiere subirlo a ningún lado) para tener historial local y poder revertir cambios si algo se rompe, sobre todo trabajando con dos asistentes distintos sobre el mismo código. Es una decisión de Alejandro, no autoejecutar `git init` sin que lo pida.
2. Si en algún momento se inicializa Git, revisar `git status` y los cambios no confirmados antes de empezar.
3. No sobrescribir cambios ajenos ni revertir archivos sin autorización.
4. Hacer una tarea concreta por vez.
5. Usar commits pequeños y descriptivos cuando Alejandro lo solicite.
6. Al pasar de un asistente al otro, compartir el objetivo, los archivos tocados, las pruebas realizadas y cualquier pendiente.
7. Actualizar este documento cuando cambien decisiones estables del proyecto.

Plantilla recomendada para el traspaso:

```text
Objetivo:
Archivos modificados:
Qué cambió:
Qué se verificó:
Pendientes o riesgos:
¿Desplegado?: no/sí + URL
```

## 15. Prioridades abiertas

- Confirmar que el footer de Sobre nosotros sea idéntico al resto.
- Instalar y verificar Vercel Web Analytics.
- Evaluar Microsoft Clarity.
- Incorporar logos de clientes cuando estén preparados individualmente.
- Evaluar una bienvenida o bot de WhatsApp en una tarea separada.

## 16. Criterio final

Ante cualquier duda, priorizar:

1. No romper lo que ya funciona.
2. Mantener la identidad minimalista y premium.
3. Resolver la causa, no solamente ocultar el síntoma.
4. Cuidar rendimiento móvil y estabilidad visual.
5. Mantener una sola implementación clara y fácil de sostener.

