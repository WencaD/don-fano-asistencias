// Middleware para validación de token JWT
const tokenHelper = require("../utils/tokenHelper");
const userRepository = require("../repositories/userRepository");

module.exports = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: "Token de acceso requerido" });
  }

  try {
    const decoded = tokenHelper.verify(token);
    
    const user = await userRepository.findById(decoded.id, ['id', 'username', 'email', 'role']);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado en la base de datos." });
    }

    req.user = user.toJSON(); 
    next();
    
  } catch (error) {
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};