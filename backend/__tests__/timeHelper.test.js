// Pruebas unitarias — TimeHelper (cálculo de tardanzas y fechas)
const TimeHelper = require("../utils/timeHelper");

// --- diffMinutes ---
describe("TimeHelper — diffMinutes", () => {
  test("T01 — Llega 10 minutos tarde", () => {
    expect(TimeHelper.diffMinutes("09:10:00", "09:00:00")).toBe(10);
  });

  test("T02 — Llega exactamente a tiempo", () => {
    expect(TimeHelper.diffMinutes("09:00:00", "09:00:00")).toBe(0);
  });

  test("T03 — Llega 30 minutos antes (resultado negativo)", () => {
    expect(TimeHelper.diffMinutes("08:30:00", "09:00:00")).toBeLessThan(0);
  });

  test("T04 — Tardanza de 1 hora (60 minutos)", () => {
    expect(TimeHelper.diffMinutes("10:00:00", "09:00:00")).toBe(60);
  });

  test("T05 — Tardanza con segundos se redondea al techo", () => {
    expect(TimeHelper.diffMinutes("09:01:30", "09:00:00")).toBe(2);
  });
});

// --- formatTime ---
describe("TimeHelper — formatTime", () => {
  test("T06 — Hora válida devuelve HH:MM:SS", () => {
    expect(TimeHelper.formatTime("09:00:00")).toBe("09:00:00");
  });

  test("T07 — null devuelve placeholder", () => {
    expect(TimeHelper.formatTime(null)).toBe("--:--:--");
  });

  test("T08 — undefined devuelve placeholder", () => {
    expect(TimeHelper.formatTime(undefined)).toBe("--:--:--");
  });
});

// --- normalizeDateString ---
describe("TimeHelper — normalizeDateString", () => {
  test("T09 — Fecha YYYY-MM-DD se devuelve sin cambios", () => {
    expect(TimeHelper.normalizeDateString("2026-05-07")).toBe("2026-05-07");
  });

  test("T10 — null devuelve null", () => {
    expect(TimeHelper.normalizeDateString(null)).toBeNull();
  });
});
