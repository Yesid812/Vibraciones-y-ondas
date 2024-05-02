//Variables para botones
let button,
  pausar = false,
  simular = false;

//Variables de constantes para el sistema
let bandera = 0,
  cambio = 0,
  paso = 0,
  Periodo,
  Frecuencia;

let containerWidth = document.getElementById("p5-container").offsetWidth;
let containerHeight = document.getElementById("p5-container").offsetHeight;
//Variables para los sliders
let sliderMasa,
  sliderDisco,
  sliderAngulo,
  sliderL,
  sliderK,
  sliderVelocidad,
  sliderB,
  sliderTorque,
  sliderWf;

//Variables de cambio (sliders)
let valorMasa = 0,
  valorElastica = 0,
  valorAngulo = 0,
  valorRadio = 0,
  valorLongitudC = 0,
  valorB = 0,
  valorTorque = 0,
  valorWf = 0;

//Variables para indicar la posición de los datos
let positionSliderX = 650,
  positionTextX = positionSliderX - 200;

//Variables para: Pendulo y resorte
let angle,
  anguloTemp = 0,
  posicion,
  puntoOrigen,
  anchor;

//Variables de calculos
let W0 = 0,
  Inercia = 0,
  cuerda = 0,
  radioPrueba = 0,
  D = 0,
  Gamma = 0,
  Delta = 0,
  t = 0,
  seno = -1,
  coseno = 1;

//Variables de tiempo para graficas
let tX = 0,
  tV = 0,
  tA = 0,
  graficaEspecial = 0,
  xt = 0,
  vt = 0,
  at = 0;
var cnt1 = 0;

//Variable para simular la gravedad
let gravity = 9.8;

//Funcion propia de P5 para poder dibujar constantemente lo que se necesita
function draw() {
  informacion();
  if (simular && !pausar) {
    clear(); // Verifica si la simulación está pausada
    obtenerValores();
    simularCaso();
  }
}

//Funcion para predefinir la configuración del sistema
function setup() {
  //Se crea el canvas
  let canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent("p5-container");
  initControles(); //Botones
  angleMode(RADIANS); //Cambia el valor del angulo a grados

  //Partes de un pendulo
  //Partes de un pendulo
  puntoOrigen = createVector(350, 30);
  posicion = createVector(-140, 156);

  //Partes de un resorte
  anchor = createVector(55, posicion.y);

  valorMasa = document.getElementById("sliderMasa").value;
  valorElastica = document.getElementById("sliderK").value;
  valorLongitudC = document.getElementById("sliderL").value;
  valorRadio = document.getElementById("sliderDisco").value;
  valorB = document.getElementById("sliderB").value;
  valorTorque = document.getElementById("sliderT").value;
  valorWf = document.getElementById("sliderWf").value;

  document
    .getElementById("sliderMasa")
    .addEventListener("input", obtenerValores);
  document.getElementById("sliderK").addEventListener("input", obtenerValores);
  document.getElementById("sliderL").addEventListener("input", obtenerValores);
  document
    .getElementById("sliderDisco")
    .addEventListener("input", obtenerValores);
  document.getElementById("sliderB").addEventListener("input", obtenerValores);
  document.getElementById("sliderT").addEventListener("input", obtenerValores);
  document.getElementById("sliderWf").addEventListener("input", obtenerValores);
}

//Muestra la informacion necesaria para los datos a utilizar
function informacion() {
  valorMasa = document.getElementById("sliderMasa").value;
  valorElastica = document.getElementById("sliderK").value;
  valorLongitudC = document.getElementById("sliderL").value;
  valorRadio = document.getElementById("sliderDisco").value;
  valorB = document.getElementById("sliderB").value;
  valorTorque = document.getElementById("sliderT").value;
  valorWf = document.getElementById("sliderWf").value;

  document.getElementById("masaInfo").innerText = +valorMasa;
  document.getElementById("sliderKValue").innerText = +valorElastica;
  document.getElementById("sliderLValue").innerText = +valorLongitudC;
  document.getElementById("sliderDiscoValue").innerText = +valorRadio;
  document.getElementById("sliderBValue").innerText = +valorB;
  document.getElementById("sliderTValue").innerText = +valorTorque;
  document.getElementById("sliderWfValue").innerText = +valorWf;
}

function obtenerValores() {
  valorMasa = parseFloat(document.getElementById("sliderMasa").value);
  valorElastica = parseFloat(document.getElementById("sliderK").value);
  valorLongitudC = parseFloat(document.getElementById("sliderL").value);
  valorRadio = parseFloat(document.getElementById("sliderDisco").value);
  valorB = parseFloat(document.getElementById("sliderB").value);
  valorTorque = parseFloat(document.getElementById("sliderT").value);
  valorWf = parseFloat(document.getElementById("sliderWf").value);
}

