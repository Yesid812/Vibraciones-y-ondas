//Variables para botones
let button,
  simular = false;
  pausar = false;

//Variables de constantes para el sistema
let bandera = 0,
  banderaSub = 0,
  banderaSobre = 0,
  banderaCriti = 0,
  paso = 0,
  Periodo,
  Frecuencia;

//Variables para los sliders
let sliderMasa,
  sliderDisco,
  sliderAngulo,
  sliderL,
  sliderK,
  sliderVelocidad,
  sliderB;

//Variables de cambio (sliders)
let valorMasa,
  valorElastica,
  valorAngulo,
  valorRadio,
  valorLongitudC,
  valorAmortiguamiento;


let containerWidth = document.getElementById('p5-container').offsetWidth;
let containerHeight = document.getElementById('p5-container').offsetHeight; 
//Variables para indicar la posición de los datos
let positionSliderX = 650,
  positionTextX = positionSliderX - 200;

//Variables para: Pendulo y resorte
let angle,
  anguloTemp = 0,
  posicion,
  puntoOrigen,
  anchor,
  velocityAngle = 0;

let W0 = 0,
  Inercia = 0,
  cuerda = 0,
  radioPrueba = 0,
  Phi = 0,
  Amplitud = 0,
  t = 0,
  seno = -1,
  coseno = 1,
  gamma = 0,
  W = 0,
  C = 0,
  C1 = 0,
  C2 = 0,
  M1 = 0,
  M2 = 0,
  xt = 0,
  vt = 0,
  at = 0;

//Variables de tiempo para graficas
let tX = 0,
  tV = 0,
  tA = 0;
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
  canvas.parent('p5-container');
  initControles(); //Botones
  angleMode(RADIANS); //Cambia el valor del angulo a grados

  //Partes de un pendulo
  puntoOrigen = createVector(350, 80);
  posicion = createVector(-140, 156);

  //Partes de un resorte
  anchor = createVector(55, posicion.y);


  //iniciar valores
  valorMasa = document.getElementById('sliderMasa').value;
  valorElastica = document.getElementById('sliderK').value;
  valorLongitudC = document.getElementById('sliderL').value;
  valorAngulo = document.getElementById('sliderAngulo').value;
  valorRadio = document.getElementById('sliderDisco').value;
  velocityAngle = document.getElementById('sliderVelocidad').value;
  valorAmortiguamiento = document.getElementById('sliderConstanteAmortiguamiento').value;
  
  document.getElementById('sliderMasa').addEventListener('input', obtenerValores);
  document.getElementById('sliderK').addEventListener('input', obtenerValores);
  document.getElementById('sliderL').addEventListener('input', obtenerValores);
  document.getElementById('sliderAngulo').addEventListener('input', obtenerValores);
  document.getElementById('sliderDisco').addEventListener('input', obtenerValores);
  document.getElementById('sliderVelocidad').addEventListener('input', obtenerValores);
  document.getElementById('sliderConstanteAmortiguamiento').addEventListener('input', obtenerValores);
}

//Funcion para mostrar los botones de simulación y reinicio


//Muestra la informacion necesaria para los datos a utilizar
function informacion() {
  valorMasa = document.getElementById('sliderMasa').value;
  valorElastica = document.getElementById('sliderK').value;
  valorLongitudC = document.getElementById('sliderL').value;
  valorAngulo = document.getElementById('sliderAngulo').value;
  valorRadio = document.getElementById('sliderDisco').value;
  velocityAngle = document.getElementById('sliderVelocidad').value;
  valorAmortiguamiento = document.getElementById('sliderConstanteAmortiguamiento').value;

  document.getElementById('masaInfo').innerText = + valorMasa;
  document.getElementById('sliderKValue').innerText = + valorElastica;
  document.getElementById('sliderLValue').innerText =  + valorLongitudC;
  document.getElementById('sliderAnguloValue').innerText = + valorAngulo;
  document.getElementById('sliderDiscoValue').innerText =  + valorRadio;
  document.getElementById('sliderVelocidadValue').innerText =   + velocityAngle;
  document.getElementById('sliderConstanteDeAmortiguamientoValue').innerText =   + valorAmortiguamiento;
}

function obtenerValores() {
  valorMasa = parseFloat(document.getElementById('sliderMasa').value);
  valorElastica = parseFloat(document.getElementById('sliderK').value);
  valorLongitudC = parseFloat(document.getElementById('sliderL').value);
  valorAngulo = parseFloat(document.getElementById('sliderAngulo').value);
  valorRadio = parseFloat(document.getElementById('sliderDisco').value);
  velocityAngle = parseFloat(document.getElementById('sliderVelocidad').value);
  valorAmortiguamiento = parseFloat(document.getElementById('sliderConstanteAmortiguamiento').value);
  angle = parseFloat(document.getElementById('sliderAngulo').value) / 10;
}


