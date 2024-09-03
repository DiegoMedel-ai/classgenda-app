const generateUID = (level, name, value, hours) => {
  return `N${level}T${name}V${value}H${hours}`;
};

const getTemaData = (tema) => {
  const regex = /^N(\d+(?:\.\d+)*?)T(.+?)V(\d+)H(\d+)$/;
  return tema.match(regex);
};

export { generateUID, getTemaData }