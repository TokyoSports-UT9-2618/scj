'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { href: '/', label: 'ホーム' },
    { href: '/about', label: '私たちについて' },
    { href: '/projects', label: '実績一覧' },
    { href: '/seminars', label: '研究会・セミナー' },
    { href: '/members', label: '会員専用' },
    { href: '/news', label: 'ニュース' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="SCJ ロゴ"
              width={52}
              height={52}
              className="transition-opacity group-hover:opacity-80"
            />
            <span className="hidden sm:block text-xs text-gray-500 leading-tight">
              一般財団法人<br />日本スポーツコミッション
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-accent-gold ${isActive(link.href) ? 'text-navy-900 font-bold' : 'text-gray-600'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="bg-navy-900 text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-navy-800 transition-colors shadow-sm"
            >
              お問い合わせ
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-navy-900 hover:bg-gray-50 rounded-md"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-50 ${isActive(link.href) ? 'text-navy-900 bg-gray-50' : 'text-gray-600'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="block mx-4 text-center bg-navy-900 text-white px-6 py-3 rounded text-sm font-medium hover:bg-navy-800 transition-colors"
              >
                お問い合わせ
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
