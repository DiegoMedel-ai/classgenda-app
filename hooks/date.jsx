const adjustTimeZone = (date) => {
    const localDate = new Date(date);
    const offset = localDate.getTimezoneOffset() / 60; // Obtener el offset en horas
    localDate.setHours(localDate.getHours() + offset); // Ajustar la hora
    return localDate;
  };

function getDateFormat(date){
    const newDate = adjustTimeZone(date);
    return newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function getDateFormat24(date){
    const newDate = adjustTimeZone(date);
    return newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}
function setDateTimeZone(date){
    const localDate = new Date(date);
    const offset = localDate.getTimezoneOffset() / 60; // Obtener el offset en horas
    localDate.setHours(localDate.getHours() - offset); // Ajustar la hora
    return localDate.toISOString();
}

export {adjustTimeZone,getDateFormat,setDateTimeZone,getDateFormat24}