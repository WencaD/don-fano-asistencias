// index-https.js - Servidor HTTPS para desarrollo local
const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
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
const qrRoutes = require("./routes/qrRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/assistance", assistanceRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/reportes", reportesRoutes);
app.use("/api/qr", qrRoutes);

const PORT = process.env.PORT || 3000;
const HTTPS_PORT = 3443;

// Opciones SSL - NECESITAS GENERAR CERTIFICADOS PRIMERO
// Ejecuta en PowerShell:
// New-SelfSignedCertificate -DnsName localhost -CertStoreLocation cert:\LocalMachine\My -NotAfter (Get-Date).AddYears(10)
// Luego exporta el certificado y clave

let httpsOptions;
try {
  httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, "ssl", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "ssl", "cert.pem"))
  };
} catch (err) {
  console.error("❌ No se encontraron certificados SSL en ./ssl/");
  console.error("📝 Para generar certificados locales, ejecuta:");
  console.error("   npm install -g mkcert");
  console.error("   mkcert -install");
  console.error("   mkdir ssl");
  console.error("   mkcert -key-file ssl/key.pem -cert-file ssl/cert.pem localhost 127.0.0.1 ::1");
  process.exit(1);
}

sequelize
  .authenticate()
  .then(async () => {
    console.log("Conectado a MySQL ✔");
    await sequelize.sync();

    // Servidor HTTP (redirige a HTTPS)
    const httpApp = express();
    httpApp.use((req, res) => {
      res.redirect(`https://${req.headers.host.split(':')[0]}:${HTTPS_PORT}${req.url}`);
    });
    httpApp.listen(PORT, () => {
      console.log(`🔓 HTTP Server (redirect): http://localhost:${PORT}`);
    });

    // Servidor HTTPS
    https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
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
      console.log("  🔒 Pizzería HTTPS Iniciado ✔");
      console.log("=========================================");
      console.log(` Local:          https://localhost:${HTTPS_PORT}`);
      console.log(` Red local:      https://${ipLocal}:${HTTPS_PORT}`);
      console.log("=========================================");
    });
  })
  .catch((err) => {
    console.error("Error al conectar con la BD:", err);
  });
