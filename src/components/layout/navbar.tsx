"use client"

import Link from "next/link"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/70 backdrop-blur-xl">
      <nav className="fc-page-wrap flex items-center justify-between py-3">
        <Link href="/" className="fc-display text-3xl text-[#17412b]">
          FootyConnects
        </Link>

        <div className="flex items-center gap-2 sm:gap-4 text-sm sm:text-base text-[#1f4c33]">
          <Link href="/products" className="rounded-full px-3 py-2 hover:bg-[#edf5ee] transition-colors">
            Products
          </Link>
          <Link href="/login" className="rounded-full px-3 py-2 hover:bg-[#edf5ee] transition-colors">
            Login
          </Link>
          <Link
            href="/register"
            className="fc-btn fc-btn-primary px-4 py-2 text-sm sm:text-base"
          >
            Register
          </Link>
        </div>
      </nav>
    </header>
  )
}