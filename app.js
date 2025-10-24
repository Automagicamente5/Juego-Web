const ID_TABLERO_HTML = "#tablero";
const ID_P_INFO_TIEMPO_ACTIVACION = "#info-tiempo-activacion";

const MAX_FILAS = 10;
const MAX_COL = 10;
const SIMB_CASILLA_DEF = "";

const MOVIMIENTO_ARRIBA = "w";
const MOVIMIENTO_IZQUIERDA = "a";
const MOVIMIENTO_ABAJO = "s";
const MOVIMIENTO_DERECHA = "d";
const TIEMPO_INTERVALO_JUEGO = 100;
const TIEMPO_ACTIVACION_CASILLA = 3000;
const TIEMPO_REINICIO_INFO_ACTIVACION = 1000;

const SIMB_CASILLA_ACTIVADA = "❇️";

const COLOR_TIEMPO_TXT_DEF = "white";
const COLOR_TIEMPO_TXT_ACTIVO = "red";
const COLOR_TIEMPO_TXT_COMPLETADO = "green";

const COLOR_SEG_ACTIVACION_DEF = "";

const INFO_TIEMPO_TXT_DEF = "hidden";
const INFO_TIEMPO_TXT_ACTIVO = "visible";


const TIEMPO_ACTV_CANT_DECIMALES = 4;


const jugador = {
    posX: 0,
    posY: 4,
    simbolo: "🤖"
}

const enemigo = {
    posX: 3,
    posY: 9,
    simbolo: "👽",
    dirY: -1,
    etapa: 1,
    idIntervalo: null,
}

const casilla1 = {
    posX: 9,
    posY: 4,
    simbolo: "🟨",
    usado: false,
}

const casilla2 = {
    posX: 0,
    posY: 0,
    simbolo: "🟪",
    usado: false
}

/* const casilla3 = {
    posX: 7,
    posY: 7,
    simbolo: "🟦",
    usado: false
} */

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
    agregarEntidadesHTML();
    document.addEventListener('keydown', manejarEventoTeclado);
    enemigo.idIntervalo = setInterval(() => {
        actualizarCasillaHTML(enemigo.posX, enemigo.posY, SIMB_CASILLA_DEF);
        switch (enemigo.etapa) {
            case 1:
                enemigo.posY += enemigo.dirY;
                break;
            case 2:
                enemigo.posY -= enemigo.dirY;
                break;
            case 3:
                let difY = enemigo.posY - jugador.posY;
                let difX = enemigo.posX - jugador.posX;

                if (difY) {
                    enemigo.posY += (difY > 0) ? -1 : 1;
                }
                if (difX) {
                    enemigo.posX += (difX > 0) ? -1 : 1;
                }
        }
        actualizarCasillaHTML(enemigo.posX, enemigo.posY, enemigo.simbolo);
        if (enemigo.posY === 0 || enemigo.posY === 9) {
            enemigo.dirY *= -1;
        }
        if (enemigo.posX === jugador.posX && enemigo.posY === jugador.posY) {
            //alert("perdiste! :(");
            document.removeEventListener('keydown', manejarEventoTeclado);
            clearInterval(enemigo.idIntervalo);
            document.querySelector("h1").innerHTML = "GAME OVER :(";
            document.querySelector("h1").style.color = "red";
        }
    }, 1000);
}


main();


/**
 * Inicia la activacion de la casilla especial
 * @param {Object} casillaEspecial a activar
 */
function iniciarActivacionDe(casillaEspecial) {
    if (verificarPosDeJugadorEn(casillaEspecial) && !juego.idIntervalo) {
        document.querySelector(ID_P_INFO_TIEMPO_ACTIVACION).style.visibility = INFO_TIEMPO_TXT_ACTIVO;
        document.querySelector(ID_P_INFO_TIEMPO_ACTIVACION + ">span").style.color = COLOR_TIEMPO_TXT_ACTIVO;

        iniciarRevisionDe(casillaEspecial);
        juego.idTimeout = setTimeout(activarCasilla, TIEMPO_ACTIVACION_CASILLA, casillaEspecial);
        if (enemigo.etapa === 2) {
            enemigo.etapa++;
        }
    }
}


/**
 * Activa la casilla especial
 * @param {Object} casillaEspecial a activar
 */
