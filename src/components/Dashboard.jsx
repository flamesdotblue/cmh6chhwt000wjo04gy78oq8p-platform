import { useMemo } from 'react';

function groupByDate(orders) {
  const map = new Map();
  orders.forEach((o) => {
    const d = new Date(o.createdAt);
    const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
    map.set(key, (map.get(key) || 0) + (o.amount || 0));
  });
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
    return { key, label: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }), value: map.get(key) || 0 };
  });
  return days;
}

function currency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function Dashboard({ orders }) {
  const totals = useMemo(() => {
    const paid = orders.filter((o) => o.status === 'paid');
    const revenue = paid.reduce((s, o) => s + (o.amount || 0), 0);
    const count = paid.length;
    const aov = count ? Math.round(revenue / count) : 0;
    return { revenue, count, aov, paid };
  }, [orders]);

  const series = useMemo(() => groupByDate(totals.paid), [totals]);
  const maxVal = Math.max(1, ...series.map((d) => d.value));

  return (
    <div>
      <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">Sales Dashboard</h3>
      <p className="text-white/60 mt-2">Track revenue and orders generated from your website.</p>

      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/60">Revenue</div>
          <div className="text-2xl font-semibold mt-1">{currency(totals.revenue)}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/60">Orders</div>
          <div className="text-2xl font-semibold mt-1">{totals.count}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/60">Average Order Value</div>
          <div className="text-2xl font-semibold mt-1">{currency(totals.aov)}</div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Revenue (last 7 days)</div>
            <div className="text-sm text-white/60">Includes successfully paid orders</div>
          </div>
        </div>
        <div className="mt-6 h-40 flex items-end gap-2">
          {series.map((d, idx) => {
            const height = Math.round((d.value / maxVal) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gradient-to-t from-orange-500 to-pink-500 rounded-t" style={{ height: `${height}%` }} />
                <div className="mt-2 text-[11px] text-white/60">{d.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="px-5 py-3 border-b border-white/10 font-medium">Recent Orders</div>
        <div className="divide-y divide-white/10">
          {totals.paid.length === 0 && (
            <div className="px-5 py-6 text-white/60">No orders yet. Complete a test checkout to see data here.</div>
          )}
          {totals.paid.slice(0, 10).map((o) => (
            <div key={o.id} className="px-5 py-4 flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{o.id}</div>
                <div className="text-xs text-white/60">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-sm font-medium">{currency(o.amount)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
