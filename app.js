const ID_TABLERO_HTML = "#tablero";
const MAX_FILAS = 10;
const MAX_COL = 10;
const SIMB_CASILLA_DEF = "";

const MOVIMIENTO_ARRIBA = "w";
const MOVIMIENTO_IZQUIERDA = "a";
const MOVIMIENTO_ABAJO = "s";
const MOVIMIENTO_DERECHA = "d";
const TIEMPO_INTERVALO_JUEGO = 100;
const SIMB_CASILLA_ACTIVADA = "❇️";

const jugador = {
    posX: 0,
    posY: 0,
    simbolo: "🤖"
}

const item = {
    posX: 3,
    posY: 4,
    simbolo: "🟨",
    usado: false
}

const juego = {
    idTimeout : null,
    tiempoActivacion : 0,
}

/**
 * Inicia el programa de la app web
 */
function main() {
    crearTablero();
    document.addEventListener('keydown', manejarEventoTeclado);
    iniciarIntervaloJuego();
}


main();


/**
 * Inicia el intervalo para verificaciones del juego
 */
function iniciarIntervaloJuego() {
    setInterval(() => {
        if (!item.usado) {
            if (!juego.idTimeout) {
                iniciarActivacionCasillaEspecial();
            } else {
                evaluarActivacionCasillaEspecial();
            }
        }
    }, TIEMPO_INTERVALO_JUEGO);
}

/**
 * Evalua el estado de activacion para la casilla especial
 */
function evaluarActivacionCasillaEspecial() {
    if (!verificarPosEnCasillaEspecial()) {
        console.log("fuera de casilla especial"); //cualquier algoritmo
        document.querySelector("#info-tiempo-activacion").style.visibility = "hidden";
        clearInterval(juego.idTimeout);
        juego.idTimeout = null;
        juego.tiempoActivacion = 0;
    } else {
        juego.tiempoActivacion+= TIEMPO_INTERVALO_JUEGO/1000;
        document.querySelector("#info-tiempo-activacion>span").innerHTML = juego.tiempoActivacion.toFixed(2);
    }
}

/**
 * Inicia la activacion de la casilla especial
 */
function iniciarActivacionCasillaEspecial() {
    if (verificarPosEnCasillaEspecial()) {
        document.querySelector("#info-tiempo-activacion").style.visibility = "visible";
        juego.idTimeout = setTimeout(() => {
            console.log("activando"); //cualquier algoritmo
            juego.idTimeout = null;
            juego.tiempoActivacion = 0;
            item.usado = true;
            item.simbolo = SIMB_CASILLA_ACTIVADA;
        }, 3000);
    }
}

/**
 * Revisa si las coordenadas del jugador son iguales a las del item especial
 * @returns true si el jugador esta en la casilla especial, false caso contrario
 */
function verificarPosEnCasillaEspecial() {
    return jugador.posX === item.posX && jugador.posY === item.posY;
}

/**
 * Crea el tablero en la app web
 */
function crearTablero() {
    let divTablero = document.querySelector(ID_TABLERO_HTML);
    for (let fila = 0; fila < MAX_FILAS; fila++) {
        divTablero.innerHTML += generarFilaHtml(fila);
        for (let col = 0; col < MAX_COL; col++) {
            agregarCasilla(fila, col);
        }
    }
    actualizarCasillaHTML(item.posX, item.posY, item.simbolo);
    actualizarCasillaHTML(jugador.posX, jugador.posY, jugador.simbolo);
}


/**
 * Agrega una casilla en la fila y columna correspondiente
 * @param {Number} numFila a agregar casilla
 * @param {Number} numCol a agregar casilla
 */
function agregarCasilla(numFila, numCol) {
    document.querySelector(`#fila-${numFila}`).innerHTML += `
                <div id="pos-${numFila}-${numCol}" class="casilla">
                    <p></p>
                </div>
            `;
}

/**
 * Genera el html para una fila
 * @param {Number} numFila actual a generar
 * @returns html necesario para generar una fila
 */
function generarFilaHtml(numFila) {
    return `<div id="fila-${numFila}" class="fila"></div>`;
}



/**
 * Detecta la presion de alguna tecla
 * @param {KeyboardEvent} evento de presionar alguna tecla
 */
function manejarEventoTeclado(evento) {
    const caracterPresionado = evento.key;
    document.querySelector("#cantidad-turnos").innerHTML++;

    actualizarCasillaHTML(jugador.posX, jugador.posY, SIMB_CASILLA_DEF);
    actualizarPosJugador(caracterPresionado);
    actualizarCasillaHTML(item.posX, item.posY, item.simbolo);
    actualizarCasillaHTML(jugador.posX, jugador.posY, jugador.simbolo);
}


/**
 * Actualiza las coordenadas del jugador
 * @param {String} caracterPresionado por el usuario
 */
function actualizarPosJugador(caracterPresionado) {
    switch (caracterPresionado.toLowerCase()) {
        case MOVIMIENTO_ARRIBA:
            jugador.posY--;
            break;
        case MOVIMIENTO_IZQUIERDA:
            jugador.posX--;
            break;
        case MOVIMIENTO_ABAJO:
            jugador.posY++;
            break;
        case MOVIMIENTO_DERECHA:
            jugador.posX++;
            break;
    }
}

/**
 * Actualiza la casilla con el nuevoSimbolo
 * @param {Number} posX de la casilla
 * @param {Number} posY de la casilla
 * @param {String} nuevoSimbolo a actualizar
 */
function actualizarCasillaHTML(posX, posY, nuevoSimbolo = "def") {
    document.querySelector(`#pos-${posY}-${posX}>p`).innerHTML = nuevoSimbolo;
}
