import Link from "next/link"

export default function HomePage() {
  return (
    <main className="fc-page-wrap py-12 sm:py-16">
      <section className="fc-card fc-reveal overflow-hidden p-7 sm:p-10">
        <p className="inline-flex rounded-full border border-[#17412b]/20 bg-[#f2f8f2] px-3 py-1 text-xs tracking-[0.18em] text-[#17412b] uppercase">
          Built For Matchday
        </p>

        <h1 className="fc-display mt-4 text-5xl leading-[0.95] sm:text-7xl text-[#153322]">
          FIND YOUR
          <br />
          PERFECT BOOTS
        </h1>

        <p className="mt-5 max-w-xl text-[#3f5a4b] text-base sm:text-lg leading-relaxed">
          Discover elite football gear curated by position, style, and surface.
          Get recommendations that match your game.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/products" className="fc-btn fc-btn-primary px-6 py-3">
            Shop Collection
          </Link>
          <Link
            href="/register"
            className="fc-btn border border-[#17412b]/20 bg-white/85 px-6 py-3 text-[#17412b]"
          >
            Create Account
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="fc-card fc-reveal p-5" style={{ animationDelay: "90ms" }}>
          <h2 className="font-semibold text-lg">Position-Based Picks</h2>
          <p className="mt-2 text-sm text-[#4f6657]">
            From strikers to keepers, browse gear tuned for your role and movement.
          </p>
        </article>

        <article className="fc-card fc-reveal p-5" style={{ animationDelay: "150ms" }}>
          <h2 className="font-semibold text-lg">Trusted Reviews</h2>
          <p className="mt-2 text-sm text-[#4f6657]">
            Compare real player feedback before you commit to your next setup.
          </p>
        </article>

        <article className="fc-card fc-reveal p-5" style={{ animationDelay: "220ms" }}>
          <h2 className="font-semibold text-lg">Fast Checkout</h2>
          <p className="mt-2 text-sm text-[#4f6657]">
            Secure, quick checkout that gets your gear ready for the next kickoff.
          </p>
        </article>
      </section>
    </main>
  )
}