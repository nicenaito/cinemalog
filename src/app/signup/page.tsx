import { Metadata } from 'next'
import AuthForm from '@/components/auth/AuthForm'

export const metadata: Metadata = {
  title: '新規登録 | CinemaLog',
  description: '映画鑑賞記録サービス CinemaLog に新規登録',
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            CinemaLog に新規登録
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            すでにアカウントをお持ちの方は{' '}
            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              ログイン
            </a>
          </p>
        </div>
        <AuthForm mode="signup" />
      </div>
    </div>
  )
}
