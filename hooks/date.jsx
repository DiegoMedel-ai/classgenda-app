const adjustTimeZone = (date) => {
  const localDate = new Date(date);
  const offset = localDate.getTimezoneOffset() / 60; // Obtener el offset en horas
  localDate.setHours(localDate.getHours() + offset); // Ajustar la hora
  return localDate;
};

function getDateFormat(date) {
  const newDate = adjustTimeZone(date);
  return newDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function getDateFormat24(date) {
  const newDate = adjustTimeZone(date);
  return newDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
function setDateTimeZone(date) {
  const localDate = new Date(date);
  const offset = localDate.getTimezoneOffset() / 60; // Obtener el offset en horas
  localDate.setHours(localDate.getHours() - offset); // Ajustar la hora
  return localDate.toISOString();
}

function isTimeBetween(start_hour, end_hour) {
  const parseTime = (isoString) => {
    return isoString.getHours() * 100 + isoString.getMinutes(); // Convertir a minutos en UTC
  };

  const current = parseTime(new Date)
  const start = parseTime(adjustTimeZone(start_hour));
  const end = parseTime(adjustTimeZone(end_hour));

  return current >= start && current <= end
}

function getWeekDay(date) {
    const dateFormat = adjustTimeZone(new Date(date));
    return dateFormat.getDay()
}

export { adjustTimeZone, getDateFormat, setDateTimeZone, getDateFormat24, isTimeBetween, getWeekDay };
