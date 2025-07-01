import { createServerComponentClient } from '@/lib/supabase-client'
import { redirect, notFound } from 'next/navigation'
import RecordForm from '@/components/records/RecordForm'
import { Metadata } from 'next'

interface PageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: '記録を編集 | CinemaLog',
  description: '映画鑑賞記録を編集',
}

export default async function EditRecordPage({ params }: PageProps) {
  const supabase = await createServerComponentClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get the record to edit
  const { data: record, error } = await supabase
    .from('records')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id) // Only allow editing own records
    .single()

  if (error || !record) {
    notFound()
  }

  // Get movies and places for the form
  const [moviesResult, placesResult] = await Promise.all([
    supabase.from('movies').select('*').order('title'),
    supabase.from('places').select('*').order('name')
  ])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">鑑賞記録を編集</h1>
          </div>
          <div className="p-6">
            <RecordForm 
              movies={moviesResult.data || []} 
              places={placesResult.data || []}
              initialData={record}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
