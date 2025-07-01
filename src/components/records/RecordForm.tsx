'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

interface Movie {
  id: number
  title: string
  director: string | null
  release_year: number | null
  genre: string | null
}

interface Place {
  id: number
  name: string
  address: string | null
  place_type: string | null
}

interface RecordFormProps {
  movies: Movie[]
  places: Place[]
  initialData?: {
    id: number
    movie_id: number
    place_id: number | null
    watched_at: string
    memo: string | null
    rating: number | null
  }
}

export default function RecordForm({ movies, places, initialData }: RecordFormProps) {
  const [formData, setFormData] = useState({
    movie_id: initialData?.movie_id?.toString() || '',
    place_id: initialData?.place_id?.toString() || '',
    watched_at: initialData?.watched_at?.split('T')[0] || new Date().toISOString().split('T')[0],
    memo: initialData?.memo || '',
    rating: initialData?.rating?.toString() || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showNewMovieForm, setShowNewMovieForm] = useState(false)
  const [showNewPlaceForm, setShowNewPlaceForm] = useState(false)
  const [newMovie, setNewMovie] = useState({
    title: '',
    director: '',
    release_year: '',
    genre: '',
  })
  const [newPlace, setNewPlace] = useState({
    name: '',
    address: '',
    place_type: 'theater',
  })

  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('ユーザーが見つかりません')

      const recordData = {
        user_id: user.id,
        movie_id: parseInt(formData.movie_id as string),
        place_id: formData.place_id ? parseInt(formData.place_id as string) : null,
        watched_at: formData.watched_at,
        memo: formData.memo || null,
        rating: formData.rating ? parseInt(formData.rating as string) : null,
      }

      if (initialData) {
        // Update existing record
        const { error } = await supabase
          .from('records')
          .update(recordData)
          .eq('id', initialData.id)
          .eq('user_id', user.id)

        if (error) throw error
      } else {
        // Create new record
        const { error } = await supabase
          .from('records')
          .insert(recordData)

        if (error) throw error
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('エラーが発生しました')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddMovie = async () => {
    if (!newMovie.title.trim()) return

    try {
      const movieData = {
        title: newMovie.title.trim(),
        director: newMovie.director.trim() || null,
        release_year: newMovie.release_year ? parseInt(newMovie.release_year) : null,
        genre: newMovie.genre.trim() || null,
      }

      const { data, error } = await supabase
        .from('movies')
        .insert(movieData)
        .select()
        .single()

      if (error) throw error

      // Add to local movies list and select it
      movies.push(data)
      setFormData(prev => ({ ...prev, movie_id: data.id.toString() }))
      
      // Reset form
      setNewMovie({ title: '', director: '', release_year: '', genre: '' })
      setShowNewMovieForm(false)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('映画の追加に失敗しました')
      }
    }
  }

  const handleAddPlace = async () => {
    if (!newPlace.name.trim()) return

    try {
      const placeData = {
        name: newPlace.name.trim(),
        address: newPlace.address.trim() || null,
        place_type: newPlace.place_type || null,
      }

      const { data, error } = await supabase
        .from('places')
        .insert(placeData)
        .select()
        .single()

      if (error) throw error

      // Add to local places list and select it
      places.push(data)
      setFormData(prev => ({ ...prev, place_id: data.id.toString() }))
      
      // Reset form
      setNewPlace({ name: '', address: '', place_type: 'theater' })
      setShowNewPlaceForm(false)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('場所の追加に失敗しました')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Movie Selection */}
      <div>
        <label htmlFor="movie_id" className="block text-sm font-medium text-gray-700 mb-2">
          映画 *
        </label>
        <div className="flex gap-2">
          <select
            id="movie_id"
            required
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.movie_id}
            onChange={(e) => setFormData(prev => ({ ...prev, movie_id: e.target.value }))}
          >
            <option value="">映画を選択</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title} {movie.release_year && `(${movie.release_year})`}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowNewMovieForm(!showNewMovieForm)}
            className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200"
          >
            新規追加
          </button>
        </div>

        {showNewMovieForm && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3">新しい映画を追加</h4>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="映画タイトル *"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={newMovie.title}
                onChange={(e) => setNewMovie(prev => ({ ...prev, title: e.target.value }))}
              />
              <input
                type="text"
                placeholder="監督"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={newMovie.director}
                onChange={(e) => setNewMovie(prev => ({ ...prev, director: e.target.value }))}
              />
              <input
                type="number"
                placeholder="公開年"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={newMovie.release_year}
                onChange={(e) => setNewMovie(prev => ({ ...prev, release_year: e.target.value }))}
              />
              <input
                type="text"
                placeholder="ジャンル"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={newMovie.genre}
                onChange={(e) => setNewMovie(prev => ({ ...prev, genre: e.target.value }))}
              />
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleAddMovie}
                className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                追加
              </button>
              <button
                type="button"
                onClick={() => setShowNewMovieForm(false)}
                className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Place Selection */}
      <div>
        <label htmlFor="place_id" className="block text-sm font-medium text-gray-700 mb-2">
          鑑賞場所
        </label>
        <div className="flex gap-2">
          <select
            id="place_id"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.place_id}
            onChange={(e) => setFormData(prev => ({ ...prev, place_id: e.target.value }))}
          >
            <option value="">場所を選択</option>
            {places.map((place) => (
              <option key={place.id} value={place.id}>
                {place.name} ({place.place_type})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowNewPlaceForm(!showNewPlaceForm)}
            className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200"
          >
            新規追加
          </button>
        </div>

        {showNewPlaceForm && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3">新しい場所を追加</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="場所名 *"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={newPlace.name}
                onChange={(e) => setNewPlace(prev => ({ ...prev, name: e.target.value }))}
              />
              <input
                type="text"
                placeholder="住所"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={newPlace.address}
                onChange={(e) => setNewPlace(prev => ({ ...prev, address: e.target.value }))}
              />
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={newPlace.place_type}
                onChange={(e) => setNewPlace(prev => ({ ...prev, place_type: e.target.value }))}
              >
                <option value="theater">映画館</option>
                <option value="home">自宅</option>
                <option value="streaming">配信サービス</option>
                <option value="other">その他</option>
              </select>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleAddPlace}
                className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                追加
              </button>
              <button
                type="button"
                onClick={() => setShowNewPlaceForm(false)}
                className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Watched Date */}
      <div>
        <label htmlFor="watched_at" className="block text-sm font-medium text-gray-700 mb-2">
          鑑賞日 *
        </label>
        <input
          type="date"
          id="watched_at"
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={formData.watched_at}
          onChange={(e) => setFormData(prev => ({ ...prev, watched_at: e.target.value }))}
        />
      </div>

      {/* Rating */}
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
          評価 (1-10)
        </label>
        <select
          id="rating"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={formData.rating}
          onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
        >
          <option value="">評価なし</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <option key={num} value={num}>★ {num}/10</option>
          ))}
        </select>
      </div>

      {/* Memo */}
      <div>
        <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-2">
          感想・メモ
        </label>
        <textarea
          id="memo"
          rows={4}
          maxLength={5000}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="この映画についての感想や印象的だったシーンなど..."
          value={formData.memo}
          onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
        />
        <p className="mt-1 text-sm text-gray-500">
          {formData.memo.length} / 5000 文字
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '保存中...' : initialData ? '更新する' : '記録を保存'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          キャンセル
        </button>
      </div>
    </form>
  )
}
