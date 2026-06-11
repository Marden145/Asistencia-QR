const calcularEdad = (fechaNacimientoString) => {
  if (!fechaNacimientoString) return { edad: 0, esMayor65: false };

  const hoy = new Date();
  const cumpleaños = new Date(fechaNacimientoString);
  
  let edad = hoy.getFullYear() - cumpleaños.getFullYear();
  const mes = hoy.getMonth() - cumpleaños.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < cumpleaños.getDate())) {
    edad--;
  }

  return {
    edad,
    esMayor65: edad >= 65
  };
};
export default calcularEdad;