// URLs de configuración
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTx3ofaEsx5VvKJyfc7m709ObhI1AHG8zEHC6ppxrIKyG0tHKgT5K17pytj-th9YmGtBA6eZK-DiHmX/pub?output=csv';
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwjw-89xBPNckbtGHDQ8LUmN5hwdo4JDLM1OwIOl97d8zuD43Uk2GVuFcURXRZ8DnE/exec'; 
const TELEFONO_WHATSAPP = '59167723609';

let numerosData = [];
let seleccionados = []; // Almacena todos los números seleccionados

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosDesdeGoogleSheets();
});

function cargarDatosDesdeGoogleSheets() {
    fetch(SHEET_URL)
        .then(response => response.text())
        .then(csvText => {
            const filas = csvText.split('\n');
            numerosData = filas.map((rowStr, index) => {
                if (!rowStr.trim()) return null;
                const columnas = rowStr.split(',');
                let numStr = columnas[0] ? columnas[0].replace(/"/g, '').trim() : String(index);
                let estadoStr = columnas[1] ? columnas[1].replace(/"/g, '').trim() : 'disponible';
                
                if (numStr.toLowerCase() === 'numero' || numStr.toLowerCase() === 'número') return null;
                if (!isNaN(numStr) && numStr.length < 4) numStr = numStr.padStart(4, '0');

                return { numero: numStr, estado: estadoStr };
            }).filter(item => item !== null);

            renderGrid(numerosData);
            actualizarResumen();
        })
        .catch(error => console.error('Error al cargar datos:', error));
}

function renderGrid(data) {
    const gridContainer = document.getElementById('gridContainer');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';

    data.forEach(item => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.innerText = item.numero;

        const estado = item.estado.toLowerCase();

        if (estado === 'vendido' || estado === 'ocupado' || estado === 'apartado') {
            btn.className = 'btn btn-ocupado m-1';
            btn.disabled = true;
        } else if (seleccionados.includes(item.numero)) {
            btn.className = 'btn btn-seleccionado m-1';
            btn.addEventListener('click', () => deseleccionarNumero(item.numero));
        } else {
            btn.className = 'btn btn-disponible m-1';
            btn.addEventListener('click', () => seleccionarNumero(item.numero));
        }

        gridContainer.appendChild(btn);
    });
}

// LÓGICA DE SELECCIÓN INDIVIDUAL
function seleccionarNumero(numero) {
    seleccionados.push(numero);
    renderGrid(numerosData);
    actualizarResumen();
}

function deseleccionarNumero(numero) {
    seleccionados = seleccionados.filter(num => num !== numero);
    renderGrid(numerosData);
    actualizarResumen();
}

// BOTÓN COMBO RÁPIDO: Agrega 1 combo más (4 números disponibles al azar)
function agregarCombo() {
    const disponibles = numerosData
        .filter(item => item.estado.toLowerCase() === 'disponible' && !seleccionados.includes(item.numero))
        .map(item => item.numero);

    if (disponibles.length < 4) {
        alert('No hay suficientes números disponibles para completar un combo de 4.');
        return;
    }

    // Selecciona 4 números aleatorios que no estén en la lista
    const comboNuevo = [];
    while (comboNuevo.length < 4) {
        const randomIndex = Math.floor(Math.random() * disponibles.length);
        const numElegido = disponibles.splice(randomIndex, 1)[0];
        comboNuevo.push(numElegido);
    }

    seleccionados.push(...comboNuevo);
    renderGrid(numerosData);
    actualizarResumen();
}

// ACTUALIZA EL PANEL LATERAL Y MOSTRAR LOS COMBOS ADQUIRIDOS
function actualizarResumen() {
    const totalNumeros = seleccionados.length;
    const totalCombos = Math.floor(totalNumeros / 4);

    const countBadge = document.getElementById('countSeleccionados');
    if (countBadge) countBadge.innerText = `${totalNumeros} Números (${totalCombos} Combo${totalCombos !== 1 ? 's' : ''})`;

    const containerBadges = document.getElementById('listaSeleccionadosBadges');
    if (containerBadges) {
        containerBadges.innerHTML = '';

        if (totalNumeros === 0) {
            containerBadges.innerHTML = '<span class="small text-secondary">Ningún combo seleccionado</span>';
        } else {
            // Muestra los números en grupos visuales de 4
            for (let i = 0; i < totalNumeros; i += 4) {
                const comboGrupo = seleccionados.slice(i, i + 4);
                const badge = document.createElement('div');
                badge.className = 'badge bg-warning text-dark p-2 me-1 mb-1 border border-dark';
                badge.style.fontSize = '13px';
                badge.innerText = `Combo ${Math.floor(i / 4) + 1}: [ ${comboGrupo.join(' - ')} ]`;
                containerBadges.appendChild(badge);
            }
        }
    }
}

// ENVÍO DE DATOS A GOOGLE SHEETS Y WHATSAPP
function enviarYGuardarEnGoogleSheets() {
    if (seleccionados.length === 0) {
        alert('Por favor selecciona al menos un combo de números.');
        return;
    }

    const totalCombos = Math.floor(seleccionados.length / 4);
    const nombre = document.getElementById('txtNombre')?.value || 'Cliente';
    const ciudad = document.getElementById('txtCiudad')?.value || 'No especificada';
    const metodoPago = document.getElementById('selectPago')?.value || 'QR';

    const textoNumeros = seleccionados.join(', ');
    const mensaje = encodeURIComponent(
        `¡Hola! Deseo confirmar mi participación en la rifa:\n\n` +
        `👤 *Nombre:* ${nombre}\n` +
        `📍 *Ciudad:* ${ciudad}\n` +
        `💳 *Método de pago:* ${metodoPago}\n` +
        `📦 *Combos:* ${totalCombos} (${seleccionados.length} números)\n` +
        `🔢 *Números:* ${textoNumeros}`
    );

    const whatsappUrl = `https://wa.me/${TELEFONO_WHATSAPP}?text=${mensaje}`;

    // Envío a Google Apps Script para cambiar a "vendido"
    fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ numeros: seleccionados })
    })
    .then(() => console.log('Enviado a Google Sheets'))
    .catch(err => console.error('Error enviando datos:', err));

    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');

    // Limpiar selección local y actualizar
    seleccionados = [];
    actualizarResumen();
    setTimeout(cargarDatosDesdeGoogleSheets, 3000);
}