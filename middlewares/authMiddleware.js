const jwt = require("jsonwebtoken");
const User = require("../models/User"); // <-- Importamos el modelo User

module.exports = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) return res.status(401).json({ error: "Token de acceso requerido" });

  try {
    const decoded = jwt.verify(token, "supersecretkey");
    
    // === PASO CRÍTICO: BUSCAR EL USUARIO COMPLETO EN LA BD ===
    const user = await User.findByPk(decoded.id, {
        // Excluir el hash para seguridad
        attributes: ['id', 'username', 'email', 'role'] 
    });

    if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado en la base de datos." });
    }

    // Adjuntar los datos frescos y completos a la solicitud
    req.user = user.toJSON(); 
    
    // Si la sesión pasó la verificación, continuar
    next();
    
  } catch (error) {
    // Si el token es inválido (expirado o corrupto)
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};