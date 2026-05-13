/**
 * WHITELIST DE CORREOS AUTORIZADOS PARA EL PANEL ADMIN
 * Para agregar un admin: añade el correo en minúsculas.
 * Para revocar acceso: elimínalo de la lista.
 */
export const ADMIN_WHITELIST: string[] = [
  'gerencia@francoorp.com',
]

export function isAdminAllowed(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_WHITELIST.includes(email.toLowerCase().trim())
}