function activarCasilla(casillaEspecial) {
    const pInfoTiempoActivacion = document.querySelector(ID_P_INFO_TIEMPO_ACTIVACION);
    const spanTiempoActivacion = document.querySelector(ID_P_INFO_TIEMPO_ACTIVACION + ">span");
    reiniciarEsadosActivacion();
    pInfoTiempoActivacion.style.color = COLOR_TIEMPO_TXT_COMPLETADO;
    spanTiempoActivacion.style.color = COLOR_SEG_ACTIVACION_DEF;
    setTimeout(reiniciarInfoTiempoActivacionHTML, TIEMPO_REINICIO_INFO_ACTIVACION, pInfoTiempoActivacion, spanTiempoActivacion);
    casillaEspecial.usado = true;
    casillaEspecial.simbolo = SIMB_CASILLA_ACTIVADA;
    enemigo.etapa++;
    if (enemigo.etapa === 2) {
        actualizarCasillaHTML(enemigo.posX, enemigo.posY, SIMB_CASILLA_DEF);
        enemigo.posX = 7;
        actualizarCasillaHTML(enemigo.posX, enemigo.posY, enemigo.simbolo);
    } else if (enemigo.etapa > 3) {
        clearInterval(enemigo.idIntervalo);
        document.querySelector("h1").innerHTML = "GANASTE! :D";
        document.querySelector("h1").style.color = "green";
    }
}

/**
 * reinicia la informacion del timepo de activacion en el HTML
 */
function reiniciarInfoTiempoActivacionHTML(pInfoTiempoActivacion, spanTiempoActivacion) {
    spanTiempoActivacion.innerHTML = juego.tiempoActivacion.toFixed(TIEMPO_ACTV_CANT_DECIMALES);
    pInfoTiempoActivacion.style.visibility = INFO_TIEMPO_TXT_DEF;
    pInfoTiempoActivacion.style.color = COLOR_TIEMPO_TXT_DEF;
}

/**
 * Inicia la revision para la activacion de la casilla especial
 * @param {Object} casillaEspecial a revisar
 */
function iniciarRevisionDe(casillaEspecial) {
    juego.idIntervalo = setInterval(() => {
        if (!casillaEspecial.usado) {
            if (juego.idTimeout) {
                evaluarActivacionCasillaEspecial(casillaEspecial);
            }
        }
    }, TIEMPO_INTERVALO_JUEGO);
}

/**
 * Evalua el estado de activacion para la casilla especial
 * @param {Object} casillaEspecial a activar
 */
function evaluarActivacionCasillaEspecial(casillaEspecial) {
    if (!verificarPosDeJugadorEn(casillaEspecial)) {
        document.querySelector(ID_P_INFO_TIEMPO_ACTIVACION).style.visibility = INFO_TIEMPO_TXT_DEF;
        clearTimeout(juego.idTimeout);
        reiniciarEsadosActivacion();
    } else {
        juego.tiempoActivacion += TIEMPO_INTERVALO_JUEGO / 1000;
        document.querySelector(ID_P_INFO_TIEMPO_ACTIVACION + ">span").innerHTML = reducirDecimalesTiempoActivacion();
    }
}


/**
 * Reinicia los estados para la activacion de una casilla especial
 */
function reiniciarEsadosActivacion() {
    clearInterval(juego.idIntervalo);
    juego.idTimeout = null;
    juego.idIntervalo = null;
    juego.tiempoActivacion = 0;
}

/**
 * Reduce a la cantidad de decimales del tiempo de activacion
 * @returns tiempo de activacion con los decimales limitados
 */
function reducirDecimalesTiempoActivacion() {
    return juego.tiempoActivacion.toFixed(TIEMPO_ACTV_CANT_DECIMALES);
}

/**
 * Revisa si las coordenadas del jugador son iguales a las del item especial
 * @returns true si el jugador esta en la casilla especial, false caso contrario
 */
function verificarPosDeJugadorEn(casillaEspecial) {
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
    evaluarActivacionCasillasEspeciales();
    agregarEntidadesHTML();
}

/**
 * Evalua la activacion de las casillas especiales
 */
function evaluarActivacionCasillasEspeciales() {
    if (!casilla1.usado) {
        iniciarActivacionDe(casilla1);
    } else if (!casilla2.usado) {
        iniciarActivacionDe(casilla2);
    } /* else if (!casilla3.usado) {
        iniciarActivacionDe(casilla3);
    } */
}

/**
 * Agrega entidades al tablero HTML
 */
function agregarEntidadesHTML() {
    actualizarCasillaHTML(casilla1.posX, casilla1.posY, casilla1.simbolo);
    actualizarCasillaHTML(casilla2.posX, casilla2.posY, casilla2.simbolo);
    //actualizarCasillaHTML(casilla3.posX, casilla3.posY, casilla3.simbolo);
    actualizarCasillaHTML(jugador.posX, jugador.posY, jugador.simbolo);
    actualizarCasillaHTML(enemigo.posX, enemigo.posY, enemigo.simbolo);
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
