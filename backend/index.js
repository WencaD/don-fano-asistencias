const express = require("express");
const cors = require("cors");
const path = require("path");
const { db } = require("./config/firebase");

// Las rutas siguen importando la misma firma del controlador/servicios
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const workerRoutes = require("./routes/workerRoutes");
const assistanceRoutes = require("./routes/assistanceRoutes");
const statsRoutes = require("./routes/statsRoutes");
const shiftRoutes = require("./routes/shiftRoutes");
const reportesRoutes = require("./routes/reportesRoutes");
const qrRoutes = require("./routes/qrRoutes");
const catalogRoutes = require("./routes/catalogRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/public")));

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Don Fano Asistencias API (Firebase Backend)" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", firebase: db ? "connected" : "credentials_required" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/assistance", assistanceRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/reportes", reportesRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/catalogs", catalogRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log("Servidor iniciado en puerto:", PORT);
  if (db) {
    console.log("Conectado a Firebase Cloud Firestore exitosamente.");
  } else {
    console.warn("ADVERTENCIA: Firebase no está configurado de manera completa. Por favor provee 'firebase-service-account.json' en backend/config/ para que el sistema funcione.");
  }
});

module.exports = app;
