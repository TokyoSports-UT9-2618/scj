export default function MembersPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <h1 className="text-3xl font-bold text-navy-900 mb-8 border-l-4 border-accent-gold pl-4">会員専用ページ</h1>

                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                    <p className="text-gray-600 mb-6">
                        このページは会員限定コンテンツです。閲覧にはログインが必要です。
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center py-8 bg-gray-50 rounded-lg">
                        <div className="text-center">
                            <span className="material-icons text-5xl text-gray-300 mb-2 block">lock</span>
                            <p className="text-sm text-gray-500">Member Access Required</p>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <button className="bg-navy-900 text-white px-8 py-3 rounded hover:bg-navy-800 transition-colors">
                            ログイン画面へ進む
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
