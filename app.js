const ID_TABLERO_HTML = "#tablero";
const MAX_FILAS = 10;
const MAX_COL = 10;
const SIMB_CASILLA_DEF = "";

const MOVIMIENTO_ARRIBA = "w";
const MOVIMIENTO_IZQUIERDA = "a";
const MOVIMIENTO_ABAJO = "s";
const MOVIMIENTO_DERECHA = "d";

const jugador = {
    posX: 0,
    posY: 0,
    simbolo: "🤖"
}

const item = {
    posX: 3,
    posY: 4,
    simbolo: "🟨"
}

/**
 * Inicia el programa de la app web
 */
function main() {
    crearTablero();
    document.addEventListener('keydown', manejarEventoTeclado);
    actualizarCasillaHTML(item.posX, item.posY, item.simbolo);
}

main();

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
    let contador = 0;

/**
 * Detecta la presion de alguna tecla
 * @param {KeyboardEvent} evento de presionar alguna tecla
 */
function manejarEventoTeclado(evento) {
    const caracterPresionado = evento.key;
    document.querySelector("#cantidad-turnos").innerHTML++;
    
    actualizarCasillaHTML(SIMB_CASILLA_DEF);
    actualizarPosJugador(caracterPresionado);
    actualizarCasillaHTML(jugador.simbolo);
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
