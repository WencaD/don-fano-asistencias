// Utilidad para operaciones con fechas y horas
class TimeHelper {
  static diffMinutes(hora1, hora2) {
    const totalMinutes = (timeStr) => {
      const parts = timeStr.split(":").map(Number);
      const h = parts[0] || 0;
      const m = parts[1] || 0;
      const s = parts[2] || 0;
      return h * 60 + m + s / 60;
    };

    const minutes1 = totalMinutes(hora1);
    const minutes2 = totalMinutes(hora2);
    const difference = minutes1 - minutes2;

    return difference > 0 ? Math.ceil(difference) : Math.floor(difference);
  }

  static getCurrentDate() {
    return new Date().toISOString().split("T")[0];
  }

  static getCurrentTime() {
    return new Date().toTimeString().split(" ")[0];
  }

  static formatTime(timeStr) {
    return timeStr.slice(0, 8);
  }

  static normalizeDateString(dateStr) {
    if (!dateStr) return null;
    
    // Si ya está en formato YYYY-MM-DD, devolverlo tal cual
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    // Solo normalizar si viene con hora (formato ISO con 'T')
    if (dateStr.includes('T')) {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    return dateStr;
  }
}

module.exports = TimeHelper;
