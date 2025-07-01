import { createServerComponentClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import DashboardContent from '@/components/dashboard/DashboardContent'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ダッシュボード | CinemaLog',
  description: '映画鑑賞記録ダッシュボード',
}

export default async function DashboardPage() {
  const supabase = await createServerComponentClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user's recent records
  const { data: records, error } = await supabase
    .from('records')
    .select(`
      *,
      movies (title, director, release_year),
      places (name, place_type)
    `)
    .eq('user_id', user.id)
    .order('watched_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching records:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardContent user={user} records={records || []} />
    </div>
  )
}
