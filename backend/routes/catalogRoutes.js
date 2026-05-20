// Endpoints para obtener catálogos desde la BD (áreas, cargos, planes, estados)
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const catalogService = require("../services/catalogService");

// GET /api/catalogs/areas
router.get("/areas", authMiddleware, async (req, res) => {
  try {
    const areas = await catalogService.getAreas();
    res.json(areas);
  } catch (error) {
    console.error("getCatalogs areas error:", error);
    res.status(500).json({ error: "Error al obtener áreas" });
  }
});

// GET /api/catalogs/cargos
router.get("/cargos", authMiddleware, async (req, res) => {
  try {
    const cargos = await catalogService.getCargos();
    res.json(cargos);
  } catch (error) {
    console.error("getCatalogs cargos error:", error);
    res.status(500).json({ error: "Error al obtener cargos" });
  }
});

// GET /api/catalogs/planes
router.get("/planes", authMiddleware, async (req, res) => {
  try {
    const planes = await catalogService.getPlanes();
    res.json(planes);
  } catch (error) {
    console.error("getCatalogs planes error:", error);
    res.status(500).json({ error: "Error al obtener planes" });
  }
});

// GET /api/catalogs/estados
router.get("/estados", authMiddleware, async (req, res) => {
  try {
    const estados = await catalogService.getEstados();
    res.json(estados);
  } catch (error) {
    console.error("getCatalogs estados error:", error);
    res.status(500).json({ error: "Error al obtener estados" });
  }
});

// POST /api/catalogs/clear-cache  (útil para el admin cuando actualice catálogos)
router.post("/clear-cache", authMiddleware, (req, res) => {
  catalogService.clearCache();
  res.json({ message: "Caché de catálogos limpiado correctamente" });
});

module.exports = router;
