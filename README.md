# Csv2itaca
Este programa es una herramienta para facilitar la transferencia automática de calificaciones y observaciones a la plataforma docente de Ítaca. Para ello, crea un botón debajo del nombre del grupo que permite importar los datos en un archivo CSV a la plataforma.

# Uso
No es necesaria su instalación. Para ejecutarlo simplemente se debe de copiar el código en la consola.

1. Acceder a la página de calificaciones del grupo deseado.
2. Pulsar F12 para acceder a las herramientas para desarrolladores.
3. Haz click en la pestaña "Consola". _Nota: Si es la primera vez que utilizas la consola, aparecerá una advertencia y se te pedirá escribir un mensaje._
5. Copiamos el [código](/csv2itaca.js?raw=1) del programa y lo pegamos en la consola.
6. En Chrome: pulsamos la tecla INTRO para ejecutarlo.
   En Firefox: hacemos click en Run.
7. Aparecerá un botón arriba que nos pedirá un CSV.

# Formato del archivo CSV
- El formato del archivo CSV debe de ser `Nota; Observación`.
- No debe tener cabecera con títulos.
- Se debe utilizar `\n` para poner un salto de línea.
- No se puede utilizar punto y coma (;).

Se puede consultar el ejemplo haciendo [click aquí.](/Ejemplo.csv)


