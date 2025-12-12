# Redes neuronales artificiales

# **Tarea 7: Aplicación de CNN en Visión Artificial**

En esta carpeta se encuentra el código fuente del clasificador web de perros y gatos. 

Una vez que se crea y entrena el modelo de redes neuronales convolucionales con Python y Tensorflow, es exportado a los archivos "model.json" y "bin".

Puede utilizarse en el celular, solo se apunta la cámara al perro o gato que se desea clasificar (puede ser una imagen de la computadora, una foto, o uno de verdad), lo hace todo en el explorador utilizando Tensorflow.js.

## Cómo utilizarlo

### Utilizar la versión ya desplegada
Coloqué una versión para probar disponible en: [https://perrosygatos.azurewebsites.net/](https://perrosygatos.azurewebsites.net/).

### Descargar el repositorio
Descargar el repositorio en ls computadora.

### Inicia un servidor en la carpeta
Este proyecto utiliza un modelo de Tensorflow.js, el cual para cargarse requiere que el acceso sea por medio de http/https.
Para eso se puede usar cualquier servidor web. Aquí hay una forma de hacerlo con Python:
- Descargar Python en la computadora
- Abrir una línea de comandos o terminal
- Navegar hasta la carpeta donde se descargó el repositorio
- Ejecuta rel comando `python -m http.server 8000`
- Abrir un explorador y nevegar a http://localhost:8000
En caso de tener PHP, los pasos son los mismos pero el comando es `php -S localhost:8000`.
También se puede usar la extensión de VS Code llamada Live Server.

### Utilizarlo en un celular
Solo se requiere abrir el URL de la aplicación en producción en un navegador en el celular.

### Uso
Al abrir, se le puede dar clic en el botón de "Cambiar camara" para utilizar la cámara delantera o trasera del celular. Solo apuntar la cámara a un perro o gato, y abajo te aparecerá la predicción.