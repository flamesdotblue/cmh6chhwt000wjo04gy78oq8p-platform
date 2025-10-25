const PIZZAS = [
  { id: 'marg', name: 'Margherita', desc: 'Classic delight with 100% real mozzarella', price: 299, img: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=1200&auto=format&fit=crop' },
  { id: 'pep', name: 'Pepperoni', desc: 'American classic with spicy pepperoni', price: 399, img: 'https://images.unsplash.com/photo-1541745537413-b804b0c5f34b?q=80&w=1200&auto=format&fit=crop' },
  { id: 'bbq', name: 'BBQ Chicken', desc: 'Smoky chicken with tangy BBQ sauce', price: 449, img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1200&auto=format&fit=crop' },
  { id: 'veg', name: 'Veggie Supreme', desc: 'Loaded with fresh veggies and olives', price: 349, img: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2a?q=80&w=1200&auto=format&fit=crop' },
];

function Menu({ onAdd }) {
  return (
    <div>
      <h3 id="menu" className="text-2xl md:text-3xl font-semibold tracking-tight">Popular Pizzas</h3>
      <p className="text-white/60 mt-2">Handpicked favorites baked to perfection.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {PIZZAS.map((p) => (
          <div key={p.id} className="rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur">
            <div className="aspect-video overflow-hidden">
              <img src={p.img} alt={p.name} className="w-full h-full object-cover hover:scale-[1.02] transition-transform" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{p.name}</h4>
                <span className="text-sm px-2 py-0.5 rounded bg-white/10">₹{p.price}</span>
              </div>
              <p className="text-sm text-white/60 mt-1">{p.desc}</p>
              <button onClick={() => onAdd?.(p)} className="mt-4 w-full px-4 py-2 rounded bg-white text-black font-medium hover:opacity-90">Add to cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
