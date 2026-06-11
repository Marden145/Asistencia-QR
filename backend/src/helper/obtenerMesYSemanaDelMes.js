const obtenerMesYSemanaDelMes = (semanaDelAño, año) => {
  // Creamos una fecha al inicio del año
  const fecha = new Date(año, 0, 1);
  // Nos movemos los días correspondientes a esa semana del año
  fecha.setDate(fecha.getDate() + (semanaDelAño - 1) * 7);

  const mes = fecha.getMonth() + 1; // JS cuenta meses de 0 a 11, sumamos 1

  // Calculamos si es la semana 1, 2, 3 o 4 de ese mes en específico
  const diaDelMes = fecha.getDate();
  let semanaDelMes = Math.ceil(diaDelMes / 7);
  if (semanaDelMes > 4) semanaDelMes = 4; // Nos aseguramos de no pasarnos de la semana 4

  return { mes, semanaDelMes };
};
exports = module.exports = obtenerMesYSemanaDelMes;