import { Suspense } from 'react';

export default function ProjectsPage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-navy-900 mb-8">実績一覧</h1>
                <p className="text-gray-600 mb-12">
                    日本スポーツコミッションが取り組んできた地域活性化・スポーツ振興の実績をご紹介します。
                </p>

                {/* Placeholder for projects list */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-gray-100 p-8 rounded-lg min-h-[300px] flex items-center justify-center text-gray-400">
                        Projects coming soon...
                    </div>
                </div>
            </div>
        </main>
    );
}
