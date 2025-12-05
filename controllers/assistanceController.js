// controllers/assistanceController.js
const Assistance = require("../models/Assistance");
const Worker = require("../models/Worker");
const Shift = require("../models/Shift"); // 👈 IMPORTANTE: Se necesita para buscar el turno
const { Op } = require("sequelize");

/**
 * Calcula la diferencia en minutos entre dos horas 'HH:MM:SS'
 * @param {string} hora1 - Hora de llegada/fin (ej: '10:30:15')
 * @param {string} hora2 - Hora límite/inicio (ej: '09:00:00')
 * @returns {number} Minutos de diferencia, redondeados al minuto superior si es tardanza.
 */
function diffMinutos(hora1, hora2) {
  // Función auxiliar para convertir H:M:S a minutos totales
  const totalMinutos = (horaStr) => {
    // Aseguramos que todas las partes (H, M, S) existan
    // Utilizamos el patrón regex para ser más seguros en la división, aunque split(':') debería funcionar
    const partes = horaStr.split(":").map(Number);
    const h = partes[0] || 0;
    const m = partes[1] || 0;
    const s = partes[2] || 0;
    
    // Devolvemos minutos totales con segundos incluidos como fracción
    return h * 60 + m + s / 60; 
  };
  
  const minutos1 = totalMinutos(hora1); // Hora de marcación (entrada/salida)
  const minutos2 = totalMinutos(hora2); // Hora límite (inicio de turno)

  const diferencia = minutos1 - minutos2;
  
  // Si la diferencia es positiva (tardanza), redondeamos hacia arriba 
  // (ej: 0.1 minutos -> 1 minuto tarde)
  // Si es negativa (llegó antes), lo dejamos como está.
  return diferencia > 0 ? Math.ceil(diferencia) : Math.floor(diferencia);
}


// MARCAR ASISTENCIA CON QR TOKEN DEL WORKER
exports.markAssistance = async (req, res) => {
  try {
    // Nota: El frontend puede enviar 'codigo' o 'qr_token'. Usaremos 'qr_token' como en tu archivo.
    const { qr_token } = req.body; 
    if (!qr_token) {
      return res.status(400).json({ ok: false, error: "QR requerido" });
    }

    const worker = await Worker.findOne({ where: { qr_token } });
    if (!worker) {
      return res
        .status(404)
        .json({ ok: false, error: "QR inválido o trabajador no encontrado" });
    }

    const now = new Date();
    const fecha = now.toISOString().split("T")[0]; // 'AAAA-MM-DD'
    const hora = now.toTimeString().split(" ")[0]; // 'HH:MM:SS'

    let asistencia = await Assistance.findOne({
      where: { workerId: worker.id, fecha },
    });
    
    // 1. OBTENER TURNO PROGRAMADO PARA HOY
    const shiftHoy = await Shift.findOne({
        where: { workerId: worker.id, fecha: fecha }
    });
    
    // 2. Definir la hora límite de ingreso (Dinámico)
    // Usamos la hora de inicio del turno, o un valor por defecto si no hay turno.
    // Usamos slice(0, 8) para asegurar que el formato sea "HH:MM:SS".
    const horaLimite = shiftHoy ? shiftHoy.hora_inicio.slice(0, 8) : "09:00:00"; 

    // 3. LÓGICA DE MARCACIÓN
    if (!asistencia) {
      // Registrar entrada
      let estado = "Puntual";
      let minutos_tarde = 0;

      // Comparamos horas usando la función diffMinutos
      const minutosDiferencia = diffMinutos(hora, horaLimite);

      if (minutosDiferencia > 0) {
        minutos_tarde = minutosDiferencia;
        estado = "Tardanza";
      }

      asistencia = await Assistance.create({
        fecha,
        hora_entrada: hora,
        estado,
        minutos_tarde,
        workerId: worker.id,
      });

      return res.json({ ok: true, message: `Entrada registrada (${estado})`, asistencia });
    } else if (!asistencia.hora_salida) {
      // Registrar salida
      asistencia.hora_salida = hora;
      await asistencia.save();

      return res.json({ ok: true, message: "Salida registrada", asistencia });
    } else {
      return res.json({
        ok: true,
        message: "La asistencia de hoy ya está completa",
        asistencia,
      });
    }
  } catch (err) {
    console.error("markAssistance error:", err);
    res.status(500).json({ ok: false, error: "Error al marcar asistencia" });
  }
};

// Asistencias de hoy para dashboard
exports.getTodayAssistance = async (req, res) => {
  try {
    // NOTA: Si ya implementaste la corrección de timezone en db.js,
    // puedes usar new Date() sin problemas.
    const hoy = new Date().toISOString().split("T")[0]; 

    const asistencias = await Assistance.findAll({
      where: { fecha: hoy },
      include: [{ model: Worker }],
      order: [["hora_entrada", "ASC"]],
    });

    res.json(asistencias);
  } catch (err) {
    console.error("getTodayAssistance error:", err);
    res.status(500).json({ ok: false, error: "Error al obtener asistencias de hoy" });
  }
};

// Historial mensual de un worker (por si lo usas en dashboard de empleado)
exports.getMonthlyHistory = async (req, res) => {
  try {
    const workerId = req.params.id;
    const hoy = new Date();
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    const desde = inicio.toISOString().split("T")[0];
    const hasta = fin.toISOString().split("T")[0];

    const asistencias = await Assistance.findAll({
      where: {
        workerId,
        fecha: { [Op.between]: [desde, hasta] },
      },
      include: [{ model: Worker }],
      order: [["fecha", "ASC"]],
    });

    let totalMinTarde = 0;
    let totalHoras = 0;
    let totalPago = 0;

    asistencias.forEach((a) => {
      totalMinTarde += a.minutos_tarde || 0;

      if (a.hora_entrada && a.hora_salida && a.Worker) {
        // La función diffMinutos ahora calcula correctamente la diferencia de horas trabajadas
        const minutos = diffMinutos(a.hora_salida, a.hora_entrada);
        const horas = minutos > 0 ? minutos / 60 : 0;
        totalHoras += horas;
        totalPago += horas * (a.Worker.salario_hora || 0);
      }
    });

    res.json({
      resumen: {
        dias_asistidos: asistencias.length,
        total_minutos_tarde: totalMinTarde,
        total_horas_trabajadas: totalHoras,
        total_pago: totalPago,
      },
      asistencias,
    });
  } catch (err) {
    console.error("getMonthlyHistory error:", err);
    res.status(500).json({ ok: false, error: "Error al obtener historial mensual" });
  }
};