function simularCaso() {
  fill(38, 117, 241);
  stroke(0, 0, 0);
  rect(50, 10, 20, 500);
  rect(50, 10, 500, 20);
  pendulo();
  resorte();
}
function updateSliderValue(sliderId, displayId) {
  let slider = document.getElementById(sliderId);
  let display = document.getElementById(displayId);

  if (slider && display) {
    display.textContent = slider.value;
  }
}
//Funcion para mostrar los botones de simulación y reinicio
function initControles() {
  // Obtener los botones del DOM
  const simularButton = document.getElementById("simularButton");
  const reiniciarButton = document.getElementById("reiniciarButton");

  // Asignar funciones a los botones
  simularButton.addEventListener("click", () => {
    simular = true;
    pausar = false; // Asegúrate de que la simulación no esté pausada al iniciar
  });

  reiniciarButton.addEventListener("click", () => {
    if (!pausar) {
      // Verifica si la simulación está pausada
      pausar = true; // Cambia el estado de pausa
    }
  });
}

//Funcion para simular un pendulo y sus calculos
function pendulo() {
  textSize(14);
  //Calculando el vector posicion
  posicion.x = valorLongitudC * 100 * sin(0) + puntoOrigen.x;
  posicion.y = valorLongitudC * 100 * cos(0) + puntoOrigen.y;

  if (simular) {
    cuerda = valorLongitudC;
    radioPrueba = valorRadio;
    if (bandera < 1) {
      anguloTemp = 1 * 10 * (Math.PI / 180);
      Inercia =
        (valorMasa * pow(radioPrueba, 2)) / 2 +
        valorMasa * pow(cuerda + radioPrueba, 2);
      W0 = sqrt(
        (valorElastica * pow(cuerda, 2) + valorMasa * gravity * cuerda) /
          Inercia
      );
      Gamma = valorB / (Inercia * 2);
      Frecuencia = sqrt(pow(W0, 2) - 2 * pow(Gamma, 2));
      Delta = atan((2 * Gamma * valorWf) / (pow(W0, 2) - pow(valorWf, 2)));
      D =
        valorTorque /
        Inercia /
        sqrt(
          pow(2 * Gamma * valorWf, 2) + pow(pow(W0, 2) - pow(valorWf, 2), 2)
        );
      fill(0);
      noStroke();
      let denominador = pow(W0, 2) - pow(valorWf, 2);
      //cos+ sen+ c1
      //Primer cuadrande, queda tal cual.
      if (denominador < 0) {
        //cos- sen+ c2
        Delta = Math.PI - Math.abs(Delta);
      }
      if (valorB == 0) {
        // Conocer cuando no hay amortiguamiento
        if (W0 > valorWf) {
          D = valorTorque / Inercia / (pow(W0, 2) - pow(valorWf, 2));
          Delta = 0;
        }
        if (valorWf > W0) {
          D = valorTorque / Inercia / (pow(valorWf, 2) - pow(W0, 2));
          Delta = Math.PI;
        }
        if (valorWf == W0) {
          D = valorTorque / (2 * W0 * Inercia);
        }
      }
    }
    bandera++;

    fill(0);
    noStroke();

    //Calculamos el movimiento del pendulo
    if (valorWf == W0 && valorB == 0) {
      xt = D * t * Math.sin(W0 * t);
      vt = D * Math.sin(W0 * t) - D * t * W0 * Math.cos(W0 * t);
      at =
        -D * W0 * Math.cos(W0 * t) -
        D * W0 * Math.cos(W0 * t) +
        D * t * pow(W0, 2) * Math.sin(W0 * t);
      let resultado = document.getElementById("Ecuacion");
      resultado.innerHTML =
        "X(t)= " +
        D.toFixed(2) +
        " * " +
        t.toFixed(2) +
        " * sin(" +
        W0.toFixed(2) +
        " * " +
        t.toFixed(2) +
        ")";
    } else {
      xt = D * Math.cos(valorWf * t - Delta);
      vt = -D * valorWf * Math.sin(valorWf * t - Delta);
      at = -D * pow(valorWf, 2) * Math.cos(valorWf * t - Delta);
      let resultado = document.getElementById("Ecuacion");
      resultado.innerHTML =
        "X(t)= " +
        D.toFixed(3) +
        " * cos(" +
        valorWf.toFixed(2) +
        " * " +
        t.toFixed(2) +
        " - " +
        Delta.toFixed(2) +
        ")";
    }
    if (W0 == valorWf) {
      let resonancia = document.getElementById("Resonancia");
      resonancia.innerHTML = "->Existe resonancia";
    }

    posicion.x = valorLongitudC * 100 * sin(anguloTemp) + puntoOrigen.x;
    posicion.y = valorLongitudC * 100 * cos(anguloTemp) + puntoOrigen.y;

    if (!isNaN(xt)) {
      anguloTemp = xt;
    }

    if (paso < 1) {
      graficas();
    }
    paso++;
    t += 0.01;
  }
  stroke(225);
  strokeWeight(4);
  fill(54, 245, 117);
  line(puntoOrigen.x, puntoOrigen.y, posicion.x, posicion.y);
  circle(posicion.x, posicion.y, valorRadio * 100);
}

