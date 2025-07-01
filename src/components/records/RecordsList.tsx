'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

interface Record {
  id: number
  user_id: string
  movie_id: number
  place_id: number | null
  watched_at: string
  memo: string | null
  rating: number | null
  created_at: string
  updated_at: string
  movies: {
    title: string
    director: string | null
    release_year: number | null
    genre: string | null
  }
  places: {
    name: string
    place_type: string | null
    address: string | null
  } | null
}

interface RecordsListProps {
  records: Record[]
  years: number[]
  currentYear?: string
  searchTerm?: string
}

export default function RecordsList({ records, years, currentYear, searchTerm }: RecordsListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchTerm || '')

  const handleYearFilter = (year: string) => {
    const params = new URLSearchParams(searchParams)
    if (year === 'all') {
      params.delete('year')
    } else {
      params.set('year', year)
    }
    router.push(`/records?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (search.trim()) {
      params.set('search', search.trim())
    } else {
      params.delete('search')
    }
    router.push(`/records?${params.toString()}`)
  }

  const generateShareLink = (record: Record) => {
    const text = `『${record.movies.title}』を観ました！`
    const url = `${window.location.origin}/records/${record.id}`
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  }

  // Filter records by search term
  const filteredRecords = search
    ? records.filter(record =>
        record.movies.title.toLowerCase().includes(search.toLowerCase()) ||
        record.movies.director?.toLowerCase().includes(search.toLowerCase()) ||
        record.memo?.toLowerCase().includes(search.toLowerCase())
      )
    : records

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              鑑賞記録一覧
            </h1>
            <Link
              href="/records/new"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              新しい記録を追加
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 space-y-4">
          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              年別フィルター
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleYearFilter('all')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  !currentYear
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                全期間
              </button>
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => handleYearFilter(year.toString())}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentYear === year.toString()
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {year}年
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              検索
            </label>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="映画タイトル、監督、感想で検索..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="submit"
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                検索
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {currentYear ? `${currentYear}年の鑑賞数` : '総鑑賞数'}
          </h3>
          <p className="text-3xl font-bold text-indigo-600">{filteredRecords.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">平均評価</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {filteredRecords.filter(r => r.rating).length > 0
              ? (filteredRecords.filter(r => r.rating).reduce((sum, r) => sum + (r.rating || 0), 0) /
                 filteredRecords.filter(r => r.rating).length).toFixed(1)
              : '---'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">お気に入りジャンル</h3>
          <p className="text-3xl font-bold text-green-600">
            {(() => {
              const genres = filteredRecords
                .map(r => r.movies.genre)
                .filter(Boolean)
              const genreCount: { [key: string]: number } = genres.reduce((acc, genre) => {
                acc[genre!] = (acc[genre!] || 0) + 1
                return acc
              }, {} as { [key: string]: number })
              const topGenre = Object.entries(genreCount)
                .sort(([,a], [,b]) => (b as number) - (a as number))[0]
              return topGenre ? topGenre[0] : '---'
            })()}
          </p>
        </div>
      </div>

      {/* Records List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            記録一覧 ({filteredRecords.length}件)
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <div key={record.id} className="px-6 py-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {record.movies.title}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">監督:</span> {record.movies.director || '不明'}
                          </div>
                          <div>
                            <span className="font-medium">公開年:</span> {record.movies.release_year || '不明'}
                          </div>
                          <div>
                            <span className="font-medium">ジャンル:</span> {record.movies.genre || '不明'}
                          </div>
                          <div>
                            <span className="font-medium">鑑賞場所:</span> {record.places?.name || '不明'}
                          </div>
                          <div>
                            <span className="font-medium">鑑賞日:</span> {new Date(record.watched_at).toLocaleDateString('ja-JP')}
                          </div>
                          {record.rating && (
                            <div>
                              <span className="font-medium">評価:</span> ★ {record.rating}/10
                            </div>
                          )}
                        </div>
                        {record.memo && (
                          <div className="mt-3">
                            <p className="text-gray-700 whitespace-pre-wrap line-clamp-3">
                              {record.memo}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    {record.rating && (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        ★ {record.rating}/10
                      </span>
                    )}
                    <div className="flex space-x-2">
                      <Link
                        href={`/records/${record.id}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        詳細
                      </Link>
                      <Link
                        href={`/records/${record.id}/edit`}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        編集
                      </Link>
                      <a
                        href={generateShareLink(record)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        シェア
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 text-lg">
                {search ? '検索条件に一致する記録がありません。' : '鑑賞記録がありません。'}
              </p>
              <Link
                href="/records/new"
                className="mt-4 inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
              >
                最初の記録を追加する
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
