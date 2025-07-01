'use client'

import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useState } from 'react'

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
  }
  places: {
    name: string
    place_type: string | null
  } | null
}

interface DashboardContentProps {
  user: User
  records: Record[]
}

export default function DashboardContent({ user, records }: DashboardContentProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      if (response.ok) {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                CinemaLog ダッシュボード
              </h1>
              <p className="text-gray-600 mt-1">
                こんにちは、{user.user_metadata?.display_name || user.email} さん
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/records/new"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                新しい記録を追加
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? 'ログアウト中...' : 'ログアウト'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">総鑑賞数</h3>
          <p className="text-3xl font-bold text-indigo-600">{records.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">今月の鑑賞数</h3>
          <p className="text-3xl font-bold text-green-600">
            {records.filter(record => {
              const watchedDate = new Date(record.watched_at)
              const now = new Date()
              return watchedDate.getMonth() === now.getMonth() && 
                     watchedDate.getFullYear() === now.getFullYear()
            }).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">平均評価</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {records.filter(r => r.rating).length > 0
              ? (records.filter(r => r.rating).reduce((sum, r) => sum + (r.rating || 0), 0) /
                 records.filter(r => r.rating).length).toFixed(1)
              : '---'}
          </p>
        </div>
      </div>

      {/* Recent Records */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">最近の鑑賞記録</h2>
            <Link
              href="/records"
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              すべて見る →
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {records.length > 0 ? (
            records.map((record) => (
              <div key={record.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {record.movies.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      監督: {record.movies.director || '不明'} 
                      {record.movies.release_year && ` (${record.movies.release_year})`}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      鑑賞場所: {record.places?.name || '不明'}
                    </p>
                    <p className="text-sm text-gray-500">
                      鑑賞日: {new Date(record.watched_at).toLocaleDateString('ja-JP')}
                    </p>
                    {record.memo && (
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                        {record.memo}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {record.rating && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                        ★ {record.rating}/10
                      </span>
                    )}
                    <Link
                      href={`/records/${record.id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      詳細
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">まだ鑑賞記録がありません。</p>
              <Link
                href="/records/new"
                className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
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
