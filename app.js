¡Excelente idea! Permitir que el cliente compre múltiples combos x4 en la misma transacción incrementará el valor medio de cada compra y les dará aún más oportunidades de ganar.

Para implementar esto en tu código, la lógica cambiará para que la selección se gestione en módulos o paquetes de 4 en 4 (ejemplo: 4 números = 1 combo, 8 números = 2 combos, 12 números = 3 combos, etc.). El botón flotante de WhatsApp indicará exactamente cuántos combos lleva acumulados el usuario.

Código Actualizado para Permitir Varios Combos
Reemplaza la lógica en tu archivo app.js (y ajusta el mensaje en index.html) con la siguiente versión:

1. Lógica JavaScript (app.js)
JavaScript
let numerosSeleccionados = [];
const TOTAL_NUMEROS = 10000;
const WHATSAPP_NUMERO = "59167723609";

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("gridNumeros");
  let html = "";
  for (let i = 0; i < TOTAL_NUMEROS; i++) {
    let numFormatted = String(i).padStart(4, '0');
    html += `<div class="num-card" id="card-${numFormatted}" onclick="seleccionarNumero('${numFormatted}')">${numFormatted}</div>`;
  }
  grid.innerHTML = html;
});

function seleccionarNumero(numero) {
  const index = numerosSeleccionados.indexOf(numero);
  
  if (index > -1) {
    // Deseleccionar
    numerosSeleccionados.splice(index, 1);
    document.getElementById(`card-${numero}`).classList.remove("selected");
  } else {
    // Seleccionar sin límite (múltiples combos)
    numerosSeleccionados.push(numero);
    document.getElementById(`card-${numero}`).classList.add("selected");
  }
  actualizarInterfaz();
}

function actualizarInterfaz() {
  const total = numerosSeleccionados.length;
  const combosCompletos = Math.floor(total / 4);
  const faltantes = total % 4 === 0 ? 0 : 4 - (total % 4);

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

  if (combosCompletos > 0 && faltantes === 0) {
    btnWs.classList.remove("disabled");
    status.innerHTML = `🎉 ¡Llevas <strong>${combosCompletos} Combo(s) x4</strong> (${total} números en total)!`;
  } else if (combosCompletos > 0 && faltantes > 0) {
    btnWs.classList.add("disabled");
    status.innerHTML = `Llevas ${combosCompletos} combo(s). Elige <strong>${faltantes} número(s) más</strong> para completar otro combo.`;
  } else {
    btnWs.classList.add("disabled");
    status.innerHTML = `Seleccionados: ${total} de 4. ¡Te faltan <strong>${4 - total} números</strong> para tu primer combo!`;
  }
}

function generarComboAleatorio() {
  // Añadir 4 números aleatorios a los ya seleccionados
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
  if (total === 0 || total % 4 !== 0) return;

  const cantidadCombos = total / 4;
  
  // Agrupar los números en bloques de 4 para el mensaje de WhatsApp
  let mensajeCombos = "";
  for (let i = 0; i < total; i += 4) {
    const combo = numerosSeleccionados.slice(i, i + 4).join(" - ");
    mensajeCombos += `🎟️ *Combo #${(i/4) + 1}:* ${combo}%0A`;
  }

  const mensaje = `Hola! Quiero confirmar mi compra en Su Suerte El Socio.%0A%0A🔥 *Total Combos x4:* ${cantidadCombos}%0A${mensajeCombos}%0A💳 Realizaré el pago por Banco Ganadero. Adjunto mi comprobante.`;
  
  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}`;
  window.open(url, "_blank");
}