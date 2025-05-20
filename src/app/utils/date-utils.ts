/**
 * Convierte una cadena tipo 'YYYY-MM-DD' a un objeto Date sin modificar la zona horaria.
 * @param dateString Formato esperado: '2025-05-20'
 * @returns Date con la fecha exacta local
 */
export function parseLocalDate(dateString: string): Date {
  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
