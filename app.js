let numerosSeleccionados = [];
const TOTAL_NUMEROS = 10000;
const WHATSAPP_NUMERO = "59167723609";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("gridNumeros");
  if (!grid) return;
  
  let html = "";
  for (let i = 0; i < TOTAL_NUMEROS; i++) {
    let numFormatted = String(i).padStart(4, '0');
    // Se incluye ontouchend y onclick para compatibilidad total con pantallas táctiles de celulares
    html += `<div class="num-card" id="card-${numFormatted}" ontouchend="seleccionarNumero('${numFormatted}'); event.preventDefault();" onclick="seleccionarNumero('${numFormatted}')">${numFormatted}</div>`;
  }
  grid.innerHTML = html;

  // Escuchar cambios en los inputs para validar el botón en tiempo real
  document.getElementById("inputNombre").addEventListener("input", actualizarInterfaz);
  document.getElementById("inputCiudad").addEventListener("input", actualizarInterfaz);
  document.getElementById("inputTelefono").addEventListener("input", actualizarInterfaz);
});

function seleccionarNumero(numero) {
  const index = numerosSeleccionados.indexOf(numero);
  
  if (index > -1) {
    numerosSeleccionados.splice(index, 1);
    const el = document.getElementById(`card-${numero}`);
    if (el) el.classList.remove("selected");
  } else {
    numerosSeleccionados.push(numero);
    const el = document.getElementById(`card-${numero}`);
    if (el) el.classList.add("selected");
  }
  actualizarInterfaz();
}

function actualizarInterfaz() {
  const total = numerosSeleccionados.length;
  const combosCompletos = Math.floor(total / 4);
  const faltantes = total % 4 === 0 ? 0 : 4 - (total % 4);

  const nombre = document.getElementById("inputNombre").value.trim();
  const ciudad = document.getElementById("inputCiudad").value.trim();
  const telefono = document.getElementById("inputTelefono").value.trim();

  const containerSeleccion = document.getElementById("selectedNumbersContainer");
  if (containerSeleccion) {
    if (total === 0) {
      containerSeleccion.innerHTML = "<p class='placeholder-text'>Toca números para armar tus combos</p>";
    } else {
      containerSeleccion.innerHTML = numerosSeleccionados.map(num => `<span class="badge-num">${num}</span>`).join(" ");
    }
  }

  const btnWs = document.getElementById("btnWhatsapp");
  const status = document.getElementById("whatsappStatus");

  if (!btnWs || !status) return;

  const datosCompletos = nombre !== "" && ciudad !== "" && telefono !== "";

  if (!datosCompletos) {
    btnWs.classList.add("disabled");
    status.innerHTML = "⚠️ Por favor, llena tu <strong>Nombre, Ciudad y Teléfono</strong>.";
  } else if (combosCompletos === 0) {
    btnWs.classList.add("disabled");
    status.innerHTML = `Te faltan <strong>${4 - total} números</strong> para completar tu primer combo x4.`;
  } else if (faltantes > 0) {
    btnWs.classList.add("disabled");
    status.innerHTML = `Llevas ${combosCompletos} combo(s). Elige <strong>${faltantes} número(s) más</strong> para completar el combo.`;
  } else {
    btnWs.classList.remove("disabled");
    status.innerHTML = `🎉 ¡Todo listo! Llevas <strong>${combosCompletos} Combo(s) x4</strong>.`;
  }
}

function generarComboAleatorio() {
  let nuevosNumeros = 0;
  while (nuevosNumeros < 4) {
    let randomNum = String(Math.floor(Math.random() * TOTAL_NUMEROS)).padStart(4, '0');
    if (!numerosSeleccionados.includes(randomNum)) {
      numerosSeleccionados.push(randomNum);
      const el = document.getElementById(`card-${randomNum}`);
      if (el) el.classList.add("selected");
      nuevosNumeros++;
    }
  }
  actualizarInterfaz();
}

function limpiarSeleccion() {
  numerosSeleccionados.forEach(num => {
    const el = document.getElementById(`card-${num}`);
    if (el) el.classList.remove("selected");
  });
  numerosSeleccionados = [];
  actualizarInterfaz();
}

function enviarWhatsApp(e) {
  e.preventDefault();
  const total = numerosSeleccionados.length;
  const nombre = document.getElementById("inputNombre").value.trim();
  const ciudad = document.getElementById("inputCiudad").value.trim();
  const telefono = document.getElementById("inputTelefono").value.trim();

  if (total === 0 || total % 4 !== 0 || !nombre || !ciudad || !telefono) return;

  const cantidadCombos = total / 4;
  let mensajeCombos = "";
  for (let i = 0; i < total; i += 4) {
    const combo = numerosSeleccionados.slice(i, i + 4).join(" - ");
    mensajeCombos += `🎟️ *Combo #${(i/4) + 1}:* ${combo}%0A`;
  }

  const mensaje = `Hola! Quiero registrar mi compra en Su Suerte El Socio.%0A%0A👤 *Nombre:* ${nombre}%0A📍 *Ciudad:* ${ciudad}%0A📱 *Teléfono:* ${telefono}%0A%0A🔥 *Total Combos x4:* ${cantidadCombos}%0A${mensajeCombos}%0A💳 Realicé mi pago por Banco Ganadero. Adjunto mi comprobante.`;
  
  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}`;
  window.open(url, "_blank");
}

function filtrarNumeros() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll(".num-card");
  cards.forEach(card => {
    if (card.innerText.includes(query)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}