/**
 * Helper para respuestas HTTP estándar
 * Garantiza consistencia en todas las respuestas de la API
 */

/**
 * Respuesta exitosa
 * @param {Object} data - Datos a retornar
 * @param {String} message - Mensaje opcional
 * @returns {Object}
 */
const success = (data = null, message = "Operación exitosa") => {
    return {
        ok: true,
        message,
        data
    };
};

/**
 * Respuesta de error
 * @param {String} message - Mensaje de error
 * @param {String} error - Error detallado (opcional)
 * @param {Number} statusCode - Código de estado HTTP
 * @returns {Object}
 */
const error = (message = "Error en la operación", errorDetail = null, statusCode = 400) => {
    return {
        ok: false,
        message,
        error: errorDetail,
        statusCode
    };
};

/**
 * Respuesta paginada
 * @param {Array} data - Datos paginados
 * @param {Number} total - Total de registros
 * @param {Number} page - Página actual
 * @param {Number} limit - Límite por página
 * @returns {Object}
 */
const paginated = (data, total, page = 1, limit = 10) => {
    return {
        ok: true,
        message: "Datos obtenidos exitosamente",
        data,
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        }
    };
};

module.exports = {
    success,
    error,
    paginated
};
