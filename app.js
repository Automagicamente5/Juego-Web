const jugador = {
    posX: 0,
    posY: 0,
    simbolo: "J"
}

function crearTablero() {
    let divTablero = document.querySelector("#tablero");

    for (let fila = 0; fila < 10; fila++) {
        divTablero.innerHTML += `<div id="fila-${fila}" class="fila"></div>`
        for (let col = 0; col < 10; col++) {
            document.querySelector(`#fila-${fila}`).innerHTML += `
                <div id="pos-${fila}-${col}" class="casilla">
                    <p></p>
                </div>
            `;
        }
    }

    document.querySelector(`#pos-${jugador.posY}-${jugador.posX}>p`).innerHTML = jugador.simbolo;
}

crearTablero()




/**
 * Detecta la presion de alguna tecla
 * @param {Event} evento de presionar alguna tecla
 */
function manejarEventoTeclado(evento) {
    const caracterPresionado = evento.key;
    console.log(`Se ha presionado la tecla: ${caracterPresionado}`);

    document.querySelector(`#pos-${jugador.posY}-${jugador.posX}>p`).innerHTML = "";
    switch (caracterPresionado) {
        case "w":
            jugador.posY--;
            break;
        case "a":
            jugador.posX--;
            break;
        case "s":
            jugador.posY++;
            break;
        case "d":
            jugador.posX++;
            break;
    }
    document.querySelector(`#pos-${jugador.posY}-${jugador.posX}>p`).innerHTML = jugador.simbolo;

}

// Agrega el listener al input
document.addEventListener('keydown', manejarEventoTeclado);