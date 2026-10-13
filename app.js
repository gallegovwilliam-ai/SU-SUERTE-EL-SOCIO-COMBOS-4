const TOTAL_NUMEROS = 10000;
let seleccionados = [];

document.addEventListener('DOMContentLoaded', () => {
    generarGrilla();
});

function generarGrilla() {
    const contenedor = document.getElementById('grilla-numeros');
    contenedor.innerHTML = '';

    // Usamos un fragmento para optimizar el rendimiento en móviles
    const fragmento = document.DocumentFragment ? document.createDocumentFragment() : document.createElement('div');

    // Generamos los números del 0000 al 9999
    for (let i = 0; i < TOTAL_NUMEROS; i++) {
        let numStr = i.toString().padStart(4, '0');
        
        let btn = document.createElement('button');
        btn.className = 'num-btn';
        btn.id = `num-${numStr}`;
        btn.innerText = numStr;
        btn.onclick = () => toggleNumero(numStr, btn);

        fragmento.appendChild(btn);
    }

    contenedor.appendChild(fragmento);
}

function toggleNumero(n