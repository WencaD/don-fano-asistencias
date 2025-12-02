// middlewares/isAdmin.js
module.exports = (req, res, next) => {
  // Se asume que authMiddleware ya se ejecutó y adjuntó req.user
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado: Se requiere rol de Administrador.' });
  }
  next();
};