'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

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
  users: {
    display_name: string | null
    email: string
  }
}

interface Comment {
  id: number
  record_id: number
  user_id: string
  content: string
  created_at: string
  updated_at: string
  users: {
    display_name: string | null
    email: string
  }
}

interface RecordDetailProps {
  record: Record
  comments: Comment[]
  currentUserId: string
  isOwner: boolean
}

export default function RecordDetail({ record, comments, currentUserId, isOwner }: RecordDetailProps) {
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [error, setError] = useState('')
  const [localComments, setLocalComments] = useState(comments)
  const [deletingRecord, setDeletingRecord] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmittingComment(true)
    setError('')

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          record_id: record.id,
          user_id: currentUserId,
          content: newComment.trim(),
        })
        .select(`
          *,
          users (display_name, email)
        `)
        .single()

      if (error) throw error

      setLocalComments(prev => [...prev, data])
      setNewComment('')
    } catch (error: any) {
      setError(error.message || 'コメントの投稿に失敗しました')
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDeleteRecord = async () => {
    if (!confirm('この記録を削除しますか？この操作は取り消せません。')) return

    setDeletingRecord(true)
    setError('')

    try {
      const { error } = await supabase
        .from('records')
        .delete()
        .eq('id', record.id)
        .eq('user_id', currentUserId)

      if (error) throw error

      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message || '記録の削除に失敗しました')
      setDeletingRecord(false)
    }
  }

  const generateShareLink = () => {
    const text = `『${record.movies.title}』を観ました！`
    const url = window.location.href
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Main Record */}
      <div className="bg-white shadow rounded-lg mb-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {record.movies.title}
              </h1>
              <p className="text-gray-600">
                {record.users.display_name || record.users.email} の鑑賞記録
              </p>
            </div>
            {record.rating && (
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-lg font-bold">
                ★ {record.rating}/10
              </div>
            )}
          </div>
        </div>

        {/* Movie Details */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">監督:</span>
                <span className="ml-2 text-gray-900">{record.movies.director || '不明'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">公開年:</span>
                <span className="ml-2 text-gray-900">{record.movies.release_year || '不明'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">ジャンル:</span>
                <span className="ml-2 text-gray-900">{record.movies.genre || '不明'}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">鑑賞場所:</span>
                <span className="ml-2 text-gray-900">{record.places?.name || '不明'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">鑑賞日:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(record.watched_at).toLocaleDateString('ja-JP')}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">記録日:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(record.created_at).toLocaleDateString('ja-JP')}
                </span>
              </div>
            </div>
          </div>

          {/* Memo */}
          {record.memo && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">感想・メモ</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{record.memo}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="border-t pt-6 flex flex-wrap gap-4">
            <Link
              href="/records"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              記録一覧に戻る
            </Link>
            
            {isOwner && (
              <>
                <Link
                  href={`/records/${record.id}/edit`}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  編集
                </Link>
                <button
                  onClick={handleDeleteRecord}
                  disabled={deletingRecord}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deletingRecord ? '削除中...' : '削除'}
                </button>
              </>
            )}
            
            <a
              href={generateShareLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Twitterでシェア
            </a>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            コメント ({localComments.length})
          </h2>
        </div>

        {/* Add Comment Form (only for non-owners) */}
        {!isOwner && (
          <div className="px-6 py-4 border-b border-gray-200">
            <form onSubmit={handleCommentSubmit}>
              <textarea
                rows={3}
                maxLength={1000}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="コメントを入力してください..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="mt-2 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {newComment.length} / 1000 文字
                </p>
                <button
                  type="submit"
                  disabled={submittingComment || !newComment.trim()}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingComment ? '投稿中...' : 'コメント投稿'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Comments List */}
        <div className="divide-y divide-gray-200">
          {localComments.length > 0 ? (
            localComments.map((comment) => (
              <div key={comment.id} className="px-6 py-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-gray-900">
                    {comment.users.display_name || comment.users.email}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString('ja-JP')}
                  </div>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              まだコメントがありません
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
