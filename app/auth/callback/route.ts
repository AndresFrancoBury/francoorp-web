import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { isAdminAllowed } from '@/lib/admin-whitelist'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  let redirectTo = `${origin}/dashboard`

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code)
    if (user) {
      const { data: profile } = await supabase
        .from('profiles').select('role, email').eq('id', user.id).single()
      const email = profile?.email || user.email
      if (profile?.role === 'admin' && isAdminAllowed(email)) {
        redirectTo = `${origin}/admin/selector`
      }
    }
  }

  return NextResponse.redirect(redirectTo)
}