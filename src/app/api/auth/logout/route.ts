import { createRouteHandlerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createRouteHandlerClient()
    await supabase.auth.signOut()
    
    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  } catch (error) {
    return NextResponse.json({ error: 'Error logging out' }, { status: 500 })
  }
}
