# Herramientas para Itaca

Este programa es una herramienta para facilitar la transferencia automática de calificaciones y observaciones a la plataforma docente de Ítaca. Para ello, crea un botón debajo del nombre del grupo que permite importar los datos desde un archivo CSV a la plataforma.

---

## Instalación como extensión

1. Instalar una extensión compatible con scripts de usuario, como Tampermonkey, Greasemonkey, UserScripts u otra similar.

   - [GreaseMonkey](https://addons.mozilla.org/es-ES/firefox/addon/greasemonkey/) para Firefox  
   - [Tampermonkey](https://www.tampermonkey.net/index.php?browser=chrome&locale=es) para Chrome, Edge, Opera...  
   - [UserScripts](https://apps.apple.com/us/app/userscripts/id1463298887) para Safari

2. Instalar el script [Herramientas para Ítaca](/HerramientasItaca.user.js?raw=1))

---

## Usar el importador de CSV sin instalar la extensión

No es necesaria su instalación. Para ejecutarlo simplemente hay que copiar el código en la consola:

1. Accede a la página de calificaciones del grupo deseado.
2. Pulsa `F12` para abrir las herramientas de desarrollador.
3. Haz clic en la pestaña "Consola".  
   _Nota: Si es la primera vez que usas la consola, puede aparecer una advertencia y se te pedirá que escribas algo._
4. Copia el [código del programa](/csv2itaca.js?raw=1) y pégalo en la consola.
5. En Chrome: pulsa la tecla `Intro` para ejecutarlo.  
   En Firefox: haz clic en "Run".
6. Aparecerá un botón en la parte superior que permitirá cargar un archivo CSV.

---

## Formato del archivo CSV

- No debe tener cabecera con títulos.
- Se debe utilizar `\n` para los saltos de línea.
- No se puede usar punto y coma (`;`), salvo el necesario para separar los campos del CSV.

---

### Tipos de archivos aceptados

Se aceptan los siguientes formatos de archivo (puedes encontrar ejemplos [aquí](/CSV%20Ejemplo/)):

- `Nota;Observación;Apellido1 Apellido2, Nombre`  
  _Recomendado: el nombre solo se utiliza para verificar errores._
- `Nota;Observación`
- `Nota`
- `Observación`
