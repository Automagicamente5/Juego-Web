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

const casilla1 = {
    posX: 3,
    posY: 4,
    simbolo: "🟨",
    usado: false
}

const casilla2 = {
    posX: 5,
    posY: 4,
    simbolo: "🟪",
    usado: false
}

const casilla3 = {
    posX: 7,
    posY: 7,
    simbolo: "🟦",
    usado: false
}

const juego = {
    idTimeout: null,
    idIntervalo: null,
    tiempoActivacion: 0,
}

/**
 * Inicia el programa de la app web
 */
function main() {
    crearTablero();
    document.addEventListener('keydown', manejarEventoTeclado);
}


main();


/**
 * Inicia la activacion de la casilla especial
 */
function iniciarActivacionCasillaEspecial(casillaEspecial) {
    if (verificarPosEnCasillaEspecial(casillaEspecial) && !juego.idIntervalo) {
        document.querySelector("#info-tiempo-activacion").style.visibility = "visible";
        document.querySelector("#info-tiempo-activacion>span").style.color = "red";

        iniciarIntervaloJuego(casillaEspecial);
        juego.idTimeout = setTimeout(() => {
            console.log("activando"); //cualquier algoritmo
            clearInterval(juego.idIntervalo);
            juego.idIntervalo = null;

            juego.idTimeout = null;
            juego.tiempoActivacion = 0;
            document.querySelector("#info-tiempo-activacion").style.color = "green";
            document.querySelector("#info-tiempo-activacion>span").style.color = "";
            setTimeout(() => {
                document.querySelector("#info-tiempo-activacion>span").innerHTML = juego.tiempoActivacion.toFixed(2);
                document.querySelector("#info-tiempo-activacion").style.visibility = "hidden";
                document.querySelector("#info-tiempo-activacion").style.color = "white";
            }, 1000);
            casillaEspecial.usado = true;
            casillaEspecial.simbolo = SIMB_CASILLA_ACTIVADA;
        }, 3000);
    }
}

/**
 * Inicia el intervalo para verificaciones del juego
 */
function iniciarIntervaloJuego(casillaEspecial) {
    juego.idIntervalo = setInterval(() => {
        if (!casillaEspecial.usado) {
            if (juego.idTimeout) {
                evaluarActivacionCasillaEspecial(casillaEspecial);
            }
        }
        console.log("asdsa");

    }, TIEMPO_INTERVALO_JUEGO);
}

/**
 * Evalua el estado de activacion para la casilla especial
 */
function evaluarActivacionCasillaEspecial(casillaEspecial) {
    if (!verificarPosEnCasillaEspecial(casillaEspecial)) {
        console.log("fuera de casilla especial"); //cualquier algoritmo
        document.querySelector("#info-tiempo-activacion").style.visibility = "hidden";
        clearTimeout(juego.idTimeout);
        clearInterval(juego.idIntervalo);
        juego.idTimeout = null;
        juego.idIntervalo = null;
        juego.tiempoActivacion = 0;
    } else {
        juego.tiempoActivacion += TIEMPO_INTERVALO_JUEGO / 1000;
        document.querySelector("#info-tiempo-activacion>span").innerHTML = juego.tiempoActivacion.toFixed(2);
    }
}



/**
 * Revisa si las coordenadas del jugador son iguales a las del item especial
 * @returns true si el jugador esta en la casilla especial, false caso contrario
 */
function verificarPosEnCasillaEspecial(casillaEspecial) {
    return jugador.posX === casillaEspecial.posX && jugador.posY === casillaEspecial.posY;
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
    agregarEntidades();
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

    if (!casilla1.usado) {
        iniciarActivacionCasillaEspecial(casilla1);
    }else if(!casilla2.usado){
        iniciarActivacionCasillaEspecial(casilla2);
    }else if(!casilla3.usado){
        iniciarActivacionCasillaEspecial(casilla3);
    }


    agregarEntidades();
}


function agregarEntidades() {
    actualizarCasillaHTML(casilla1.posX, casilla1.posY, casilla1.simbolo);
    actualizarCasillaHTML(casilla2.posX, casilla2.posY, casilla2.simbolo);
    actualizarCasillaHTML(casilla3.posX, casilla3.posY, casilla3.simbolo);
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
