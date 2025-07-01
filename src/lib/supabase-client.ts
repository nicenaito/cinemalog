
import { createBrowserClient } from '@supabase/ssr'
import { type Database } from './supabase'


export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// サーバー用のSupabaseクライアントは app/api/ や app/ ディレクトリのサーバー側でのみ
// 別ファイル（例: supabase-server.ts）で next/headers をimportして実装してください。
