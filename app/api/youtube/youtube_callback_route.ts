import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(
      new URL('/dashboard?youtube=error', request.url)
    )
  }

  try {
    // 1. Intercambiar código por access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.YOUTUBE_CLIENT_ID!,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
        redirect_uri: process.env.NEXT_PUBLIC_YOUTUBE_REDIRECT_URI!,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) throw new Error('No access token')

    // 2. Obtener datos del canal de YouTube
    const channelRes = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
      { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
    )
    const channelData = await channelRes.json()
    const channel = channelData.items?.[0]

    if (!channel) {
      return NextResponse.redirect(
        new URL('/dashboard?youtube=no_channel', request.url)
      )
    }

    const youtubeInfo = {
      youtube_channel_id: channel.id,
      youtube_channel_name: channel.snippet.title,
      youtube_channel_description: channel.snippet.description,
      youtube_channel_thumbnail: channel.snippet.thumbnails?.high?.url || channel.snippet.thumbnails?.default?.url,
      youtube_subscribers: parseInt(channel.statistics.subscriberCount || '0'),
      youtube_video_count: parseInt(channel.statistics.videoCount || '0'),
      youtube_view_count: parseInt(channel.statistics.viewCount || '0'),
      youtube_access_token: tokenData.access_token,
      youtube_refresh_token: tokenData.refresh_token || null,
      youtube_connected_at: new Date().toISOString(),
    }

    // 3. Guardar en Supabase usando el usuario autenticado
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

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    await supabase.from('profiles').update(youtubeInfo).eq('id', user.id)

    return NextResponse.redirect(
      new URL('/dashboard?youtube=connected', request.url)
    )
  } catch (err) {
    console.error('YouTube OAuth error:', err)
    return NextResponse.redirect(
      new URL('/dashboard?youtube=error', request.url)
    )
  }
}
