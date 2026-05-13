/**
 * WHITELIST DE CORREOS AUTORIZADOS PARA EL PANEL ADMIN
 * ─────────────────────────────────────────────────────
 * Solo los correos listados aquí pueden acceder a /admin y /admin/selector.
 * Para agregar un nuevo admin: añade el correo en minúsculas a este array.
 * Para revocar acceso: elimina el correo de la lista.
 */
export const ADMIN_WHITELIST: string[] = [
  'gerencia@francoorp.com',
]

/**
 * Verifica si un correo está autorizado para acceder al panel admin.
 * La comparación es case-insensitive.
 */
export function isAdminAllowed(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_WHITELIST.includes(email.toLowerCase().trim())
}
