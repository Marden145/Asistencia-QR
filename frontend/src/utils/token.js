// Decodifica el payload del JWT sin librerías externas
// El JWT tiene formato: header.payload.signature
// El payload está en base64 en la segunda parte
export const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    // atob decodifica base64, luego parseamos el JSON
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

// Retorna true si el token ya expiró o es inválido
export const tokenExpirado = (token) => {
  if (!token) return true;
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;
  // exp está en segundos, Date.now() en milisegundos
  return decoded.exp * 1000 < Date.now();
};

// Cuántos ms faltan para que expire (negativo = ya expiró)
export const tiempoHastaExpiracion = (token) => {
  if (!token) return -1;
  const decoded = decodeToken(token);
  if (!decoded?.exp) return -1;
  return decoded.exp * 1000 - Date.now();
};