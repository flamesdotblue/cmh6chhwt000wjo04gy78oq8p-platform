import { useEffect, useMemo, useState } from 'react';
import HeroCover from './components/HeroCover';
import Menu from './components/Menu';
import Checkout from './components/Checkout';
import Dashboard from './components/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const addToCart = (item) => {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    setCart((prev) => prev
      .map((p) => (p.id === id ? { ...p, qty } : p))
      .filter((p) => p.qty > 0));
  };

  const clearCart = () => setCart([]);

  const cartTotal = useMemo(
    () => cart.reduce((sum, i) => sum + i.price * i.qty, 0),
    [cart]
  );

  const handlePaymentSuccess = (paymentRecord) => {
    const order = {
      id: paymentRecord.order_id || `local_${Date.now()}`,
      amount: cartTotal,
      currency: 'INR',
      items: cart,
      status: 'paid',
      payment_id: paymentRecord.razorpay_payment_id || null,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="sticky top-0 z-20 backdrop-blur border-b border-white/10 bg-neutral-950/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded bg-gradient-to-br from-orange-500 to-pink-500" />
            <h1 className="font-semibold tracking-tight">Volt Pizza</h1>
          </div>
          <nav className="flex items-center gap-2">
            <button onClick={() => setActiveTab('home')} className={`px-3 py-1.5 rounded text-sm transition ${activeTab==='home'? 'bg-white text-black':'hover:bg-white/10'}`}>Home</button>
            <button onClick={() => setActiveTab('menu')} className={`px-3 py-1.5 rounded text-sm transition ${activeTab==='menu'? 'bg-white text-black':'hover:bg-white/10'}`}>Menu</button>
            <button onClick={() => setActiveTab('checkout')} className={`px-3 py-1.5 rounded text-sm transition ${activeTab==='checkout'? 'bg-white text-black':'hover:bg-white/10'}`}>Checkout ({cart.reduce((n,i)=>n+i.qty,0)})</button>
            <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-1.5 rounded text-sm transition ${activeTab==='dashboard'? 'bg-white text-black':'hover:bg-white/10'}`}>Dashboard</button>
          </nav>
        </div>
      </header>

      {activeTab === 'home' && (
        <HeroCover onShopNow={() => setActiveTab('menu')} />
      )}

      {activeTab === 'menu' && (
        <main className="max-w-7xl mx-auto px-4 py-12">
          <Menu onAdd={addToCart} />
        </main>
      )}

      {activeTab === 'checkout' && (
        <main className="max-w-7xl mx-auto px-4 py-12">
          <Checkout
            cart={cart}
            total={cartTotal}
            onQtyChange={updateQty}
            onClear={clearCart}
            onSuccess={handlePaymentSuccess}
          />
        </main>
      )}

      {activeTab === 'dashboard' && (
        <main className="max-w-7xl mx-auto px-4 py-12">
          <Dashboard orders={orders} />
        </main>
      )}

      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-white/60 flex flex-wrap items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} Volt Pizza. All rights reserved.</span>
          <span>Secure payments by Razorpay • Built with React + Tailwind</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
