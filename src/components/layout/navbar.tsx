"use client"

import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <Link href="/" className="text-xl font-bold">
        FootyConnects
      </Link>

      <div className="flex gap-4">
        <Link href="/products">Products</Link>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </div>
    </nav>
  )
}