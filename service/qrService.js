let codigoActual = null;
let tiempoExpira = 60; // segundos

function generarCodigo() {
    const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();

    codigoActual = {
        codigo,
        expira_en: tiempoExpira,
        creado: Date.now()
    };
}

// Generar el primer código
generarCodigo();

// Temporizador que actualiza expira_en cada segundo
setInterval(() => {
    if (!codigoActual) return;

    const segundosPasados = Math.floor((Date.now() - codigoActual.creado) / 1000);
    const restante = tiempoExpira - segundosPasados;

    if (restante <= 0) {
        generarCodigo(); // generar uno nuevo
    } else {
        codigoActual.expira_en = restante;
    }
}, 1000);

module.exports = {
    getCodigoActual: () => ({
        codigo: codigoActual.codigo,
        expira_en: codigoActual.expira_en
    }),

    validarCodigo: (codigo) =>
        codigo === codigoActual.codigo
};