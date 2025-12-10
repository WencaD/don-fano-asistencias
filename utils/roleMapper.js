// Utilidad para mapeo de roles entre frontend y backend
class RoleMapper {
  static toDatabase(frontendRole) {
    return frontendRole === "Administrador" || frontendRole === "ADMIN" 
      ? "ADMIN" 
      : "WORKER";
  }

  static toFrontend(dbRole) {
    return dbRole === "ADMIN" ? "Administrador" : "Empleado";
  }
}

module.exports = RoleMapper;