//Funcion que simula un resorte
function resorte() {
  anchor = createVector(65, valorLongitudC * 100 + 30);
  noFill();
  stroke(0); // Color negro
  strokeWeight(2.6 + valorElastica * 0.05); // Grosor de la línea

  let numSegments = 2000; // Número de segmentos del resorte

  // Dibujar las espirales del resorte
  beginShape();

  for (let i = 0; i < numSegments; i++) {
    let t = map(i, 0, numSegments, 0, TWO_PI * 10); // Ajusta el rango de la función sinusoidal

    let segmentStart = p5.Vector.lerp(anchor, posicion, i / numSegments);
    let segmentEnd = p5.Vector.lerp(anchor, posicion, (i + 1) / numSegments);

    let midX = (segmentStart.x + segmentEnd.x) / 2;
    let midY = (segmentStart.y + segmentEnd.y) / 2;

    let angle = atan2(
      segmentEnd.y - segmentStart.y,
      segmentEnd.x - segmentStart.x
    );

    let offset = 10 * sin(t); // Ajuste para hacer las espirales

    let endX = midX + offset * cos(angle - HALF_PI);
    let endY = midY + offset * sin(angle - HALF_PI);

    vertex(endX, endY);
  }
  endShape();
}

//Funciones para simular el movimiento de X (Posicion), V (Velocidad), A (Aceleracion)
function getDataPosition() {
  //var Xt = D * Math.cos(valorWf * tXE - Delta); //Cambiarla si es necesario
  var Xt = xt;
  return Xt;
}
function getDataVelocity() {
  // Se deben de cambiar
  var Vt = vt; //Cambiarla si es necesario
  return Vt;
}
function getDataAceleration() {
  var At = at; //Cambiarla si es necesario
  return At;
}

//Graficas de X (Posicion), V (Velocidad), A (Aceleracion)
function graficas() {
  if (!pausar) {
    var layout = {
      autosize: true,
      xaxis: { title: "Tiempo (s)", range: [0, 100] }, // Ajusta el rango inicial del eje x para un zoom reducido
      yaxis: { title: "Amplitud (rads)" }, // Rango fijo para el eje y y posición fija en el lado izquierdo
      legend:{x:0, y:-0.3},
      margin: { t: 50, b: 50, l: 29, r: 10 }, // Margen ampliado en el lado izquierdo
    };

    // Asegura que la posición inicial sea 0
    tX = 0;
    let positionData = {
      y: [getDataPosition()],
      type: "line",
      name: "Posición",
      yaxis: "y", // Mantiene el eje y principal
    };
    let velocityData = {
      y: [getDataVelocity()],
      type: "line",
      name: "Velocidad",
      yaxis: "y", // Mantiene el eje y principal
    };
    let acelerationData = {
      y: [getDataAceleration()],
      type: "line",
      name: "Aceleración",
      yaxis: "y", // Mantiene el eje y principal
    };

    Plotly.newPlot(
      "Movimientos",
      [positionData, velocityData, acelerationData],
      layout
    );

    setInterval(function () {
      if (!pausar) {
        tX += 0.5;
        tV += 0.1;
        tA += 0.1;

        // Agrega nuevos datos a los conjuntos de datos
        Plotly.extendTraces("Movimientos", { y: [[getDataPosition()]] }, [0]);
        Plotly.extendTraces("Movimientos", { y: [[getDataVelocity()]] }, [1]);
        Plotly.extendTraces("Movimientos", { y: [[getDataAceleration()]] }, [2]);

        // Mueve el eje x y ajusta el rango del eje x
        let update = {
          xaxis: { range: [tX, tX + 850] },
        };
        Plotly.relayout("Movimientos", update);
        //cnt1 += 0.001;
        if (cnt1 > 10) {
          Plotly.relayout("Movimientos", { xaxis: { range: [-10, 10] } });
        }
      }
    }, 5);
  }
}
