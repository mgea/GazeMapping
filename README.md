# Gazemapping


![logo](public/gazemapping.png)

**Web Eye Tracking Analysis & Heatmap Visualization tool**



* Tool: **GazeMapping**
* **Github**: https://github.com/mgea/GazeMapping
* **Website** demo: https://gazemapping.onrender.com/
* **author**: Miguel Gea
* **version**: 1.0.0 upd. 31/01/2026
* **Keywords**: UX, Eye tracking, Heatmap, UI Design, GazeMapping, Análisis de Usuario



### ¿Qué es?

**GazeMapping** es una herramienta para el **Análisis de Experiencias de Usuario (UX)** mediante la estrategia de EyeTracking, dentro de las estrategias de **Test de Usabilidad con usuarios** (https://mgea.github.io/UX-DIU-Checklist/)

Los sistema de seguimiento ocular son muy interesantes para conocer la intencion del usuario teniendo en cuenta  **qué miran, dónde hacen clic y qué ignoran** los usuarios cuando interactúan con una interfaz web. 

El diseño está basado en la biblioteca de JavaScript **WebGazer.js** de código abierto que permite el **seguimiento ocular (eye-tracking)** en navegadores web de forma democrática y económica, dessarrollada en Universidad de Brown (https://webgazer.cs.brown.edu/), el código está disponible en https://github.com/brownhci/WebGazer



### ¿Cómo funciona? 

GazeMapping es una aplicación web que permite de modo **local** y usando la **webcam** hacer pruebas de usabilidad y obtener resultados mediante mapas de calor (heatmaps)

Está organizada en 3 módulos: 

* **Captura** de datos (testing.html)
* **Edición de Puntos de Interés (POI)** para incluir referencias de áreas de atencion para el experimento  (poi.html)
* **Visualización de Heatmaps** (heatmap.html)



#### Estructura de Datos (JSON)

El servidor Node.js organiza los datos automáticamente en una subcarpeta de `sites`. Es vital mantener esta jerarquía para que `api.js` encuentre los archivos:

- **Ruta de imágenes:** `/public/sites/*.png`
- **Ruta de datos:** `/public/sites/data/`
  - `poi-1.json`: Puntos de interés del sitio 1.
  - `clics-1.json`: Clics de usuarios en el sitio 1.
  - `gaze-1.json`: Datos de seguimiento ocular del sitio 1.

* **Ruta de datos de usuario:** `/public/sites/users.json/` (permite hacer varios ejercicios sobre los mismos sitios, y se acumulan los datos de tracking y clicks por si se quiere hacer un estudio sobre población)

Cada una de las  imágenes que vamos a evaluar puede representar una captura de un sitios web. Tambien pueden ser varias alternativas que se quieren evaluar mediante A/B testing. 

Las imagenes deben cumplir: 

*  Todas las imágenes tienen un **nombre numérico consecutivo y formato png** (1.png, 2.png....)
* Se recomienda que tengan la misma **resolucion (recomendado 1200píxels de ancho**, pueden ser tan largas como se quiera ya que se controla el scrolling)
* Se pueden capturar imágenes de sitios web con la **extensionde Chrome** **FireShot** (https://chromewebstore.google.com/detail/take-webpage-screenshots/mcbpblocgmgfnpjjppndjkmgjaogfceg?hl=es)



### Modo de Uso

Una vez incluidas las imágenes a evaluar en el lugar correspondiente, comenzaremos a **preparar los test de usabilidad** en el siguiente orden: 

##### 1. Módulo de Editor de POIs (`poi.html`)

Nos va a permitir  marcar zonas estratégicas (Puntos de Interés, **POI**) que quieres analizar específicamente.

- **Marcar un Punto:** Haz clic directamente sobre la imagen en cualquier zona importante (ej. un botón de "Comprar" o un logo).
- **Navegación:** Usa las flechas del teclado <kbd>←</kbd> <kbd>→</kbd> para moverte entre las diferentes pantallas (`sites/1.png`, `sites/2.png`, etc.).
- **Gestión de Puntos:**
  - **Deshacer:**  para eliminar el último punto marcado.
  - **Guardar:** Haz clic en **GUARDAR** para enviar las coordenadas al servidor. Los archivos se guardarán como `poi-X.json`.
- **Interfaz:** Pulsa la tecla **[ ESPACIO ]** para ocultar el menú si necesitas ver la imagen completa sin obstrucciones.



##### 2. Módulo de Captura y Registro de Datos (`testing.html`)

Este módulo registra el comportamiento del usuario en tiempo real.

- **Calibración:** Antes de empezar, se activa la webcam y muestra 9  puntos de calibración en pantalla para asegurar la precisión del seguimiento ocular. Hay que pulsar varias veces hasta que el punto desaparece. **No olvidar dar permisos al sitio web para usar Webcam**
- **Interacción:** Navega por la interfaz de forma natural. EL usuario puede hacer clicks si queremos capturar dónde ha pulsado si el ejercicio lo requiere. El sistema registrará:
  - **Gaze (Mirada):** Puntos donde fijas la vista.
  - **Clicks:** Localización exacta de cada pulsación.
- **Guardar datos en JSON**. MUY IMPORTANTE. Recueda que NO ALMACENA automaticamente, por lo que **al finalizar un sitio, hay que volver al menu** (con espacio)  **y GUARDAR**. 
- **Finalización:** Los datos se sincronizan automáticamente con el servidor al cerrar la sesión o cambiar de sitio. En ese momento se pedirán los datos de usuario (nombre, edad, perfil) para estudio demografico. Sólo es requerido un nombre de usuario (p.e. User1) y fecha y hora del ejercicio. esos datos se almacenan en ``/sites/users.json``

##### 3. Módulo de Heatmap (`heatmap.html`)

Es la herramienta de análisis visual donde se transforman los datos en información accionable.

- **Carga de Datos:** 1.  Selecciona el sitio con las flechas <kbd>←</kbd> <kbd>→</kbd>.
  2. Pulsa **CARGAR HEATMAP** para traer los datos de la mirada desde el servidor.
- **Capas de Visualización:**
  - **Botón Clics:** Activa/desactiva la visualización de los clics realizados por los usuarios (puntos amarillos) 
  - **Botón POIs:** Muestra los puntos estratégicos que definiste en el editor (puntos verdes) 
  - **Limpiar todo** elimina todos los datos cargados en visualización
- **Ajustes Técnicos (Configurar JPG):**
  - **Escala/Desplazamiento:** Ajusta las coordenadas si notas que los datos están movidos respecto a la imagen de fondo.
  - **Radio de Calor:** Aumenta o disminuye el tamaño de las "manchas" de calor según la precisión que busques.
- **Exportación:** Pulsa **GUARDAR JPG** para descargar una captura completa que incluya el fondo, el mapa de calor y las capas de clics/POIs activas.





----

### Bugs y futuras mejoras

* **No responsive testing**. Errror al redimensionar la pantalla en experimento. Se aconseja dejar siempre a mismo tamaño para no interferir en captura de datos 
* **No adaptado a móvil**, las teclas y el espacio de visualización esta pensados para pantallas FHD con webcam





----

### Alternativas de Eye Tracking con Webcam

Existen otras alternatias de software propietario y de pago por sesión como

* [Gaze Recorder](https://gazerecorder.com/) online y limitado de mod gratuito a 3-4 sesiones máximo
*  [RealEye](https://www.realeye.io/es) similar en cuanto a funcionalidad y prestaciones



----

CCBYNCSA *Miguel Gea, Enero 2026*
