# Cómo publicar y actualizar la web (GitHub Pages)

## Primera publicación de esta versión
1. Entra en tu repositorio de GitHub (el que sirve agegrupoasesor.es).
2. Borra el `index.html` antiguo (y cualquier archivo suelto que hubiera de la versión anterior).
3. Sube TODO el contenido de esta carpeta, respetando los nombres:
   - `index.html`, `aviso-legal.html`, `privacidad.html`
   - carpetas `css/`, `js/`, `img/`, `fonts/`
   - `sitemap.xml`, `robots.txt`
   (En GitHub: "Add file → Upload files", arrastra todo a la vez, y "Commit changes".)
4. Espera 1-2 minutos y abre https://agegrupoasesor.es en modo incógnito.
   Si ves la versión antigua, pulsa Ctrl+F5 (recarga forzada).

## Hacer cambios más adelante
- Textos, teléfonos, horario → `index.html` (busca el texto y cámbialo).
- Respuestas del asistente → `js/chatbot.js` (bloque INTENTS; cada respuesta tiene su texto).
- Colores, tamaños, animaciones → `css/style.css`.
- Fotos o logo → carpeta `img/` (mantén el mismo nombre de archivo y se actualiza solo).
Después de cambiar un archivo, súbelo a GitHub con el mismo nombre en la misma carpeta y se publica solo.

## Comprobaciones tras publicar
- Google Search Console (search.google.com/search-console): añade la propiedad y envía `https://agegrupoasesor.es/sitemap.xml`.
- Bing Webmaster Tools (bing.com/webmasters): igual, para aparecer en Bing/Edge.
- Comparte el enlace por WhatsApp contigo mismo: debe salir la tarjeta con el logo.
