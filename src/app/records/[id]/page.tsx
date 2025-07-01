import { createServerComponentClient } from '@/lib/supabase-client'
import { redirect, notFound } from 'next/navigation'
import RecordDetail from '@/components/records/RecordDetail'
import { Metadata } from 'next'

interface PageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = await createServerComponentClient()
  
  const { data: record } = await supabase
    .from('records')
    .select(`
      *,
      movies (title)
    `)
    .eq('id', params.id)
    .single()

  return {
    title: record 
      ? `${record.movies?.title} | CinemaLog`
      : '記録が見つかりません | CinemaLog',
    description: record
      ? `${record.movies?.title}の鑑賞記録`
      : '記録が見つかりませんでした',
  }
}

export default async function RecordDetailPage({ params }: PageProps) {
  const supabase = await createServerComponentClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get the record with related data
  const { data: record, error } = await supabase
    .from('records')
    .select(`
      *,
      movies (title, director, release_year, genre),
      places (name, place_type, address),
      users (display_name, email)
    `)
    .eq('id', params.id)
    .single()

  if (error || !record) {
    notFound()
  }

  // Check if user can view this record (own record or friend's record)
  const canView = record.user_id === user.id || await checkIfFriend(supabase, user.id, record.user_id)

  if (!canView) {
    redirect('/dashboard')
  }

  // Get comments for this record
  const { data: comments } = await supabase
    .from('comments')
    .select(`
      *,
      users (display_name, email)
    `)
    .eq('record_id', record.id)
    .order('created_at', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <RecordDetail 
        record={record} 
        comments={comments || []} 
        currentUserId={user.id}
        isOwner={record.user_id === user.id}
      />
    </div>
  )
}

async function checkIfFriend(supabase: any, userId: string, recordUserId: string): Promise<boolean> {
  const { data } = await supabase
    .from('friends')
    .select('id')
    .eq('status', 'accepted')
    .or(`and(requester_id.eq.${userId},requested_id.eq.${recordUserId}),and(requester_id.eq.${recordUserId},requested_id.eq.${userId})`)
    .single()
  
  return !!data
}
