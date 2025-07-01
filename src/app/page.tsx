export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full space-y-8 text-center">
          <div>
            <h1 className="text-6xl font-extrabold text-white sm:text-7xl md:text-8xl">
              CinemaLog
            </h1>
            <p className="mt-6 text-xl text-indigo-200 sm:text-2xl">
              あなたの映画鑑賞記録を美しく管理
            </p>
            <p className="mt-4 text-lg text-indigo-300 max-w-2xl mx-auto">
              観た映画、感想、評価を記録して、友達と共有しよう。
              すべて無料で使える映画鑑賞記録サービスです。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-900 bg-white hover:bg-indigo-50 transition-colors duration-200 shadow-lg"
            >
              今すぐ始める
            </a>
            <a
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-indigo-900 transition-colors duration-200"
            >
              ログイン
            </a>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-2">記録する</h3>
                <p className="text-indigo-200">
                  観た映画の詳細、感想、評価を簡単に記録
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-2">管理する</h3>
                <p className="text-indigo-200">
                  年別フィルターで過去の記録を簡単に振り返り
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-2">共有する</h3>
                <p className="text-indigo-200">
                  友達とつながってお互いの映画記録にコメント
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
