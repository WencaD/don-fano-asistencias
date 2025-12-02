// index.js
const express = require("express");
const cors = require("cors");
const os = require("os");
const path = require("path");
const sequelize = require("./config/db");

// Modelos
require("./models/User");
require("./models/Worker");
require("./models/Assistance");
require("./models/Shift");
require("./models/associations");

// Rutas
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const workerRoutes = require("./routes/workerRoutes");
const assistanceRoutes = require("./routes/assistanceRoutes");
const statsRoutes = require("./routes/statsRoutes");
const shiftRoutes = require("./routes/shiftRoutes");
const reportesRoutes = require("./routes/reportesRoutes");
const qrRoutes = require("./routes/qrRoutes"); // si no la usas, coméntala

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Prefix de API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/assistance", assistanceRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/reportes", reportesRoutes);

app.use("/api/qr", qrRoutes);

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(async () => {
    console.log("Conectado a MySQL ✔");

    // =======================================================
    // === MODO SEGURO: NO TOCAR LA ESTRUCTURA DE LA BD ===
    // =======================================================
    // Como ya corriste init.js, las tablas ya existen.
    // Usamos sync() vacío solo para verificar conexión, sin alterar nada.
    await sequelize.sync(); 

    app.listen(PORT, () => {
      // mostrar IP local para celular
      const ifaces = require('os').networkInterfaces(); 
      let ipLocal = "localhost";
      for (let name in ifaces) {
        for (let net of ifaces[name]) {
          if (net.family === "IPv4" && !net.internal) {
            ipLocal = net.address;
          }
        }
      }

      console.log("=========================================");
      console.log("  Pizzería Backend Iniciado ✔");
      console.log("=========================================");
      console.log(` Localhost:      http://localhost:${PORT}`);
      console.log(` Desde celular:  http://${ipLocal}:${PORT}`);
      console.log("=========================================");
    });
  })
  .catch((err) => {
    console.error("Error al conectar con la BD:", err);
  });
