const IMG_SIZE = 224;
const CLASS_NAMES = ["Gato", "Perro"];  // Ajustado según etiquetas del modelo
const tamano = 400;

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const otrocanvas = document.getElementById("otrocanvas");
const ctx = canvas.getContext("2d");
const otroctx = otrocanvas.getContext("2d");

let currentStream = null;
let facingMode = "user";
let modelo = null;
let isPredicting = false;  // Para evitar predicciones simultáneas

// Cargar modelo
(async () => {
  console.log("Cargando modelo...");
  modelo = await tf.loadLayersModel("model/model.json");
  console.log("Modelo cargado");

  // Opcional: elegir backend WebGL para acelerar
  try {
    await tf.setBackend('webgl');
    await tf.ready();
    console.log("Backend:", tf.getBackend());
  } catch (e) {
    console.log("No se pudo cambiar backend, usando el default:", tf.getBackend());
  }
})();

window.onload = function () {
  mostrarCamara();
};

// Iniciar la cámara
function mostrarCamara() {
  const opciones = {
    audio: false,
    video: {
      width: tamano,
      height: tamano,
      facingMode: facingMode
    }
  };

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia(opciones)
      .then(function (stream) {
        currentStream = stream;
        video.srcObject = currentStream;

        // Cuando el video está listo, arrancamos el loop de dibujo
        video.onloadedmetadata = () => {
          video.play();
          procesarCamara();  // Loop de dibujo
          predecirLoop();    // Loop de predicción
        };
      })
      .catch(function (err) {
        console.log("Error al acceder a la cámara:", err);
      });
  } else {
    alert("Tu navegador no soporta getUserMedia");
  }
}

// Cambiar entre cámara frontal / trasera (en móviles)
function cambiarCamara() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => {
      track.stop();
    });
  }

  facingMode = facingMode === "user" ? "environment" : "user";
  mostrarCamara();
}

// Dibuja continuamente el video en el canvas principal
function procesarCamara() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    ctx.drawImage(video, 0, 0, tamano, tamano);
  }
  // Usamos requestAnimationFrame para que el navegador decida el mejor momento
  requestAnimationFrame(procesarCamara);
}

// Loop de predicción periódica
function predecirLoop() {
  predecir(); // Hace una predicción
  // Llamar de nuevo dentro de 800 ms (ajústalo: 500–1500 ms según fluidez)
  setTimeout(predecirLoop, 800);
}

// Predicción con el modelo
async function predecir() {
  if (!modelo) {
    console.log("El modelo aún no se ha cargado.");
    return;
  }

  if (isPredicting) {
    return;
  }

  isPredicting = true;

  try {
    const w = otrocanvas.width;
    const h = otrocanvas.height;
    // Dibujamos el frame actual en el canvas pequeño
    otroctx.drawImage(video, 0, 0, w, h);

    // Preprocesamiento estilo ResNet50 (caffe)
    const tensor = tf.tidy(() => {
      // 1. Imagen RGB uint8 -> float32
      let img = tf.browser.fromPixels(otrocanvas).toFloat(); // [H,W,3], 0–255

      // 2. Redimensionar a 224x224
      img = tf.image.resizeBilinear(img, [IMG_SIZE, IMG_SIZE]);

      // 3. Convertir de RGB a BGR
      img = tf.reverse(img, [2]);  // invierte el eje de canales (R,G,B -> B,G,R)

      // 4. Restar la media de ImageNet (en orden BGR)
      const meanBGR = tf.tensor1d([103.939, 116.779, 123.68]);
      img = img.sub(meanBGR);

      // 5. Añadir dimensión batch: [1, 224, 224, 3]
      return img.expandDims(0);
    });

    // 6. Predicción
    const logits = modelo.predict(tensor);
    const predictions = await logits.data();  // salida sigmoide

    const probDog = predictions[0];
    const label = probDog >= 0.5 ? CLASS_NAMES[1] : CLASS_NAMES[0];

    document.getElementById("descripcion").innerHTML = `Probabilidad reportada: ${probDog.toFixed(3)}`;
    document.getElementById("resultado").innerHTML = label;

    // 7. Liberar tensores
    tensor.dispose();
    logits.dispose();
  } catch (e) {
    console.log("Error en predicción:", e);
  } finally {
    isPredicting = false;
  }
}