function simularCaso() {
  fill(38, 117, 241);
  stroke(0, 0, 0);
  rect(50, 60, 20, 400);
  rect(50, 60, 380, 20);
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
  const reiniciarButton  = document.getElementById("reiniciarButton");

  // Asignar funciones a los botones
  simularButton.addEventListener("click", () => {
    simular = true;
    pausar = false; // Asegúrate de que la simulación no esté pausada al iniciar
  });

  reiniciarButton.addEventListener("click", () => {
    if (!pausar) { // Verifica si la simulación está pausada
      pausar = true; // Cambia el estado de pausa

    } 
  });
}

//Funcion para simular un pendulo y sus calculos
function pendulo() {
  //circle(200, -40, 20);
  //Calculando el vector posicion
  posicion.x =
    valorLongitudC * 100 * sin(angle * 10 * (Math.PI / 180)) + puntoOrigen.x;
  posicion.y =
    valorLongitudC * 100 * cos(angle * 10 * (Math.PI / 180)) + puntoOrigen.y;

  if (simular) {
    cuerda = valorLongitudC;
    radioPrueba = valorRadio;
    if (bandera < 1) {
      anguloTemp = angle * 10 * (Math.PI / 180);
      Inercia =
        (valorMasa * pow(radioPrueba, 2)) / 2 +
        valorMasa * pow(cuerda + radioPrueba, 2);
      W0 = sqrt(
        (valorElastica * pow(cuerda, 2) + valorMasa * gravity * cuerda) /
          Inercia
      );
      gamma = valorAmortiguamiento / (2 * Inercia);
      Periodo = TWO_PI / W0;
      Frecuencia = 1 / Periodo;

      fill(0);
      noStroke();

      //Subamortiguado.
      if (pow(gamma, 2) < pow(W0, 2)) {
        W = sqrt(pow(W0, 2) - pow(gamma, 2));

        if ((anguloTemp>0 && velocityAngle<0) || (anguloTemp<0 && velocityAngle>0)) {
          Phi = Math.abs(atan((-1 * (velocityAngle / anguloTemp) - gamma) / W));
        }
        if ((anguloTemp<0 && velocityAngle<0) || (anguloTemp>0 && velocityAngle>0))  {
          Phi = Math.abs(atan(((velocityAngle / anguloTemp) + gamma) / W));
        }

        PhiAux = Phi;

        if (anguloTemp < 0 && velocityAngle < 0) {
          //cos- sen+ c2
          Phi = Math.PI - Phi;
        }
        if (anguloTemp < 0 && velocityAngle > 0) {
          //cos- sen- c3
          Phi = Math.PI + Phi;
        }
        if (anguloTemp > 0 && velocityAngle > 0) {
          //cos+ sen- c4
          Phi = 2 * Math.PI - Phi;
        }

        C = anguloTemp / cos(Phi);
        banderaSub = 1;
      } else {
        if (pow(gamma.toFixed(3), 2) == pow(W0.toFixed(3), 2)) {
          // Amortiguamiento crítico
          C1 = anguloTemp;
          C2 = velocityAngle + (C1 * gamma);
          //C = C1 + C2;
          banderaCriti = 1;
        } else if (pow(gamma, 2) > pow(W0, 2)) {
          // Sobreamortiguamiento   GAMMA > W0
          M1 = -gamma + Math.sqrt(pow(gamma, 2) - pow(W0, 2));
          M2 = -gamma - Math.sqrt(pow(gamma, 2) - pow(W0, 2));
          C2 = (velocityAngle + (-1*(M1 * anguloTemp))) / ((-1*M1) + M2);
          C1 = anguloTemp - C2;
          //C = C1 + C2;
          banderaSobre = 1;
        } 
      }
    }
    bandera++;

    fill(0);
    noStroke();
    if (banderaSub == 1) {
      

      xt = ((C * pow(2.7182818284, -gamma * t)) / 3) * cos(W * t + Phi);
      vt =
        -gamma * C * pow(2.7182818284, -gamma * t) * cos(W * t + Phi) -
        W * C * pow(2.7182818284, -gamma * t) * sin(W * t + Phi);
      at =
        -pow(gamma, 2) * C * pow(2.7182818284, -gamma * t) * cos(W * t + Phi) +
        2 * W * gamma * C * pow(2.7182818284, -gamma * t) * sin(W * t + Phi) -
        pow(W, 2) * C * pow(2.7182818284, -gamma * t) * cos(W * t + Phi);

        textSize(15);
        let resultado = document.getElementById("Ecuacion");
      
        resultado.innerHTML = "Subamortiguado: " + 
          "X(t)= " +
            C.toFixed(2) +
            "e^(-" +
            gamma.toFixed(3) +
            "*" +
            t.toFixed(3) +
            ") * cos(" +
            W.toFixed(3) +
            " * " +
            t.toFixed(3) +
            " + " +
            Phi.toFixed(3) +
            ")";
        
    }
    if (banderaCriti == 1) {
     

      xt = (C1 + C2 * t) * pow(2.71, -gamma * t);
      vt =
        -gamma * C1 * pow(2.71, -gamma * t) +
        C2 * pow(2.71, -gamma * t) +
        gamma * C2 * t * pow(2.71, -gamma * t);
      at =
        pow(gamma, 2) * C1 * pow(2.71, -gamma * t) +
        pow(gamma, 2) * C2 * t * pow(2.71, -gamma * t);
      //text("Valor de la Amplitud: " + C.toFixed(3), 200, 360);
      let resultado = document.getElementById("Ecuacion");
      resultado.innerHTML = "Criticamente amortiguado: " + 
        "X(t)= (" +
          C1.toFixed(3) +
          " + " +
          C2.toFixed(3) +
          " * " +
          t.toFixed(3) +
          ")* e^(-" +
          gamma.toFixed(3) +
          "*" +
          t.toFixed(3) +
          ")";
    }
    if (banderaSobre == 1) {
      

      xt = C1 * pow(2.71, M1 * t) + (C2 * pow(2.71, M2 * t)) / 100;
      vt = M1 * C1 * pow(2.71, M1 * t) + M2 * C2 * pow(2.71, M2 * t);
      at =
        pow(M1, 2) * C1 * pow(2.71, M1 * t) +
        pow(M2, 2) * C2 * pow(2.71, M2 * t);
      //text("Valor de la Amplitud: " + C.toFixed(3), 200, 360);
      let resultado = document.getElementById("Ecuacion");
      
      resultado.innerHTML = "Sobreamortiguado: " + "X(t)= " +
          C1.toFixed(3) +
          " * e^(" +
          M1.toFixed(3) +
          " * " +
          t.toFixed(3) +
          ") + " +
          C2.toFixed(3) +
          "*e^(" +
          M2.toFixed(3) +
          "*" +
          t.toFixed(3) +
          ")";
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
  anchor = createVector(65, valorLongitudC * 100 + 80);
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
  var Xt = xt; //Cambiarla si es necesario
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
      xaxis: { title: "Tiempo (s)", range: [0, 20] },
      yaxis: { title: "Amplitud (rads)"}, // Ajuste del rango del eje y para alejar las gráficas
      legend: { x: 0, y: 1.2, orientation: "h" },
      margin: { t: 50, b: 50, l: 50, r: 50 },
    };

    // Asegura que la posición inicial sea 0
    tX = 0;

    let positionData = {
      y: [getDataPosition()],
      type: "line",
      name: "Posición",
    };
    let velocityData = {
      y: [getDataVelocity()],
      type: "line",
      name: "Velocidad",
    };
    let acelerationData = {
      y: [getDataAceleration()],
      type: "line",
      name: "Aceleración",
    };

    let plotData = [positionData, velocityData, acelerationData];

    Plotly.newPlot("Movimientos", plotData, layout);

    setInterval(function () {
      if (!pausar) {
        tX += 0.2;
        tV += 0.2;
        tA += 0.2;
        
        // Agrega nuevos datos a los conjuntos de datos
        Plotly.extendTraces("Movimientos", { y: [[getDataPosition()]] }, [0]);
        Plotly.extendTraces("Movimientos", { y: [[getDataVelocity()]] }, [1]);
        Plotly.extendTraces("Movimientos", { y: [[getDataAceleration()]] }, [2]);
        
        // Ajusta el rango del eje x para que se mueva con los datos
        let update = {
          xaxis: { range: [tX, tX + 250] }
        };
        Plotly.relayout("Movimientos", update);

        cnt1 += 0.02;
        if (cnt1 > 200) {
          Plotly.relayout("Movimientos", { xaxis: { range: [cnt1 - 200, cnt1] } });
        }

        // Comprobación para detener el dibujo cuando las 3 gráficas se vuelvan 0
        let isAllZero = plotData.every(data => data.y[0].every(val => val === 0));
        
        if (isAllZero) {
          pausar = true;
          alert("Las gráficas se han vuelto 0. La simulación se ha detenido.");
        }
      }
    }, 15);
  }
}



