import Spline from '@splinetool/react-spline';

function HeroCover({ onShopNow }) {
  return (
    <section className="relative w-full h-[70vh] md:h-[78vh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/IKzHtP5ThSO83edK/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/10 via-neutral-950/40 to-neutral-950 pointer-events-none" />

      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-xs text-white/80 mb-4">
            <span className="size-1.5 rounded-full bg-green-400" />
            Live payments demo with Razorpay
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">Slice of the future. Fresh code. Hot pizzas.</h2>
          <p className="mt-4 text-white/70 max-w-xl">Modern fullstack pizza shop with a secure checkout and a real-time sales dashboard. Built on React, Tailwind, and Razorpay Checkout.</p>
          <div className="mt-8 flex items-center gap-3">
            <button onClick={onShopNow} className="px-5 py-2.5 rounded bg-white text-black font-medium hover:opacity-90">Order now</button>
            <a href="#menu" onClick={(e)=>{e.preventDefault(); onShopNow?.();}} className="px-5 py-2.5 rounded border border-white/20 hover:border-white/40">View menu</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroCover;
