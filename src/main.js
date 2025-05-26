import './style.css'
// variable globales
let palabraSecreta = '';
let pista = '';
let letrasUsadas = [];
let errores = 0;
const maxErrores = 6;

// declaración de elementos del DOM
const palabraEl = document.getElementById('palabra');
const pistaEl = document.getElementById('pista');
const letrasUsadasEl = document.getElementById('letras-usadas');
const mensajeEl = document.getElementById('mensaje');
const inputLetra = document.getElementById('input-letra');
const formLetra = document.getElementById('form-letra');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const botonReiniciar = document.getElementById('reiniciar');

// carga palabra aleatoria desde la "API"
async function obtenerPalabraDeAPI() {
  try {
    const res = await fetch('https://api.jsonbin.io/v3/b/682e1f2a8960c979a59eb0a3'); // Api casera: (https://jsonbin.io/)
    const data = await res.json();
    const palabras = data.record;
    const aleatoria = palabras[Math.floor(Math.random() * palabras.length)];

    palabraSecreta = aleatoria.palabra.toUpperCase();
    pista = aleatoria.pista;
    letrasUsadas = [];
    errores = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    mostrarPista();
    mostrarPalabra();
    actualizarLetrasUsadas();
    mensajeEl.textContent = '';
  } catch (error) {
    mensajeEl.textContent = "No se pudo cargar la palabra 😢";
  }
}

function mostrarPista() {
  pistaEl.textContent = `Pista: ${pista}`;
}

function mostrarPalabra() {
  const palabraMostrada = palabraSecreta
    .split('')
    .map(letra => (letrasUsadas.includes(letra) ? letra : "_"))
    .join(' ');
  palabraEl.textContent = palabraMostrada;

  if (!palabraMostrada.includes("_")) {
    mensajeEl.textContent = "🎉 ¡Ganaste, dev crack!";
    inputLetra.disabled = true;
  }
}

function actualizarLetrasUsadas() {
  letrasUsadasEl.textContent = letrasUsadas.join(', ');
}

function dibujarAhorcado() {
  switch (errores) {
    case 1: // base
      ctx.beginPath();
      ctx.moveTo(10, 240);
      ctx.lineTo(190, 240);
      ctx.stroke();
      break;
    case 2: // poste
      ctx.beginPath();
      ctx.moveTo(50, 240);
      ctx.lineTo(50, 20);
      ctx.lineTo(140, 20);
      ctx.lineTo(140, 40);
      ctx.stroke();
      break;
    case 3: // cabeza
      ctx.beginPath();
      ctx.arc(140, 60, 20, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 4: // cuerpo
      ctx.beginPath();
      ctx.moveTo(140, 80);
      ctx.lineTo(140, 150);
      ctx.stroke();
      break;
    case 5: // brazo izq y der
      ctx.beginPath();
      ctx.moveTo(140, 100);
      ctx.lineTo(120, 130);
      ctx.moveTo(140, 100);
      ctx.lineTo(160, 130);
      ctx.stroke();
      break;
    case 6: // pierna izq y der + game over
      ctx.beginPath();
      ctx.moveTo(140, 150);
      ctx.lineTo(120, 190);
      ctx.moveTo(140, 150);
      ctx.lineTo(160, 190);
      ctx.stroke();
      mensajeEl.textContent = `💀 Perdiste. La palabra era: ${palabraSecreta}`;
      inputLetra.disabled = true;
      break;
  }
}

// captura de letra ingresada
formLetra.addEventListener('submit', (e) => {
  e.preventDefault();
  const letra = inputLetra.value.toUpperCase();

  if (!letra.match(/^[A-ZÑ]$/)) {
    mensajeEl.textContent = "Ingresá una letra válida (A-Z)";
    return;
  }

  if (letrasUsadas.includes(letra)) {
    mensajeEl.textContent = "Ya usaste esa letra 😅";
    return;
  }

  letrasUsadas.push(letra);
  mensajeEl.textContent = "";
  actualizarLetrasUsadas();

  if (palabraSecreta.includes(letra)) {
    mostrarPalabra();
  } else {
    errores++;
    dibujarAhorcado();
  }

  inputLetra.value = "";
  inputLetra.focus();
});

// botn para reiniciar el juego
botonReiniciar.addEventListener('click', () => {
  inputLetra.disabled = false;
  obtenerPalabraDeAPI();
  inputLetra.focus();
});

// carga la primera palabra al inicio
obtenerPalabraDeAPI();
