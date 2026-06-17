export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-900 to-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-yellow-400">
            Sangkuriang777
          </h1>

          <p className="mt-4 text-xl text-gray-300">
            100% Fake • 0% RTP • 100% Entertainment
          </p>

          <p className="mx-auto mt-8 max-w-2xl text-gray-400">
            Welcome to the world's most suspiciously lucky slot experience.
            Every spin is dramatic. Every jackpot is probably photoshopped.
            This website is a fictional parody and does not offer real gambling.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <button className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-black hover:bg-yellow-400">
              Spin Now
            </button>

            <button className="rounded-lg border border-yellow-500 px-6 py-3 font-semibold hover:bg-yellow-500 hover:text-black">
              View Jackpots
            </button>
          </div>
        </div>

        <section className="mt-24 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-yellow-500/30 bg-black/30 p-6">
            <h2 className="text-2xl font-bold text-yellow-400">
              Mega Win
            </h2>
            <p className="mt-3 text-gray-400">
              Watch numbers become bigger numbers.
            </p>
          </div>

          <div className="rounded-xl border border-yellow-500/30 bg-black/30 p-6">
            <h2 className="text-2xl font-bold text-yellow-400">
              Lucky Spin
            </h2>
            <p className="mt-3 text-gray-400">
              Totally random. Definitely not rigged.
            </p>
          </div>

          <div className="rounded-xl border border-yellow-500/30 bg-black/30 p-6">
            <h2 className="text-2xl font-bold text-yellow-400">
              VIP Club
            </h2>
            <p className="mt-3 text-gray-400">
              Exclusive rewards for fictional millionaires.
            </p>
          </div>
        </section>

        <section className="mt-24 text-center">
          <h2 className="text-4xl font-bold text-yellow-400">
            Today's Lucky Winner
          </h2>

          <div className="mt-6 rounded-xl border border-yellow-500/30 bg-black/40 p-8">
            <p className="text-5xl font-bold text-green-400">
              Rp 999.999.999
            </p>

            <p className="mt-2 text-gray-400">
              Won by: xX_RizkyXDian_BL777_Xx
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}