const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./config/db");

require("./models/Organization");
require("./models/User");
require("./models/Worker");
require("./models/Assistance");
require("./models/Shift");
require("./models/associations");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const workerRoutes = require("./routes/workerRoutes");
const assistanceRoutes = require("./routes/assistanceRoutes");
const statsRoutes = require("./routes/statsRoutes");
const shiftRoutes = require("./routes/shiftRoutes");
const reportesRoutes = require("./routes/reportesRoutes");
const qrRoutes = require("./routes/qrRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/public")));

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Don Fano Asistencias API" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/assistance", assistanceRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/reportes", reportesRoutes);
app.use("/api/qr", qrRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log("Servidor iniciado en puerto:", PORT);
});

sequelize
  .authenticate()
  .then(async () => {
    console.log("Conectado a MySQL");
    
    // Forzar nulabilidad de organizationId si existe la restricción
    try {
      await sequelize.query("ALTER TABLE users MODIFY COLUMN organizationId INT NULL");
      await sequelize.query("ALTER TABLE workers MODIFY COLUMN organizationId INT NULL");
      console.log("Esquema de BD ajustado manualmente (NULL enabled)");
    } catch (e) {
      // Ignorar si la columna no existe aún
    }

    await sequelize.sync({ alter: true });
    console.log("Base de datos sincronizada y actualizada");
  })
  .catch((err) => {
    console.error("Error al conectar con la BD:", err.message);
  });

module.exports = app;
