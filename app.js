// Control de Modales de Información (Ganadores / Premio)
function abrirModalInfo(tipo) {
    const modal = document.getElementById('modalInfo');
    const titulo = document.getElementById('modalInfoTitulo');
    const desc = document.getElementById('modalInfoDesc');
    const img = document.getElementById('modalInfoImg');

    if (tipo === 'ganadores') {
        titulo.innerText = "🏆 Últimos Ganadores";
        desc.innerText = "¡Felicitaciones a nuestros ganadores anteriores!";
        img.src = "ganadores.jpg"; // Reemplaza o conecta con tu Google Sheet si prefieres
    } else {
        titulo.innerText = "🎁 Premio Ofrecido";
        desc.innerText = "Conoce el gran premio de este sorteo.";
        img.src = "premio.jpg"; // Reemplaza o conecta con tu Google Sheet si prefieres
    }

    modal.style.display = 'flex';
    document.body.classList.add('modal-open'); // Fija el fondo en celulares
}

function cerrarModalInfo() {
    document.getElementById('modalInfo').style.display = 'none';
    document.body.classList.remove('modal-open');
}

// Control del Modal de Pago con QR e Instagram
function abrirModalPago() {
    const modal = document.getElementById('modalPago');
    modal.style.display = 'flex';
    document.body.classList.add('modal-open'); // Fija el fondo sin rebote
}

function cerrarModalPago() {
    document.getElementById('modalPago').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function verificarMetodoPago() {
    // Lógica opcional si manejas diferentes métodos de pago
}