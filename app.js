let numerosSeleccionados = [];
const TOTAL_NUMEROS = 10000;
const WHATSAPP_NUMERO = "59167723609";

// Cargar del 0000 al 9999 dinámicamente
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
    // Seleccionar si aún no llega a 4
    if (numerosSeleccionados.length < 4) {
      numerosSeleccionados.push(numero);
      document.getElementById(`card-${numero}`).classList.add("selected");
    } else {
      alert("¡Ya seleccionaste tus 4 números! Si deseas cambiar uno, toca un número seleccionado para quitarlo.");
    }
  }
  actualizarInterfaz();
}

function actualizarInterfaz() {
  for (let i = 0; i < 4; i++) {
    const slot = document.getElementById(`num${i + 1}`);
    slot.innerText = numerosSeleccionados[i] ? numerosSeleccionados[i] : "____";
  }

  const btnWs = document.getElementById("btnWhatsapp");
  const status = document.getElementById("whatsappStatus");

  if (numerosSeleccionados.length === 4) {
    btnWs.classList.remove("disabled");
    status.innerText = "¡Combo Completo! Toca el botón para enviar tu pedido:";
  } else {
    btnWs.classList.add("disabled");
    status.innerText = `Llevas ${numerosSeleccionados.length} de 4 números seleccionados`;
  }
}

function generarComboAleatorio() {
  // Limpiar selección previa
  numerosSeleccionados.forEach(num => {
    const el = document.getElementById(`card-${num}`);
    if (el) el.classList.remove("selected");
  });
  numerosSeleccionados = [];

  // Elegir 4 números al azar
  while (numerosSeleccionados.length < 4) {
    let randomNum = String(Math.floor(Math.random() * TOTAL_NUMEROS)).padStart(4, '0');
    if (!numerosSeleccionados.includes(randomNum)) {
      numerosSeleccionados.push(randomNum);
      const el = document.getElementById(`card-${randomNum}`);
      if (el) el.classList.add("selected");
    }
  }
  actualizarInterfaz();
}

function enviarWhatsApp(e) {
  e.preventDefault();
  if (numerosSeleccionados.length !== 4) return;

  const comboTexto = numerosSeleccionados.join(" - ");
  const mensaje = `Hola! Quiero apartar mi COMBO X4 en Su Suerte El Socio.%0A%0A🎟️ *Mis números elegidos:* ${comboTexto}%0A💳 Realizaré el pago por Banco Ganadero. Adjunto mi comprobante.`;
  
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