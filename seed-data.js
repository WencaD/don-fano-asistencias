// Script para poblar la base de datos con datos de una semana
const sequelize = require("./config/db");
const User = require("./models/User");
const Worker = require("./models/Worker");
const Assistance = require("./models/Assistance");
const Shift = require("./models/Shift");
const bcrypt = require("bcrypt");

require("./models/associations");

async function seedData() {
  try {
    console.log("🌱 Iniciando población de datos...");

    // Limpiar tablas (opcional - comenta si no quieres borrar datos existentes)
    await Assistance.destroy({ where: {} });
    await Shift.destroy({ where: {} });
    await Worker.destroy({ where: {} });
    await User.destroy({ where: {} });

    console.log("✅ Tablas limpiadas");

    // Crear Admin
    const adminPassword = await bcrypt.hash("123456", 10);
    const admin = await User.create({
      nombre: "Administrador Principal",
      username: "admin",
      email: "admin@donfano.com",
      password_hash: adminPassword,
      role: "ADMIN"
    });

    console.log("✅ Administrador creado");

    // Crear trabajadores
    const trabajadores = [
      { nombre: "Carlos Méndez", dni: "12345678", email: "carlos@donfano.com", area: "Cocina", salario: 15 },
      { nombre: "María González", dni: "23456789", email: "maria@donfano.com", area: "Caja", salario: 12 },
      { nombre: "Pedro Ramírez", dni: "34567890", email: "pedro@donfano.com", area: "Delivery", salario: 10 },
      { nombre: "Ana Torres", dni: "45678901", email: "ana@donfano.com", area: "Cocina", salario: 14 },
      { nombre: "Luis Fernández", dni: "56789012", email: "luis@donfano.com", area: "Mesero", salario: 11 },
    ];

    const workersCreated = [];

    for (const trab of trabajadores) {
      const userPassword = await bcrypt.hash(trab.dni, 10);
      
      const user = await User.create({
        nombre: trab.nombre,
        username: trab.dni,
        email: trab.email,
        password_hash: userPassword,
        role: "WORKER"
      });

      const worker = await Worker.create({
        nombre: trab.nombre,
        dni: trab.dni,
        correo: trab.email,
        area: trab.area,
        rol: "Empleado",
        salario_hora: trab.salario,
        qr_token: `qr_${Math.random().toString(36).substring(2, 12)}`,
        userId: user.id
      });

      workersCreated.push(worker);
    }

    console.log(`✅ ${workersCreated.length} trabajadores creados`);

    // Generar fechas de la última semana (del 29 nov al 5 dic)
    const fechas = [
      "2025-11-29", // Viernes
      "2025-11-30", // Sábado
      "2025-12-01", // Domingo
      "2025-12-02", // Lunes
      "2025-12-03", // Martes
      "2025-12-04", // Miércoles
      "2025-12-05"  // Jueves (hoy)
    ];

    // Crear turnos y asistencias para cada día
    let totalAsistencias = 0;
    let totalTurnos = 0;

    for (const fecha of fechas) {
      for (const worker of workersCreated) {
        // Generar hora de inicio aleatoria entre 14:00 (2 PM) y 15:00 (3 PM)
        const horaInicioTurno = Math.random() > 0.5 ? "14:00" : "14:30";
        const horaFinTurno = "23:00"; // 11 PM

        // Crear turno
        await Shift.create({
          fecha: fecha,
          hora_inicio: horaInicioTurno,
          hora_fin: horaFinTurno,
          workerId: worker.id
        });
        totalTurnos++;

        // 90% de probabilidad de que asista
        if (Math.random() > 0.1) {
          // Generar hora de entrada (puede llegar temprano, puntual o tarde)
          const minutosVariacion = Math.floor(Math.random() * 30) - 10; // Entre -10 y +20 minutos
          const [horaBase, minutoBase] = horaInicioTurno.split(":").map(Number);
          let minutoEntrada = minutoBase + minutosVariacion;
          let horaEntrada = horaBase;

          if (minutoEntrada < 0) {
            minutoEntrada += 60;
            horaEntrada -= 1;
          } else if (minutoEntrada >= 60) {
            minutoEntrada -= 60;
            horaEntrada += 1;
          }

          const horaEntradaStr = `${String(horaEntrada).padStart(2, '0')}:${String(minutoEntrada).padStart(2, '0')}:00`;

          // Determinar estado y minutos tarde
          const minutosTarde = minutosVariacion > 0 ? minutosVariacion : 0;
          const estado = minutosTarde > 0 ? "Tardanza" : "Puntual";

          // 80% de probabilidad de que haya marcado salida (excepto hoy)
          let horaSalidaStr = null;
          if (fecha !== "2025-12-05" || Math.random() > 0.5) {
            // Generar hora de salida cerca del fin del turno
            const [horaFinBase, minutoFinBase] = horaFinTurno.split(":").map(Number);
            const minutosVariacionSalida = Math.floor(Math.random() * 20) - 5;
            let minutoSalida = minutoFinBase + minutosVariacionSalida;
            let horaSalida = horaFinBase;

            if (minutoSalida < 0) {
              minutoSalida += 60;
              horaSalida -= 1;
            } else if (minutoSalida >= 60) {
              minutoSalida -= 60;
              horaSalida += 1;
            }

            horaSalidaStr = `${String(horaSalida).padStart(2, '0')}:${String(minutoSalida).padStart(2, '0')}:00`;
          }

          await Assistance.create({
            fecha: fecha,
            hora_entrada: horaEntradaStr,
            hora_salida: horaSalidaStr,
            estado: estado,
            minutos_tarde: minutosTarde,
            workerId: worker.id
          });
          totalAsistencias++;
        }
      }
    }

    console.log(`✅ ${totalTurnos} turnos creados`);
    console.log(`✅ ${totalAsistencias} asistencias registradas`);

    console.log("\n📊 RESUMEN:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👤 Usuarios creados:");
    console.log("   - 1 Administrador (admin / 123456)");
    console.log(`   - ${trabajadores.length} Trabajadores (usuario: DNI, contraseña: DNI)`);
    console.log("\n📅 Datos generados:");
    console.log(`   - Período: 29 nov - 5 dic 2025 (7 días)`);
    console.log(`   - ${totalTurnos} turnos asignados`);
    console.log(`   - ${totalAsistencias} asistencias registradas`);
    console.log("\n👷 Trabajadores:");
    trabajadores.forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.nombre} - ${t.area} - S/ ${t.salario}/hora`);
    });
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n✨ ¡Datos insertados exitosamente!");
    console.log("\n🔐 Credenciales de acceso:");
    console.log("   Admin: admin / 123456");
    console.log("   Trabajadores: DNI / DNI (ej: 12345678 / 12345678)");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error al poblar datos:", error);
    process.exit(1);
  }
}

seedData();
