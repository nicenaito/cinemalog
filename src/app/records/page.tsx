import { createServerComponentClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import RecordsList from '@/components/records/RecordsList'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '鑑賞記録一覧 | CinemaLog',
  description: '映画鑑賞記録の一覧',
}

interface SearchParams {
  year?: string
  search?: string
}

export default async function RecordsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = await createServerComponentClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Build query
  let query = supabase
    .from('records')
    .select(`
      *,
      movies (title, director, release_year, genre),
      places (name, place_type, address)
    `)
    .eq('user_id', user.id)
    .order('watched_at', { ascending: false })

  // Apply year filter
  if (searchParams.year) {
    const year = parseInt(searchParams.year)
    query = query.gte('watched_at', `${year}-01-01`).lt('watched_at', `${year + 1}-01-01`)
  }

  const { data: records, error } = await query

  if (error) {
    console.error('Error fetching records:', error)
  }

  // Get unique years for filter
  const { data: allRecords } = await supabase
    .from('records')
    .select('watched_at')
    .eq('user_id', user.id)

  const years = allRecords
    ? [...new Set(allRecords.map(r => new Date(r.watched_at).getFullYear()))]
        .sort((a, b) => b - a)
    : []

  return (
    <div className="min-h-screen bg-gray-50">
      <RecordsList 
        records={records || []} 
        years={years}
        currentYear={searchParams.year}
        searchTerm={searchParams.search}
      />
    </div>
  )
}
