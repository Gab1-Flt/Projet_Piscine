import React, { useState } from 'react';
import { 
  Search, Bell, MessageSquare, User, Grid, List, Shield, 
  ShoppingCart, Timer, SlidersHorizontal, ArrowUpRight, 
  Check, X, Zap, Cpu, Compass, Landmark
} from 'lucide-react';

function App() {
  // Products dataset matching Stitch designs and database init.sql
  const initialProducts = [
    {
      id: 1,
      brand: 'Nissan',
      model: 'Skyline R34 GT-R V-Spec',
      year: 1999,
      price: 185000,
      mileage: 42000,
      chassis: 'BNR34-001245',
      engine: 'RB26DETT',
      power: '276 HP (Est.)',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYHi8qgkPyuiftrZVdjQQwE4Eh7S158JuDGf2KJyFbAw4_KWz5d4jb56mQAqWwjei9durzUYfFKGEcqwY7tRbAFsG2V9SdRFM8_yOmMtdP-yeB2RSFav-20zapB5A2-eLNo1kVnIqHo-POlbW5KxaxTogcAEnl5734j-HI8ydyidVNsbUvFB2exBJWtgnyc4OqLMPJ3rvxKyXWl7HL8f0q8XDTPtQi4fVT27C-2shtfJlBWkwwnE48FdyHlVzDv4IJCqDPhX9qVpuS',
      category: 'JDM Cars',
      status: 'Auction Live',
      verified: true
    },
    {
      id: 2,
      brand: 'Toyota',
      model: 'Supra RZ MK4',
      year: 1994,
      price: 95000,
      mileage: 82000,
      chassis: 'JZA80-004561',
      engine: '2JZ-GTE',
      power: '320 HP',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDSmJnIPbRjQaMNC1mHAisMSOoLuNqShjOz7DWIKtIg3yh_kD7839JfpBJPcbJfOn5wJi2zX0OolZH1QQMxMgRSNO9_8Vu3NkqQT1eZyvYICQH67HV5W9HT-ADfP83VaY5DX4vhuGqveqbUP_BeFLoYr4nAfh6R2gb_h5zhTMNF2lYv4ovJ7CSVWnlWW87jX_Y7YQfjYpSS6Lk4GmdzIl-alIhGDjNq0zI2tHfz7PtvN7LA-Nw92WC9WMgFmLDnKUBF0w5gWMyD0AP',
      category: 'JDM Cars',
      status: 'Direct Sale',
      verified: false
    },
    {
      id: 3,
      brand: 'HKS',
      model: 'GTIII-RS Sports Turbine Kit',
      year: 2024,
      price: 2450,
      chassis: 'Specs: Bolt-On',
      engine: 'Fits: RB25DET / SR20DET',
      power: 'Target: Up to 450hp',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFS_XUZxgUN809E7Tkl0nMfYsklWjXQomaFH_9Ehqim3Om8JpnDOo8Ms6GRPKjL7oiIN9Kowkch3-CjgZ-E-5oKxmeVDcHyc7cFJtsANv5KV6JMpeSmZX2T-P_eICndaeXgb1PhgCsIjmLwtzi8zhOMkwsdoIZSGx_pNwEvwwe1NS-iSLURfcT8U497XBOCuA9mg2NBGodYm8SgBO0qFDs1qHGp9IR1LLOMPX1svBVrxS7phBWKfaNiKO-n15c8084RcTvKW-6cUXE',
      category: 'Performance Parts',
      status: 'Precision Engineered',
      verified: true
    },
    {
      id: 4,
      brand: 'Mazda',
      model: 'RX-7 FD3S Spirit R Type A',
      year: 2002,
      price: 95000,
      mileage: 56000,
      chassis: 'FD3S-600452',
      engine: '13B-REW Rotary',
      power: '276 HP',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
      category: 'JDM Cars',
      status: 'Direct Sale',
      verified: true
    },
    {
      id: 5,
      brand: 'Honda',
      model: 'NSX-R NA2',
      year: 2002,
      price: 220000,
      mileage: 24000,
      chassis: 'NA2-100234',
      engine: 'C32B V6',
      power: '290 HP',
      image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80',
      category: 'JDM Cars',
      status: 'Auction Live',
      verified: true
    },
    {
      id: 6,
      brand: 'Mugen',
      model: 'GP Wheels 18" Bronze Set',
      year: 2023,
      price: 3200,
      chassis: 'Size: 18x8.5J +45',
      engine: 'Fits: Civic Type R FK8/FL5',
      power: 'Weight: 7.8kg/wheel',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
      category: 'Accessories',
      status: 'Performance Grade',
      verified: false
    }
  ];

  // Core state management
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['JDM Cars', 'Performance Parts', 'Accessories']);
  const [selectedBrand, setSelectedBrand] = useState(null); // 'Nissan', 'Toyota', etc.
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [cartCount, setCartCount] = useState(0);
  
  // Bidding state variables
  const [biddingProduct, setBiddingProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidSuccess, setBidSuccess] = useState(false);
  const [bidHistory, setBidHistory] = useState([
    { bidder: 'keiichi_tsuchiya', amount: 180000, date: '10 min ago' },
    { bidder: 'takumi_86', amount: 175000, date: '2 hours ago' }
  ]);

  // Handle category checkbox change
  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Toggle brand selection
  const handleBrandSelect = (brand) => {
    if (selectedBrand === brand) {
      setSelectedBrand(null); // Clear filter
    } else {
      setSelectedBrand(brand);
    }
  };

  // Filter products dynamically
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.engine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.chassis.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategories.includes(product.category);
    const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;

    return matchesSearch && matchesCategory && matchesBrand;
  });

  // Handle Bidding Submission
  const handleBidSubmit = (e) => {
    e.preventDefault();
    const numericBid = parseFloat(bidAmount);
    if (isNaN(numericBid) || numericBid <= biddingProduct.price) {
      alert(`Votre offre doit être supérieure à l'offre actuelle ($${biddingProduct.price.toLocaleString()})`);
      return;
    }

    // Update bidding details
    setProducts(products.map(p => {
      if (p.id === biddingProduct.id) {
        return { ...p, price: numericBid };
      }
      return p;
    }));

    setBidHistory([
      { bidder: 'Vous (gabin_lead)', amount: numericBid, date: 'À l\'instant' },
      ...bidHistory
    ]);

    setBidSuccess(true);
    setTimeout(() => {
      setBiddingProduct(null);
      setBidSuccess(false);
      setBidAmount('');
    }, 1800);
  };

  // Add to cart notification trigger
  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] antialiased overflow-x-hidden font-sans pt-24 selection:bg-primary selection:text-[#460283]">
      
      {/* Dynamic Background Radial Gradients simulating Tokyo Neon glow */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-0 w-[35vw] h-[35vw] rounded-full bg-secondary/5 blur-[120px] pointer-events-none"></div>

      {/* TopNavBar */}
      <nav className="bg-[#131313]/80 backdrop-blur-xl fixed top-0 w-full z-40 border-b border-white/10 shadow-[0_0_20px_rgba(187,134,252,0.1)]">
        <div className="flex justify-between items-center h-20 px-4 md:px-16 w-full max-w-[1440px] mx-auto">
          {/* Brand */}
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded bg-[#bb86fc] flex items-center justify-center font-black tracking-tighter text-[#460283] italic text-lg shadow-[0_0_12px_rgba(187,134,252,0.4)]">
              MN
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider text-[#dab9ff] italic uppercase">MERCATO <span className="text-[#ffb2bc]">NOVA</span></span>
              <p className="text-[9px] text-[#cdc3d4]/50 font-mono tracking-widest -mt-1 uppercase">Tokyo Underground</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex gap-8 items-center font-semibold text-sm">
            <a className="text-[#bb86fc] border-b-2 border-[#bb86fc] pb-1 cursor-pointer transition-colors" href="#">Cars</a>
            <a className="text-[#cdc3d4] hover:text-[#e5e2e1] px-3 py-2 rounded hover:bg-white/5 transition-all duration-200" href="#">Parts</a>
            <a className="text-[#cdc3d4] hover:text-[#e5e2e1] px-3 py-2 rounded hover:bg-white/5 transition-all duration-200" href="#">Auctions</a>
            <a className="text-[#cdc3d4] hover:text-[#e5e2e1] px-3 py-2 rounded hover:bg-white/5 transition-all duration-200" href="#">Builds</a>
          </div>

          {/* Search Bar & Trailing Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Search Field */}
            <div className="relative group input-glow border border-white/10 rounded-lg bg-[#1c1b1b] transition-all duration-300 w-44 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#cdc3d4] w-4.5 h-4.5" />
              <input 
                className="w-full bg-transparent border-none text-[#e5e2e1] font-mono text-xs pl-10 pr-4 py-2.5 focus:outline-none focus:ring-0 placeholder-[#cdc3d4]/30" 
                placeholder="Chassis, Moteur, Pièces..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="flex gap-2.5">
              <button className="text-[#cdc3d4] hover:text-[#bb86fc] hover:bg-white/5 p-2 rounded-full transition-all relative active:scale-95">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              </button>
              <button className="text-[#cdc3d4] hover:text-[#bb86fc] hover:bg-white/5 p-2 rounded-full transition-all relative active:scale-95">
                <MessageSquare size={20} />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-secondary"></span>
              </button>
              
              {/* Shopping Cart Indicator */}
              <button className="text-[#cdc3d4] hover:text-[#bb86fc] hover:bg-white/5 p-2 rounded-full transition-all relative active:scale-95">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary text-[9px] text-[#400013] font-bold flex items-center justify-center animate-bounce shadow-[0_0_8px_rgba(255,178,188,0.5)]">
                    {cartCount}
                  </span>
                )}
              </button>

              <button className="text-[#cdc3d4] hover:text-[#bb86fc] hover:bg-white/5 p-2 rounded-full transition-all active:scale-95">
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Layout */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 grid grid-cols-4 lg:grid-cols-12 gap-6">
        
        {/* Sidebar / Filter Panel */}
        <aside className="col-span-4 lg:col-span-3 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/5">
            <div className="flex items-center space-x-2.5 mb-6">
              <SlidersHorizontal className="text-[#bb86fc]" size={18} />
              <h3 className="font-bold text-base tracking-wide font-sans">Refine Search</h3>
            </div>
            
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <h4 className="text-[11px] font-bold text-[#cdc3d4]/50 uppercase tracking-widest mb-3">Categories</h4>
                <ul className="space-y-2.5">
                  {['JDM Cars', 'Performance Parts', 'Accessories'].map((cat) => (
                    <li key={cat}>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          checked={selectedCategories.includes(cat)} 
                          onChange={() => handleCategoryChange(cat)}
                          className="form-checkbox bg-[#201f1f] border-white/10 text-[#bb86fc] focus:ring-[#bb86fc] rounded cursor-pointer" 
                          type="checkbox"
                        />
                        <span className="text-sm text-[#e5e2e1] group-hover:text-[#bb86fc] transition-colors">
                          {cat}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Makes */}
              <div className="pt-5 border-t border-white/5">
                <h4 className="text-[11px] font-bold text-[#cdc3d4]/50 uppercase tracking-widest mb-3">Make / Brands</h4>
                <div className="flex flex-wrap gap-2">
                  {['Nissan', 'Toyota', 'Honda', 'Mazda', 'HKS', 'Mugen'].map((brand) => (
                    <button 
                      key={brand}
                      onClick={() => handleBrandSelect(brand)}
                      className={`px-3.5 py-1.5 rounded-full border transition-all font-mono text-xs cursor-pointer ${
                        selectedBrand === brand 
                          ? 'border-[#bb86fc] text-[#bb86fc] bg-[#bb86fc]/10 shadow-[0_0_10px_rgba(187,134,252,0.25)]' 
                          : 'border-white/10 text-[#cdc3d4] hover:border-[#bb86fc]/50 hover:text-[#bb86fc]'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* System Stats Block */}
              <div className="pt-6 border-t border-white/5 bg-[#1c1b1b]/30 p-4 rounded-xl">
                <div className="flex items-center space-x-2 text-[#ffb2bc] mb-2">
                  <Zap size={14} />
                  <span className="text-xs font-bold uppercase tracking-wider">Syndicate Hub</span>
                </div>
                <p className="text-[11px] text-[#cdc3d4]/65 leading-relaxed font-mono">
                  Database connected (MAMP OK). Active bid feeds online. Escrow system validated.
                </p>
              </div>

            </div>
          </div>
        </aside>

        {/* Product Grid Catalog */}
        <section className="col-span-4 lg:col-span-9 space-y-6">
          
          {/* Section Header */}
          <div className="flex justify-between items-end border-b border-white/5 pb-4">
            <div>
              <div className="inline-flex items-center space-x-2.5 bg-[#7e273b]/20 border border-[#ffb2bc]/30 px-3 py-1 rounded-full text-xs text-[#ffb2bc] mb-3">
                <Compass size={13} className="animate-spin" style={{ animationDuration: '6s' }} />
                <span>Tokyo Drift Syndicate Marketplace</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#e5e2e1] uppercase">
                Legendary Performance
              </h1>
              <p className="text-xs text-[#cdc3d4] mt-1 font-mono">
                {filteredProducts.length} legends verified under the underground syndicate.
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="hidden sm:flex gap-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded border cursor-pointer transition-all ${
                  viewMode === 'grid' 
                    ? 'glass-panel text-primary border-primary neon-glow-primary' 
                    : 'glass-panel border-white/15 text-[#cdc3d4] hover:text-[#e5e2e1]'
                }`}
              >
                <Grid size={16} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded border cursor-pointer transition-all ${
                  viewMode === 'list' 
                    ? 'glass-panel text-primary border-primary neon-glow-primary' 
                    : 'glass-panel border-white/15 text-[#cdc3d4] hover:text-[#e5e2e1]'
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Catalog Grid */}
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 gap-6"
            : "space-y-4"
          }>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className={`glass-panel rounded-2xl overflow-hidden group hover:neon-glow-primary transition-all duration-300 border border-white/5 flex flex-col ${
                    viewMode === 'list' ? 'md:flex-row' : ''
                  }`}
                >
                  {/* Photo Container */}
                  <div className={`relative overflow-hidden bg-[#2a2a2a] ${
                    viewMode === 'list' ? 'h-48 md:w-72 md:h-full flex-shrink-0' : 'h-56 w-full'
                  }`}>
                    <img 
                      alt={product.model} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85" 
                      src={product.image}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/20 to-transparent"></div>
                    
                    {/* Floating Info */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                      {product.verified && (
                        <span className="bg-[#bb86fc] text-[#460283] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_8px_rgba(187,134,252,0.4)] flex items-center gap-1">
                          <Check size={9} strokeWidth={3} /> Verified
                        </span>
                      )}
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-white/10 ${
                        product.status === 'Auction Live' 
                          ? 'bg-secondary-dark/45 text-secondary border-[#ffb2bc]/30' 
                          : 'bg-[#1c1b1b] text-zinc-300'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-[#ffb2bc] text-[10px] font-mono uppercase tracking-widest">{product.brand}</span>
                          <h3 className="font-extrabold text-base md:text-lg group-hover:text-primary transition-colors text-zinc-100">
                            {product.year} {product.model}
                          </h3>
                        </div>
                        {product.category === 'JDM Cars' && (
                          <div className="text-right">
                            <span className="text-[9px] text-[#cdc3d4]/40 font-mono block">Current Value</span>
                            <span className="font-extrabold text-[#bb86fc] tracking-tight font-mono">
                              ${product.price.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Technical specifications */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 my-4 border-t border-b border-white/5 py-3 font-mono text-[11px] text-[#cdc3d4]/70">
                        <div>
                          <span className="text-[#cdc3d4]/30 block text-[9px] uppercase tracking-wider">CHASSIS / GRADE</span>
                          <span className="font-semibold text-zinc-200">{product.chassis}</span>
                        </div>
                        {product.mileage ? (
                          <div>
                            <span className="text-[#cdc3d4]/30 block text-[9px] uppercase tracking-wider">ODOMETER</span>
                            <span className="font-semibold text-zinc-200">{product.mileage.toLocaleString()} km</span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-[#cdc3d4]/30 block text-[9px] uppercase tracking-wider">RATING</span>
                            <span className="font-semibold text-[#17deca]">{product.status}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-[#cdc3d4]/30 block text-[9px] uppercase tracking-wider">ENGINE</span>
                          <span className="font-semibold text-zinc-200">{product.engine}</span>
                        </div>
                        <div>
                          <span className="text-[#cdc3d4]/30 block text-[9px] uppercase tracking-wider">POWER / TARGET</span>
                          <span className="font-semibold text-zinc-200">{product.power}</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Action Block */}
                    <div className="flex justify-between items-center gap-3 mt-4 pt-1">
                      {product.category !== 'JDM Cars' ? (
                        <>
                          <div className="font-extrabold text-base md:text-lg text-zinc-100 font-mono">
                            ${product.price.toLocaleString()}
                          </div>
                          <button 
                            onClick={handleAddToCart}
                            className="bg-white/10 hover:bg-white/20 text-[#e5e2e1] text-xs font-semibold px-4.5 py-2.5 rounded-lg transition-all cursor-pointer active:scale-95"
                          >
                            Add to Cart
                          </button>
                        </>
                      ) : product.status === 'Auction Live' ? (
                        <>
                          <div className="flex items-center space-x-1.5 text-xs text-[#ffb2bc] font-semibold animate-pulse">
                            <Timer size={14} />
                            <span>6j 23h rem.</span>
                          </div>
                          <button 
                            onClick={() => setBiddingProduct(product)}
                            className="neon-border-btn text-xs font-bold px-6 py-2.5 rounded-lg uppercase tracking-wider cursor-pointer active:scale-95"
                          >
                            Place Bid
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center space-x-1.5 text-xs text-[#17deca] font-semibold">
                            <Landmark size={14} />
                            <span>Escrow Verified</span>
                          </div>
                          <button 
                            onClick={() => alert(`Négociation ouverte pour la ${product.model}. Une fois le backend connecté par Nicolas, cette action enverra une offre en base.`)}
                            className="bg-white/10 hover:bg-[#ffb2bc]/15 border border-white/10 hover:border-[#ffb2bc]/30 text-[#e5e2e1] text-xs font-bold px-5 py-2.5 rounded-lg uppercase tracking-wider cursor-pointer transition-all active:scale-95"
                          >
                            Negot. Price
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center glass-panel rounded-2xl border border-white/5">
                <p className="text-zinc-500 text-sm font-mono mb-2">Aucun bolide trouvé dans la base.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedBrand(null); setSelectedCategories(['JDM Cars', 'Performance Parts', 'Accessories']); }}
                  className="text-[#bb86fc] text-xs font-semibold hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {filteredProducts.length > 0 && (
            <div className="flex justify-center pt-8">
              <button 
                onClick={() => alert("Inventaire complet chargé. Gabin ajoutera la pagination lors de l'intégration finale avec Célestin.")}
                className="neon-border-btn text-xs font-bold px-8 py-3 rounded-full uppercase tracking-widest text-[#e5e2e1] hover:text-[#bb86fc] cursor-pointer active:scale-95"
              >
                Load More Inventory
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Interactive Bidding Modal */}
      {biddingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blurring the background */}
          <div 
            onClick={() => setBiddingProduct(null)} 
            className="absolute inset-0 bg-[#000]/70 backdrop-blur-md cursor-pointer"
          ></div>
          
          <div className="glass-panel w-full max-w-lg rounded-2xl overflow-hidden relative z-10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-white/5 flex justify-between items-center bg-[#1c1b1b]/70">
              <div className="flex items-center space-x-2">
                <Timer className="text-secondary" size={18} />
                <h3 className="font-extrabold text-base uppercase tracking-wider">Place Syndicate Bid</h3>
              </div>
              <button 
                onClick={() => setBiddingProduct(null)}
                className="text-[#cdc3d4]/50 hover:text-white p-1 rounded-full hover:bg-white/5 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              
              {bidSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-16 h-16 bg-[#17deca]/10 border border-[#17deca]/30 rounded-full flex items-center justify-center mx-auto text-[#17deca]">
                    <Check size={28} className="animate-in zoom-in duration-300" />
                  </div>
                  <h4 className="font-bold text-lg text-zinc-100">Bidding Registered!</h4>
                  <p className="text-xs font-mono text-[#cdc3d4]/70">
                    Votre offre a été enregistrée avec succès. Base de données synchronisée.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex space-x-4">
                    <img 
                      alt={biddingProduct.model} 
                      className="w-24 h-18 object-cover rounded-lg border border-white/10 flex-shrink-0"
                      src={biddingProduct.image}
                    />
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">{biddingProduct.brand}</span>
                      <h4 className="font-extrabold text-sm text-zinc-200">{biddingProduct.year} {biddingProduct.model}</h4>
                      <p className="text-xs text-[#bb86fc] font-mono font-bold mt-1">
                        Current Bid: ${biddingProduct.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Place Bid Input Form */}
                  <form onSubmit={handleBidSubmit} className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#cdc3d4]/50 font-mono">
                        Votre offre (USD)
                      </label>
                      <div className="relative rounded-lg border border-white/10 input-glow bg-[#1c1b1b]">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-sm text-[#cdc3d4]/40">$</span>
                        <input 
                          required
                          type="number"
                          className="w-full bg-transparent border-none py-3 pl-8 pr-4 text-sm font-mono text-white focus:outline-none focus:ring-0 placeholder-zinc-700"
                          placeholder={`${(biddingProduct.price + 1000).toString()}`}
                          min={biddingProduct.price + 1}
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 block">
                        Min. Increment: $1 USD. Place custom amounts.
                      </span>
                    </div>

                    {/* Active Bid History */}
                    <div className="bg-[#1c1b1b]/50 p-4 rounded-xl space-y-2.5">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">Direct Syndicate Bidding History</span>
                      <div className="space-y-2 max-h-24 overflow-y-auto pr-1">
                        {bidHistory.map((historyItem, i) => (
                          <div key={i} className="flex justify-between items-center text-xs">
                            <span className="font-mono text-[#cdc3d4]">{historyItem.bidder}</span>
                            <div className="space-x-3 text-right">
                              <span className="font-mono font-bold text-[#bb86fc]">${historyItem.amount.toLocaleString()}</span>
                              <span className="text-[10px] text-zinc-500 font-mono">{historyItem.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-[#bb86fc] hover:bg-[#bb86fc]/80 text-[#460283] font-bold text-xs py-3 rounded-lg uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center space-x-1.5 shadow-[0_0_20px_rgba(187,134,252,0.3)]"
                    >
                      <Zap size={14} />
                      <span>Confirm Syndicate Bid</span>
                    </button>
                  </form>
                </>
              )}

            </div>
          </div>
        </div>
      )}

      {/* BottomNavBar (Mobile Only) */}
      <nav className="bg-[#1c1b1b]/90 backdrop-blur-md text-[#bb86fc] fixed bottom-0 w-full z-40 rounded-t-2xl border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] flex justify-around items-center h-16 px-4 lg:hidden">
        <button 
          onClick={() => { setSelectedCategories(['JDM Cars', 'Performance Parts', 'Accessories']); setSelectedBrand(null); }}
          className="flex flex-col items-center justify-center text-[#bb86fc] filter drop-shadow-[0_0_8px_rgba(187,134,252,0.6)] active:scale-105 transition-transform"
        >
          <Compass size={18} className="mb-0.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Shop</span>
        </button>
        <button 
          onClick={() => { setSelectedCategories(['JDM Cars']); setSelectedBrand(null); }}
          className="flex flex-col items-center justify-center text-[#cdc3d4] hover:text-[#bb86fc] active:scale-105 transition-transform"
        >
          <Timer size={18} className="mb-0.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Bid</span>
        </button>
        <button 
          onClick={() => alert("Messagerie (Paul/Nicolas) - Bientôt en ligne")}
          className="flex flex-col items-center justify-center text-[#cdc3d4] hover:text-[#bb86fc] active:scale-105 transition-transform relative"
        >
          <MessageSquare size={18} className="mb-0.5" />
          <span className="absolute top-1 right-3.5 w-1.5 h-1.5 rounded-full bg-secondary"></span>
          <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Inbox</span>
        </button>
        <button 
          onClick={() => alert("Votre Garage - En cours d'implémentation par Célestin (Auth/Profil)")}
          className="flex flex-col items-center justify-center text-[#cdc3d4] hover:text-[#bb86fc] active:scale-105 transition-transform"
        >
          <User size={18} className="mb-0.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Profile</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="bg-[#0e0e0e] border-t border-white/5 py-12 text-[#cdc3d4]/40 text-xs font-mono">
        <div className="max-w-[1440px] mx-auto px-4 md:px-16 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p>© 2026 Mercato Nova. Tous droits réservés.</p>
          <div className="flex space-x-6 text-[10px] uppercase">
            <span className="hover:text-white cursor-pointer">Conditions</span>
            <span className="hover:text-white cursor-pointer">Escrow Shield</span>
            <span className="hover:text-white cursor-pointer">API Status</span>
          </div>
          <div className="flex items-center space-x-2 text-[10px] uppercase text-[#ffb2bc]">
            <Shield size={12} />
            <span>Syndicate Secure Escrow Shield</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
