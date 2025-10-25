import { useMemo, useState } from 'react';

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-sdk')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function currencyFormat(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function Checkout({ cart, total, onQtyChange, onClear, onSuccess }) {
  const [isPaying, setIsPaying] = useState(false);
  const isEmpty = cart.length === 0;

  const itemsTotalText = useMemo(() => currencyFormat(total), [total]);

  const handlePay = async () => {
    setIsPaying(true);
    const sdkOk = await loadRazorpayScript();
    if (!sdkOk) {
      alert('Failed to load Razorpay SDK. Check your network and try again.');
      setIsPaying(false);
      return;
    }
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(total * 100), currency: 'INR', receipt: `rcpt_${Date.now()}` }),
      });

      if (!res.ok) {
        throw new Error('Backend order creation failed');
      }
      const order = await res.json();

      const options = {
        key: RAZORPAY_KEY_ID,
        name: 'Volt Pizza',
        description: 'Pizza Order Payment',
        image: 'https://emojiapi.dev/api/v1/pizza.svg',
        order_id: order.id,
        amount: order.amount,
        currency: order.currency || 'INR',
        theme: { color: '#ffffff' },
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999',
        },
        notes: { platform: 'web', app: 'volt-pizza' },
        handler: async function (response) {
          try {
            const v = await fetch(`${BACKEND_BASE_URL}/api/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_id: order.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const vjson = await v.json().catch(() => ({}));
            if (!v.ok || !vjson?.valid) {
              alert('Payment captured but verification failed. Please contact support with your Payment ID.');
            }
            onSuccess?.({ ...response, order_id: order.id });
          } catch (err) {
            console.error(err);
            onSuccess?.({ order_id: order.id, ...response });
          }
        },
        modal: {
          ondismiss: function () {},
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      if (!BACKEND_BASE_URL || !RAZORPAY_KEY_ID) {
        alert('Razorpay demo not configured. Set VITE_API_BASE_URL and VITE_RAZORPAY_KEY_ID in .env and run backend with /api/create-order and /api/verify-payment.');
      } else {
        alert('Unable to start payment. Please try again.');
      }
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h3 className="text-2xl font-semibold tracking-tight">Your Cart</h3>
        <p className="text-white/60 mt-2">Review items and proceed to secure checkout.</p>

        <div className="mt-6 space-y-4">
          {isEmpty && (
            <div className="p-6 rounded-xl border border-white/10 bg-white/5">Your cart is empty. Add some pizzas from the menu.</div>
          )}
          {!isEmpty && cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="size-16 rounded overflow-hidden">
                <img src={`https://source.unsplash.com/collection/404339/128x128?sig=${item.id}`} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-white/60">₹{item.price} each</div>
                  </div>
                  <div className="text-right font-medium">{currencyFormat(item.price * item.qty)}</div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => onQtyChange?.(item.id, Math.max(0, item.qty - 1))} className="size-8 flex items-center justify-center rounded bg-white/10">-</button>
                  <span className="min-w-8 text-center">{item.qty}</span>
                  <button onClick={() => onQtyChange?.(item.id, item.qty + 1)} className="size-8 flex items-center justify-center rounded bg-white/10">+</button>
                  <button onClick={() => onQtyChange?.(item.id, 0)} className="ml-4 text-sm text-white/60 hover:text-white">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isEmpty && (
          <button onClick={onClear} className="mt-4 text-sm text-white/60 hover:text-white">Clear cart</button>
        )}
      </div>

      <aside className="lg:col-span-1">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h4 className="font-medium">Summary</h4>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Items</span>
              <span>{itemsTotalText}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery</span>
              <span>Free</span>
            </div>
            <div className="border-t border-white/10 my-2" />
            <div className="flex items-center justify-between font-medium">
              <span>Total</span>
              <span>{itemsTotalText}</span>
            </div>
          </div>
          <button
            disabled={isEmpty || isPaying}
            onClick={handlePay}
            className={`mt-6 w-full px-4 py-2.5 rounded font-medium ${isEmpty || isPaying ? 'bg-white/20 cursor-not-allowed' : 'bg-white text-black hover:opacity-90'}`}
          >
            {isPaying ? 'Starting Razorpay...' : 'Pay with Razorpay'}
          </button>
          <p className="text-xs text-white/50 mt-3">Use Razorpay Test Mode keys to try the flow. Backend endpoints required: POST /api/create-order and POST /api/verify-payment.</p>
        </div>
      </aside>
    </div>
  );
}

export default Checkout;
