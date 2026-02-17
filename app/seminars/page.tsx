import { Suspense } from 'react';

export default function SeminarsPage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-navy-900 mb-8">研究会・セミナー</h1>
                <p className="text-gray-600 mb-12">
                    最新のスポーツコミッション研究会やセミナーの開催情報、過去のアーカイブをご覧いただけます。
                </p>

                {/* Upcoming Seminars */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-navy-800 border-b-2 border-navy-100 pb-2 mb-6">開催予定</h2>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                        <p className="text-gray-500 text-center">現在、開催予定のセミナーはありません。</p>
                    </div>
                </section>

                {/* Past Archives */}
                <section>
                    <h2 className="text-2xl font-bold text-navy-800 border-b-2 border-navy-100 pb-2 mb-6">過去のアーカイブ</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                            <span className="text-sm text-gray-400">Loading archives...</span>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
