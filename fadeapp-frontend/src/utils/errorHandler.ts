/**
 * Extrae mensajes de error desde una respuesta Axios o un objeto de error genérico.
 * Retorna un string legible para mostrar en la UI.
 */
export const parseError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return "Error desconocido. Intenta nuevamente.";
};
