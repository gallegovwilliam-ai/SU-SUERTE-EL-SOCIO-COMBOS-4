// Control del Modal de Pago con QR e Instagram
function abrirModalPago() {
    const modal = document.getElementById('modalPago');
    if (modal) {
        modal.style.display = 'flex';
        document.body.classList.add('modal-open'); // Fija el fondo sin rebote en celular
    }
}

function cerrarModalPago() {
    const modal = document.getElementById('modalPago');
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}