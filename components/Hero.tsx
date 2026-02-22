import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
    return (
        <section className="relative h-[600px] md:h-[700px] w-full overflow-hidden bg-navy-900">
            {/* Background Image/Video Placeholder */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/Gemini_Generated_Image_rbg5nurbg5nurbg5.png"
                    alt="日本スポーツコミッション"
                    fill
                    priority
                    className="object-cover opacity-60 mix-blend-overlay"
                />
                {/* Dark Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/40 to-transparent" />
            </div>

            <div className="container mx-auto px-4 md:px-6 h-full flex items-center relative z-10">
                <div className="max-w-3xl text-white">
                    <span className="inline-block py-1 px-3 border border-accent-gold text-accent-gold text-sm font-medium tracking-wider mb-6 rounded">
                        Sports Commission of Japan
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
                        スポーツの力で、<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                            地域と未来をつなぐ。
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl">
                        私たちは、まちづくり・地域づくりの視点からスポーツを活用し、
                        持続可能な地域の活性化を実現する調査研究・活動組織です。
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/about"
                            className="px-8 py-4 bg-accent-gold text-navy-900 font-bold rounded-lg hover:bg-white transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            私たちについて
                        </Link>
                        <Link
                            href="/projects"
                            className="px-8 py-4 bg-transparent border border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300 text-center"
                        >
                            活動実績を見る
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
