// Operaciones con fechas y horas (zona horaria América/Lima)
class TimeHelper {
  static diffMinutes(hora1, hora2) {
    const totalMinutes = (timeStr) => {
      const parts = timeStr.split(":").map(Number);
      return (parts[0] || 0) * 60 + (parts[1] || 0) + (parts[2] || 0) / 60;
    };

    const difference = totalMinutes(hora1) - totalMinutes(hora2);
    return difference > 0 ? Math.ceil(difference) : Math.floor(difference);
  }

  static formatDate(date) {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Lima",
      year: "numeric", month: "2-digit", day: "2-digit"
    });
    return formatter.format(date);
  }

  static getCurrentDate() {
    return this.formatDate(new Date());
  }

  static getCurrentTime() {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "America/Lima",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
    });
    return formatter.format(new Date());
  }

  static formatTime(timeStr) {
    if (!timeStr) return "--:--:--";
    return timeStr.slice(0, 8);
  }

  static normalizeDateString(dateStr) {
    if (!dateStr) return null;

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

    if (dateStr.includes("T")) {
      const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Lima",
        year: "numeric", month: "2-digit", day: "2-digit"
      });
      return formatter.format(new Date(dateStr));
    }

    return dateStr;
  }
}

module.exports = TimeHelper;
