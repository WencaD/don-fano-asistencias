// Pruebas unitarias — AuthService (login, registro, token)
jest.mock("../repositories/userRepository", () => ({
  findByUsername: jest.fn(),
  findByEmail:    jest.fn(),
  create:         jest.fn(),
}));

jest.mock("../repositories/organizationRepository", () => ({
  findByAlias: jest.fn(),
  create:      jest.fn(),
}));

jest.mock("../utils/passwordHelper", () => ({
  compare: jest.fn(),
  hash:    jest.fn(),
}));

jest.mock("../utils/tokenHelper", () => ({
  generate: jest.fn(),
}));

jest.mock("../config/db", () => ({
  define:      jest.fn(() => ({})),
  transaction: jest.fn(),
}));

jest.mock("../services/catalogService", () => ({
  getPlanId: jest.fn().mockReturnValue(1),
  getRoleId: jest.fn((role) => (role === "ADMIN" ? 1 : 2)),
  getRoleName: jest.fn((roleId) => (roleId === 1 || roleId === "ADMIN" ? "ADMIN" : "WORKER")),
}));

const authService            = require("../services/authService");
const userRepository         = require("../repositories/userRepository");
const organizationRepository = require("../repositories/organizationRepository");
const passwordHelper         = require("../utils/passwordHelper");
const tokenHelper            = require("../utils/tokenHelper");
const sequelize              = require("../config/db");

// --- Login ---
describe("AuthService — Login", () => {
  beforeEach(() => jest.clearAllMocks());

  test("P01 — Login exitoso con credenciales correctas", async () => {
    const usuario = { id: 1, username: "donfano", password_hash: "$2b$10$hash", role: "ADMIN" };
    userRepository.findByUsername.mockResolvedValue(usuario);
    passwordHelper.compare.mockResolvedValue(true);

    const result = await authService.login("donfano", "123456");

    expect(result).toEqual(usuario);
    expect(userRepository.findByUsername).toHaveBeenCalledWith("donfano");
  });

  test("P02 — Login falla si el usuario no existe", async () => {
    userRepository.findByUsername.mockResolvedValue(null);

    await expect(authService.login("nadie", "12345"))
      .rejects.toThrow("Usuario o contraseña incorrecta");
  });

  test("P03 — Login falla si la contraseña es incorrecta", async () => {
    userRepository.findByUsername.mockResolvedValue({ id: 2, password_hash: "$2b$10$hash" });
    passwordHelper.compare.mockResolvedValue(false);

    await expect(authService.login("donfano", "wrong"))
      .rejects.toThrow("Usuario o contraseña incorrecta");
  });

  test("P04 — Login con campos vacíos lanza error", async () => {
    userRepository.findByUsername.mockResolvedValue(null);

    await expect(authService.login("", ""))
      .rejects.toThrow("Usuario o contraseña incorrecta");
  });
});

// --- Registro ---
describe("AuthService — Registro", () => {
  const datosValidos = {
    organizationName:  "Pizzería Don Fano",
    organizationAlias: "donfano",
    contactEmail:      "contacto@donfano.com",
    country:           "Paraguay",
    city:              "Asunción",
    phone:             "0981000000",
    plan:              "basico",
    adminName:         "Carlos Fano",
    adminEmail:        "admin@donfano.com",
    adminPassword:     "segura123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    organizationRepository.findByAlias.mockResolvedValue(null);
    userRepository.findByEmail.mockResolvedValue(null);
    passwordHelper.hash.mockResolvedValue("$2b$10$hash");
    sequelize.transaction.mockResolvedValue({ commit: jest.fn(), rollback: jest.fn() });
    organizationRepository.create.mockResolvedValue({ id: 10, alias: "donfano", plan: "basico" });
    userRepository.create.mockResolvedValue({ id: 5, role: "ADMIN", organizationId: 10 });
  });

  test("P05 — Registro exitoso con datos válidos", async () => {
    const result = await authService.register(datosValidos);

    expect(result).toHaveProperty("organization");
    expect(result).toHaveProperty("user");
    expect(result.user.role).toBe("ADMIN");
  });

  test("P06 — Registro falla si faltan campos requeridos", async () => {
    await expect(authService.register({ organizationName: "Fano" }))
      .rejects.toThrow("Faltan datos requeridos para el registro");
  });

  test("P07 — Registro falla si el alias ya existe", async () => {
    organizationRepository.findByAlias.mockResolvedValue({ id: 99 });

    await expect(authService.register(datosValidos))
      .rejects.toThrow("Este alias de organización ya está en uso");
  });

  test("P08 — Registro falla si el email ya está registrado", async () => {
    userRepository.findByEmail.mockResolvedValue({ id: 3 });

    await expect(authService.register(datosValidos))
      .rejects.toThrow("Este email ya está registrado en el sistema");
  });

  test("P09 — Registro falla si la contraseña tiene menos de 6 caracteres", async () => {
    await expect(authService.register({ ...datosValidos, adminPassword: "123" }))
      .rejects.toThrow("La contraseña debe tener al menos 6 caracteres");
  });
});

// --- Token JWT ---
describe("AuthService — generateToken", () => {
  beforeEach(() => jest.clearAllMocks());

  test("P10 — Genera token para usuario ADMIN", () => {
    tokenHelper.generate.mockReturnValue("mock.token.admin");

    const token = authService.generateToken({ id: 1, role: "ADMIN", organizationId: 10 });

    expect(typeof token).toBe("string");
    expect(tokenHelper.generate).toHaveBeenCalledWith({ id: 1, role: "ADMIN", workerId: null, organizationId: 10 });
  });

  test("P11 — Genera token con workerId para usuario WORKER", () => {
    tokenHelper.generate.mockReturnValue("mock.token.worker");

    authService.generateToken({ id: 7, role: "WORKER", organizationId: 2 }, 42);

    expect(tokenHelper.generate).toHaveBeenCalledWith({ id: 7, role: "WORKER", workerId: 42, organizationId: 2 });
  });
});
