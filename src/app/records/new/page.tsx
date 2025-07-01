import { createServerComponentClient } from '@/lib/supabase-client'
import { redirect } from 'next/navigation'
import RecordForm from '@/components/records/RecordForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '新しい記録を追加 | CinemaLog',
  description: '新しい映画鑑賞記録を追加',
}

export default async function NewRecordPage() {
  const supabase = await createServerComponentClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
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
            <h1 className="text-2xl font-bold text-gray-900">新しい鑑賞記録を追加</h1>
          </div>
          <div className="p-6">
            <RecordForm 
              movies={moviesResult.data || []} 
              places={placesResult.data || []} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}
