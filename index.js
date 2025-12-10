// Servidor principal de la aplicación
const express = require("express");
const cors = require("cors");
const os = require("os");
const path = require("path");
const sequelize = require("./config/db");

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
app.use(express.static(path.join(__dirname, "public")));

// Health check para Railway
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

// Iniciar servidor primero (Railway lo necesita)
app.listen(PORT, '0.0.0.0', () => {
  console.log("=========================================");
  console.log("  Servidor iniciado en puerto:", PORT);
  console.log("=========================================");
});

// Conectar DB después
sequelize
  .authenticate()
  .then(async () => {
    console.log("✅ Conectado a MySQL");
    await sequelize.sync();
    console.log("✅ Base de datos sincronizada");
  })
  .catch((err) => {
    console.error("❌ Error al conectar con la BD:", err.message);
  });
