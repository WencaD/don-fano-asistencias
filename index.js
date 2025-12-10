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

    await sequelize.sync(); 

    app.listen(PORT, () => {
      const ifaces = os.networkInterfaces(); 
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
