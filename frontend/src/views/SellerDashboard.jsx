import React, { useState, useMemo } from 'react';
import { 
  User, LogOut, Cpu, Shield, Plus, Edit2, Trash2, 
  Check, X, TrendingUp, DollarSign, Package, Clock, AlertTriangle,
  Activity, BarChart3, MapPin, Eye, Users, Calendar, Settings, 
  Filter, ArrowUpRight, ArrowDownRight, Zap, Target, MessageSquare, Heart
} from 'lucide-react';

const SellerDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null); // { title: string, message: string, onConfirm: () => void }
  
  // Sort states
  const [auctionSort, setAuctionSort] = useState('date');
  const [offerSort, setOfferSort] = useState('price_desc');
  const [saleSort, setSaleSort] = useState('date_desc');
  
  // Expanded Fake Data
  const [products, setProducts] = useState([
    { 
      id: 1, make: 'Nissan', model: 'Skyline GT-R R34 V-Spec', year: 1999, price: 185000, mileage: 42000, 
      status: 'disponible', sale_type: 'enchere',
      engine: 'RB26DETT 2.6L TT', hp: 280, transmission: 'Manuelle 6 rap.', 
      condition: 'Grade 4.5', location: 'Tokyo, JP', views: 12450, likes: 890, addedAt: '2026-05-10'
    },
    { 
      id: 2, make: 'Toyota', model: 'Supra RZ MK4', year: 1997, price: 95000, mileage: 112000, 
      status: 'disponible', sale_type: 'negociation',
      engine: '2JZ-GTE 3.0L TT', hp: 320, transmission: 'Manuelle 6 rap.', 
      condition: 'Grade 4', location: 'Osaka, JP', views: 8900, likes: 650, addedAt: '2026-05-18'
    },
    { 
      id: 3, make: 'Mazda', model: 'RX-7 Spirit R', year: 2002, price: 120000, mileage: 65000, 
      status: 'disponible', sale_type: 'mixte',
      engine: '13B-REW 1.3L TT', hp: 280, transmission: 'Manuelle 5 rap.', 
      condition: 'Grade 4.5', location: 'Kyoto, JP', views: 5430, likes: 420, addedAt: '2026-05-22'
    }
  ]);
  
  const [auctions, setAuctions] = useState([
    { id: 1, productId: 1, productModel: 'Skyline GT-R R34 V-Spec', currentBid: 192000, highestBidder: 'takumi_86', endDate: '2026-06-01T20:00:00', timeLeft: '3j 14h', bidsCount: 18 },
    { id: 2, productId: 3, productModel: 'RX-7 Spirit R', currentBid: 121000, highestBidder: 'rotary_fan', endDate: '2026-05-30T18:00:00', timeLeft: '1j 12h', bidsCount: 4 }
  ]);
  
  const [offers, setOffers] = useState([
    { id: 1, productId: 2, productModel: 'Supra RZ MK4', buyer: 'drift_king', amount: 90000, status: 'pending', date: '2026-05-27' },
    { id: 2, productId: 3, productModel: 'RX-7 Spirit R', buyer: 'initial_d', amount: 115000, status: 'pending', date: '2026-05-28' },
    { id: 3, productId: 2, productModel: 'Supra RZ MK4', buyer: 'lowballer99', amount: 65000, status: 'rejected', date: '2026-05-26' }
  ]);
  
  const [sales, setSales] = useState([
    { id: 1, productModel: 'Honda NSX Type R', price: 210000, buyer: 'senna_fan', date: '2026-05-15', type: 'enchere' },
    { id: 2, productModel: 'Mitsubishi Lancer Evo VI Tommi Makinen', price: 75000, buyer: 'rally_boy', date: '2026-05-02', type: 'negociation' },
    { id: 3, productModel: 'Subaru Impreza 22B STi', price: 280000, buyer: 'collector_jp', date: '2026-04-18', type: 'enchere' }
  ]);

  const [activities] = useState([
    { id: 1, type: 'offer', message: 'Nouvelle offre de 115 000 € sur RX-7 Spirit R', time: 'Il y a 2 heures' },
    { id: 2, type: 'bid', message: 'Enchère montée à 192 000 € sur Skyline R34', time: 'Il y a 5 heures' },
    { id: 3, type: 'system', message: 'Votre compte vendeur a atteint le statut "Premium"', time: 'Hier' },
    { id: 4, type: 'view', message: 'La Supra RZ a dépassé les 8000 vues', time: 'Il y a 2 jours' },
  ]);

  const [currentProduct, setCurrentProduct] = useState(null);

  const toggleProfile = () => setShowProfileMenu(!showProfileMenu);

  // Sorting Logic
  const sortedAuctions = useMemo(() => {
    return [...auctions].sort((a, b) => {
      if (auctionSort === 'price_desc') return b.currentBid - a.currentBid;
      if (auctionSort === 'price_asc') return a.currentBid - b.currentBid;
      return 0; // Default order
    });
  }, [auctions, auctionSort]);

  const sortedOffers = useMemo(() => {
    return [...offers].sort((a, b) => {
      if (offerSort === 'price_desc') return b.amount - a.amount;
      if (offerSort === 'price_asc') return a.amount - b.amount;
      if (offerSort === 'date_desc') return new Date(b.date) - new Date(a.date);
      return 0;
    });
  }, [offers, offerSort]);

  const sortedSales = useMemo(() => {
    return [...sales].sort((a, b) => {
      if (saleSort === 'price_desc') return b.price - a.price;
      if (saleSort === 'date_desc') return new Date(b.date) - new Date(a.date);
      return 0;
    });
  }, [sales, saleSort]);

  const handleDeleteProduct = (id) => {
    setConfirmDialog({
      title: "Confirmation de suppression",
      message: "Confirmer la suppression définitive de ce véhicule ? Cette action est irréversible.",
      onConfirm: () => {
        setProducts(products.filter(p => p.id !== id));
        setConfirmDialog(null);
      }
    });
  };

  const handleOpenModal = (product = null) => {
    setCurrentProduct(product || { 
      make: '', model: '', year: 2000, price: 0, mileage: 0, 
      sale_type: 'negociation', engine: '', hp: 0, transmission: 'Manuelle', 
      condition: 'Grade 4', location: 'Tokyo, JP'
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (currentProduct.id) {
      setProducts(products.map(p => p.id === currentProduct.id ? currentProduct : p));
    } else {
      setProducts([...products, { ...currentProduct, id: Date.now(), status: 'disponible', views: 0, likes: 0, addedAt: new Date().toISOString().split('T')[0] }]);
    }
    setIsProductModalOpen(false);
  };

  const handleAcceptOffer = (offerId) => {
    setConfirmDialog({
      title: "Acceptation de l'offre",
      message: "Confirmer l'acceptation de cette offre ? Cela conclura la vente et engagera la transaction.",
      onConfirm: () => {
        setOffers(offers.map(o => o.id === offerId ? { ...o, status: 'accepted' } : o));
        setConfirmDialog(null);
      }
    });
  };

  const handleRejectOffer = (offerId) => {
    setOffers(offers.map(o => o.id === offerId ? { ...o, status: 'rejected' } : o));
  };

  const formatCurrency = (val) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase text-[#bb86fc] drop-shadow-[0_0_15px_rgba(187,134,252,0.4)]">
                  Console de Commandement
                </h2>
                <p className="text-zinc-400 font-mono text-sm mt-1">Aperçu en temps réel de vos opérations</p>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-[#bb86fc] animate-pulse"></span>
                <span>Système en ligne</span>
              </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#bb86fc]/50 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#bb86fc]/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="flex justify-between items-start mb-4 relative">
                  <div className="w-12 h-12 rounded-xl bg-[#bb86fc]/10 flex items-center justify-center text-[#bb86fc] border border-[#bb86fc]/20 shadow-[0_0_15px_rgba(187,134,252,0.2)]">
                    <Package size={24} />
                  </div>
                  <div className="flex items-center text-[#bb86fc] bg-[#bb86fc]/10 px-2 py-1 rounded text-xs font-bold">
                    <ArrowUpRight size={14} className="mr-1" /> +1
                  </div>
                </div>
                <div className="relative">
                  <div className="text-4xl font-black text-white tracking-tight">{products.length}</div>
                  <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider mt-1">Bolides en vente</div>
                </div>
              </div>
              
              <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#bb86fc]/50 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#bb86fc]/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="flex justify-between items-start mb-4 relative">
                  <div className="w-12 h-12 rounded-xl bg-[#bb86fc]/10 flex items-center justify-center text-[#bb86fc] border border-[#bb86fc]/20 shadow-[0_0_15px_rgba(187,134,252,0.2)]">
                    <Eye size={24} />
                  </div>
                  <div className="flex items-center text-[#bb86fc] bg-[#bb86fc]/10 px-2 py-1 rounded text-xs font-bold">
                    <ArrowUpRight size={14} className="mr-1" /> +15%
                  </div>
                </div>
                <div className="relative">
                  <div className="text-4xl font-black text-white tracking-tight">26.7k</div>
                  <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider mt-1">Vues totales (30j)</div>
                </div>
              </div>
              
              <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#ffb2bc]/50 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffb2bc]/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="flex justify-between items-start mb-4 relative">
                  <div className="w-12 h-12 rounded-xl bg-[#ffb2bc]/10 flex items-center justify-center text-[#ffb2bc] border border-[#ffb2bc]/20 shadow-[0_0_15px_rgba(255,178,188,0.2)]">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="flex items-center text-[#ffb2bc] bg-[#ffb2bc]/10 px-2 py-1 rounded text-xs font-bold">
                    3 nouvelles
                  </div>
                </div>
                <div className="relative">
                  <div className="text-4xl font-black text-white tracking-tight">{offers.filter(o => o.status === 'pending').length}</div>
                  <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider mt-1">Offres en attente</div>
                </div>
              </div>
              
              <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-[#ffb2bc]/50 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffb2bc]/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                <div className="flex justify-between items-start mb-4 relative">
                  <div className="w-12 h-12 rounded-xl bg-[#ffb2bc]/10 flex items-center justify-center text-[#ffb2bc] border border-[#ffb2bc]/20 shadow-[0_0_15px_rgba(255,178,188,0.2)]">
                    <DollarSign size={24} />
                  </div>
                  <div className="flex items-center text-[#ffb2bc] bg-[#ffb2bc]/10 px-2 py-1 rounded text-xs font-bold">
                    <ArrowUpRight size={14} className="mr-1" /> +2.4%
                  </div>
                </div>
                <div className="relative">
                  <div className="text-3xl lg:text-4xl font-black text-white tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#bb86fc] to-[#ffb2bc]">
                    {formatCurrency(sales.reduce((acc, sale) => acc + sale.price, 0))}
                  </div>
                  <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider mt-1">Revenu Total</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Activity Feed */}
              <div className="lg:col-span-2 glass-panel rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Activity size={18} className="text-[#bb86fc]" />
                    Flux d'activité récent
                  </h3>
                  <button className="text-xs font-mono text-[#bb86fc] hover:underline">Voir tout</button>
                </div>
                <div className="space-y-4">
                  {activities.map(act => (
                    <div key={act.id} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                      <div className={`mt-1 w-2 h-2 rounded-full ${act.type === 'offer' ? 'bg-[#ffb2bc] shadow-[0_0_8px_rgba(255,178,188,0.8)]' : act.type === 'bid' ? 'bg-[#ffb2bc] shadow-[0_0_8px_rgba(255,178,188,0.8)]' : act.type === 'system' ? 'bg-[#bb86fc] shadow-[0_0_8px_rgba(187,134,252,0.8)]' : 'bg-[#e5e2e1] shadow-[0_0_8px_rgba(229,226,225,0.8)]'}`}></div>
                      <div>
                        <p className="text-sm text-zinc-200">{act.message}</p>
                        <p className="text-xs font-mono text-zinc-500 mt-1">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini conversion chart or stats */}
              <div className="glass-panel rounded-2xl border border-white/10 p-6 flex flex-col justify-between">
                 <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
                    <Target size={18} className="text-[#bb86fc]" />
                    Taux de Conversion
                 </h3>
                 <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                       {/* SVG Donut Chart */}
                       <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#bb86fc" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="180" className="drop-shadow-[0_0_10px_rgba(187,134,252,0.5)]" strokeLinecap="round" />
                       </svg>
                       <div className="absolute text-center">
                          <span className="text-3xl font-black text-white">12%</span>
                          <span className="block text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-1">Ce mois</span>
                       </div>
                    </div>
                 </div>
                 <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-center">
                    <div>
                       <div className="text-xl font-bold text-white">45</div>
                       <div className="text-[10px] font-mono text-zinc-500 uppercase">Leads générés</div>
                    </div>
                    <div>
                       <div className="text-xl font-bold text-[#ffb2bc]">5</div>
                       <div className="text-[10px] font-mono text-zinc-500 uppercase">Ventes conclues</div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        );
      case 'products':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-black italic tracking-tighter uppercase text-[#bb86fc] drop-shadow-[0_0_15px_rgba(187,134,252,0.4)]">Inventaire</h2>
                <p className="text-zinc-400 font-mono text-sm mt-1">Gérez vos bolides actuellement en vente</p>
              </div>
              <button onClick={() => handleOpenModal()} className="bg-gradient-to-r from-[#bb86fc] to-[#ffb2bc] hover:brightness-110 text-[#460283] hover:text-black px-5 py-3 rounded-xl font-black text-sm uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(187,134,252,0.3)]">
                <Plus size={18} /> Ajouter un Véhicule
              </button>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {products.map(product => (
                <div key={product.id} className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row hover:border-white/20 transition-all duration-300">
                  <div className="w-full md:w-64 h-48 md:h-auto bg-zinc-900 relative group overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                     <div className="absolute inset-0 flex items-center justify-center text-zinc-600 font-mono text-xs">
                        [ IMAGE PRODUIT ]
                     </div>
                     <div className="absolute bottom-3 left-3 z-20 flex gap-2">
                        <span className="bg-black/80 backdrop-blur text-white text-[10px] font-mono px-2 py-1 rounded border border-white/20 flex items-center gap-1">
                          <Eye size={10} /> {product.views.toLocaleString()}
                        </span>
                        <span className="bg-black/80 backdrop-blur text-pink-400 text-[10px] font-mono px-2 py-1 rounded border border-pink-500/30 flex items-center gap-1">
                          <Heart size={10} /> {product.likes}
                        </span>
                     </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-black text-xl text-white uppercase leading-tight">{product.make} {product.model}</h3>
                        <span className={`text-[10px] font-mono px-2 py-1 rounded uppercase tracking-wider font-bold border ${
                          product.sale_type === 'enchere' ? 'bg-[#bb86fc]/10 text-[#bb86fc] border-[#bb86fc]/30' : 
                          product.sale_type === 'negociation' ? 'bg-[#ffb2bc]/10 text-[#ffb2bc] border-[#ffb2bc]/30' : 
                          'bg-[#bb86fc]/10 text-[#bb86fc] border-[#bb86fc]/30'
                        }`}>
                          {product.sale_type}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4">
                        <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
                          <Calendar size={12} className="text-[#bb86fc]" /> {product.year}
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
                          <Activity size={12} className="text-[#bb86fc]" /> {product.mileage.toLocaleString()} km
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono truncate" title={product.engine}>
                          <Zap size={12} className="text-[#bb86fc]" /> {product.engine} ({product.hp}ch)
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
                          <Settings size={12} className="text-[#bb86fc]" /> {product.transmission}
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
                          <Shield size={12} className="text-[#bb86fc]" /> {product.condition}
                        </div>
                        <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono truncate">
                          <MapPin size={12} className="text-[#bb86fc]" /> {product.location}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                      <div className="text-xl font-mono font-bold text-[#ffb2bc] drop-shadow-[0_0_8px_rgba(255,178,188,0.4)]">
                        {formatCurrency(product.price)}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleOpenModal(product)} className="p-2.5 bg-white/5 hover:bg-white/15 rounded-lg text-zinc-300 transition-all border border-white/10 hover:border-white/30" title="Modifier">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="p-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-all border border-red-500/20 hover:border-red-500/40" title="Supprimer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'auctions':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-3xl font-black italic tracking-tighter uppercase text-[#bb86fc] drop-shadow-[0_0_15px_rgba(187,134,252,0.4)]">Suivi des Enchères</h2>
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
                <Filter size={14} className="text-zinc-400" />
                <select 
                  className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
                  value={auctionSort}
                  onChange={(e) => setAuctionSort(e.target.value)}
                >
                  <option value="date" className="bg-zinc-900">Temps restant</option>
                  <option value="price_desc" className="bg-zinc-900">Prix : Décroissant</option>
                  <option value="price_asc" className="bg-zinc-900">Prix : Croissant</option>
                </select>
              </div>
            </div>

            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 font-mono text-xs uppercase tracking-wider text-zinc-400">
                      <th className="p-5 font-bold">Bolide</th>
                      <th className="p-5 font-bold">Offre Actuelle</th>
                      <th className="p-5 font-bold">Nb. Offres</th>
                      <th className="p-5 font-bold">Leader</th>
                      <th className="p-5 font-bold">Temps Restant</th>
                      <th className="p-5 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAuctions.map(auction => (
                      <tr key={auction.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <td className="p-5">
                          <div className="font-bold text-white uppercase text-sm">{auction.productModel}</div>
                          <div className="text-[10px] text-zinc-500 font-mono mt-1">ID: {auction.productId}</div>
                        </td>
                        <td className="p-5">
                          <div className="text-[#ffb2bc] font-mono text-lg font-bold drop-shadow-[0_0_8px_rgba(255,178,188,0.4)]">{formatCurrency(auction.currentBid)}</div>
                        </td>
                        <td className="p-5 text-zinc-300 font-mono">{auction.bidsCount}</td>
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-300">
                              {auction.highestBidder.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-mono text-xs text-zinc-300">{auction.highestBidder}</span>
                          </div>
                        </td>
                        <td className="p-5">
                          <span className="inline-flex items-center gap-1.5 bg-[#ffb2bc]/10 text-[#ffb2bc] px-3 py-1.5 rounded text-xs font-mono border border-[#ffb2bc]/20">
                            <Clock size={12} /> {auction.timeLeft}
                          </span>
                        </td>
                        <td className="p-5 text-center">
                          <button className="text-xs font-mono text-zinc-400 hover:text-white underline decoration-white/30 underline-offset-4">Détails</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'offers':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-3xl font-black italic tracking-tighter uppercase text-[#bb86fc] drop-shadow-[0_0_15px_rgba(187,134,252,0.4)]">Offres Reçues</h2>
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
                <Filter size={14} className="text-zinc-400" />
                <select 
                  className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
                  value={offerSort}
                  onChange={(e) => setOfferSort(e.target.value)}
                >
                  <option value="price_desc" className="bg-zinc-900">Prix : Plus élevé</option>
                  <option value="price_asc" className="bg-zinc-900">Prix : Plus bas</option>
                  <option value="date_desc" className="bg-zinc-900">Date : Plus récent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedOffers.map(offer => (
                <div key={offer.id} className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden transition-all hover:border-white/20">
                  {offer.status === 'pending' && <div className="absolute top-0 left-0 w-1 h-full bg-[#ffb2bc] shadow-[0_0_10px_rgba(249,115,22,1)]"></div>}
                  {offer.status === 'accepted' && <div className="absolute top-0 left-0 w-1 h-full bg-[#17deca] shadow-[0_0_10px_rgba(34,197,94,1)]"></div>}
                  {offer.status === 'rejected' && <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]"></div>}
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-lg text-white uppercase">{offer.productModel}</h3>
                      <div className="text-xs text-zinc-400 font-mono mt-1 flex items-center gap-1"><Calendar size={10}/> {offer.date}</div>
                    </div>
                    {offer.status !== 'pending' && (
                      <span className={`font-mono text-[10px] px-2 py-1 rounded uppercase tracking-wider font-bold border ${offer.status === 'accepted' ? 'bg-[#17deca]/10 text-[#17deca] border-[#17deca]/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                        {offer.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                      </span>
                    )}
                  </div>

                  <div className="bg-black/30 rounded-xl p-4 mb-4 flex justify-between items-center border border-white/5">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-sm font-bold text-white">
                         {offer.buyer.substring(0, 2).toUpperCase()}
                       </div>
                       <div>
                         <div className="text-sm text-zinc-300 font-mono">{offer.buyer}</div>
                         <div className="text-[10px] text-zinc-500 uppercase">Acheteur vérifié</div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-2xl font-mono text-[#ffb2bc] font-bold drop-shadow-[0_0_8px_rgba(255,178,188,0.4)]">
                         {formatCurrency(offer.amount)}
                       </div>
                    </div>
                  </div>

                  {offer.status === 'pending' && (
                    <div className="flex gap-3">
                      <button onClick={() => handleAcceptOffer(offer.id)} className="flex-1 py-3 bg-[#bb86fc]/10 hover:bg-[#bb86fc]/20 text-[#bb86fc] rounded-xl border border-[#bb86fc]/30 transition-colors font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                        <Check size={16} /> Accepter
                      </button>
                      <button onClick={() => handleRejectOffer(offer.id)} className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 transition-colors font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                        <X size={16} /> Refuser
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 'sales':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-3xl font-black italic tracking-tighter uppercase text-[#bb86fc] drop-shadow-[0_0_15px_rgba(187,134,252,0.4)]">Historique des Ventes</h2>
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
                <Filter size={14} className="text-zinc-400" />
                <select 
                  className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
                  value={saleSort}
                  onChange={(e) => setSaleSort(e.target.value)}
                >
                  <option value="date_desc" className="bg-zinc-900">Date : Plus récent</option>
                  <option value="price_desc" className="bg-zinc-900">Prix : Décroissant</option>
                </select>
              </div>
            </div>

            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 font-mono text-xs uppercase tracking-wider text-zinc-400">
                      <th className="p-5 font-bold">Produit</th>
                      <th className="p-5 font-bold">Type</th>
                      <th className="p-5 font-bold">Acheteur</th>
                      <th className="p-5 font-bold">Prix Final</th>
                      <th className="p-5 font-bold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedSales.map(sale => (
                      <tr key={sale.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="p-5">
                           <div className="font-bold text-white uppercase text-sm">{sale.productModel}</div>
                        </td>
                        <td className="p-5">
                           <span className="text-[10px] font-mono px-2 py-1 bg-white/5 rounded border border-white/10 uppercase text-zinc-300">
                              {sale.type}
                           </span>
                        </td>
                        <td className="p-5 font-mono text-zinc-400 text-sm">{sale.buyer}</td>
                        <td className="p-5">
                           <div className="text-[#ffb2bc] font-mono text-lg font-bold drop-shadow-[0_0_8px_rgba(255,178,188,0.4)]">{formatCurrency(sale.price)}</div>
                        </td>
                        <td className="p-5 font-mono text-zinc-400 text-sm flex items-center gap-2">
                           <Calendar size={12} /> {sale.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-8 animate-fade-in">
            <div>
               <h2 className="text-3xl font-black italic tracking-tighter uppercase text-[#bb86fc] drop-shadow-[0_0_15px_rgba(187,134,252,0.4)]">Analyse des Performances</h2>
               <p className="text-zinc-400 font-mono text-sm mt-1">Données et statistiques détaillées pour optimiser vos ventes</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Main Chart Area */}
               <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                     <BarChart3 size={18} className="text-[#bb86fc]" />
                     Revenus (Derniers mois)
                  </h3>
                  
                  {/* Pure CSS Bar Chart */}
                  <div className="h-64 flex items-end gap-2 sm:gap-4 md:gap-8 px-4 pb-8 pt-4 border-b border-l border-white/10 relative">
                     {/* Y-Axis Labels */}
                     <div className="absolute left-0 top-0 h-full -ml-12 flex flex-col justify-between text-[10px] font-mono text-zinc-500 py-4 pb-8">
                        <span>300k</span>
                        <span>200k</span>
                        <span>100k</span>
                        <span>0</span>
                     </div>
                     
                     {/* Bars */}
                     {[
                        { month: 'Jan', val: 40, amt: '120k' },
                        { month: 'Fév', val: 65, amt: '195k' },
                        { month: 'Mar', val: 30, amt: '90k' },
                        { month: 'Avr', val: 85, amt: '255k' },
                        { month: 'Mai', val: 95, amt: '285k', highlight: true }
                     ].map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col justify-end items-center h-full group">
                           <div className="text-[10px] font-mono text-zinc-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-1 rounded">
                              {item.amt}€
                           </div>
                           <div 
                              className={`w-full max-w-[40px] rounded-t-sm transition-all duration-500 hover:brightness-125 ${item.highlight ? 'bg-gradient-to-t from-[#bb86fc]/40 to-[#ffb2bc] shadow-[0_0_15px_rgba(255,178,188,0.4)]' : 'bg-white/20'}`}
                              style={{ height: `${item.val}%` }}
                           ></div>
                           <div className="text-xs font-mono text-zinc-400 mt-3 absolute -bottom-6">
                              {item.month}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Top Models */}
               <div className="glass-panel p-6 rounded-2xl border border-white/10">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                     <TrendingUp size={18} className="text-[#bb86fc]" />
                     Top Modèles (Clics)
                  </h3>
                  <div className="space-y-4">
                     {[
                        { name: 'Skyline R34', pct: 85, views: '12k' },
                        { name: 'Supra MK4', pct: 65, views: '8.9k' },
                        { name: 'RX-7 FD', pct: 45, views: '5.4k' }
                     ].map((model, idx) => (
                        <div key={idx}>
                           <div className="flex justify-between text-sm mb-1">
                              <span className="text-white font-bold">{model.name}</span>
                              <span className="text-zinc-400 font-mono text-xs">{model.views}</span>
                           </div>
                           <div className="w-full bg-white/5 rounded-full h-2">
                              <div className="bg-gradient-to-r from-[#bb86fc] to-[#ffb2bc] h-2 rounded-full shadow-[0_0_8px_rgba(187,134,252,0.5)]" style={{ width: `${model.pct}%` }}></div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Insights Section */}
            <div>
               <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-4">Insights & Recommandations</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#bb86fc]/10 border border-[#bb86fc]/20 p-5 rounded-xl">
                     <div className="text-[#bb86fc] font-bold mb-2 flex items-center gap-2"><Zap size={16}/> Impact Kilométrage</div>
                     <p className="text-sm text-blue-200/70">Les véhicules affichant moins de 80 000 km se vendent en moyenne 22% plus cher sur notre plateforme.</p>
                  </div>
                  <div className="bg-[#bb86fc]/10 border border-[#bb86fc]/20 p-5 rounded-xl">
                     <div className="text-[#bb86fc] font-bold mb-2 flex items-center gap-2"><Activity size={16}/> Tendance du mois</div>
                     <p className="text-sm text-purple-200/70">Forte demande actuelle pour les châssis Mazda (RX-7, RX-8). Pensez à mettre en avant vos modèles à moteur rotatif.</p>
                  </div>
                  <div className="bg-[#ffb2bc]/10 border border-[#ffb2bc]/20 p-5 rounded-xl">
                     <div className="text-[#ffb2bc] font-bold mb-2 flex items-center gap-2"><Shield size={16}/> Conseil Annonce</div>
                     <p className="text-sm text-[#ffb2bc]/70">Ajouter l'information détaillée du "Grade" d'importation augmente le taux de clic des acheteurs vérifiés de 35%.</p>
                  </div>
               </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] antialiased overflow-x-hidden font-sans pt-24 selection:bg-primary selection:text-[#460283]">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-0 w-[35vw] h-[35vw] rounded-full bg-secondary/5 blur-[120px] pointer-events-none"></div>

      {/* Navigation */}
      <nav className="bg-[#131313]/90 backdrop-blur-2xl fixed top-0 w-full z-40 border-b border-white/10 shadow-[0_0_20px_rgba(187,134,252,0.15)]">
        <div className="flex justify-between items-center h-20 px-4 md:px-8 lg:px-16 w-full max-w-[1600px] mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-[#bb86fc] flex items-center justify-center font-black tracking-tighter text-[#460283] italic text-lg shadow-[0_0_12px_rgba(187,134,252,0.4)]">
              MN
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider text-[#dab9ff] italic uppercase">MERCATO <span className="text-[#ffb2bc]">NOVA</span></span>
              <p className="text-[9px] text-[#cdc3d4]/50 font-mono tracking-widest -mt-1 uppercase">Tokyo Underground (Vendor)</p>
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden xl:flex gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <Package size={14} /> },
              { id: 'products', label: 'Mes Bolides', icon: <Target size={14} /> },
              { id: 'auctions', label: 'Enchères', icon: <Clock size={14} /> },
              { id: 'offers', label: 'Offres', icon: <MessageSquare size={14} /> },
              { id: 'sales', label: 'Ventes', icon: <DollarSign size={14} /> },
              { id: 'analytics', label: 'Analyse', icon: <BarChart3 size={14} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono uppercase tracking-widest text-[10px] font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#bb86fc]/10 text-[#bb86fc] shadow-[inset_0_0_10px_rgba(187,134,252,0.2)] border border-[#bb86fc]/20' 
                    : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Profile */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={toggleProfile}
                className={`flex items-center gap-3 p-1.5 pr-4 rounded-full border transition-all active:scale-95 ${
                  showProfileMenu ? 'border-[#bb86fc]/30 bg-[#bb86fc]/5' : 'border-white/10 hover:border-white/30 bg-black/50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#bb86fc] to-[#ffb2bc] flex items-center justify-center text-[#460283] font-bold shadow-[0_0_10px_rgba(187,134,252,0.5)]">
                  <User size={16} />
                </div>
                <span className="font-mono text-xs text-white hidden md:block">Profil Pro</span>
              </button>

              {showProfileMenu && (
                <>
                  <div onClick={() => setShowProfileMenu(false)} className="fixed inset-0 z-30"></div>
                  <div className="absolute right-0 mt-4 w-64 rounded-2xl border border-white/10 bg-[#1c1b1b]/95 backdrop-blur-xl py-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-40 overflow-hidden">
                    <div className="px-5 py-4 border-b border-white/5 mb-2 bg-gradient-to-b from-white/[0.02] to-transparent">
                      <span className="block text-[#bb86fc] font-bold uppercase tracking-wider text-[10px] mb-1">Session Active</span>
                      <span className="text-white truncate block font-bold" title={user?.email}>{user?.email || 'vendeur@mercatonova.com'}</span>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#bb86fc]/10 text-[#bb86fc] border border-[#bb86fc]/20 text-[9px] font-bold uppercase tracking-wider">
                          <Cpu size={10} /> Compte Vendeur
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#ffb2bc]/10 text-[#ffb2bc] border border-[#ffb2bc]/20 text-[9px] font-bold uppercase tracking-wider">
                          PREMIUM
                        </span>
                      </div>
                    </div>

                    {/* Mobile tabs visible only when profile clicked on small screens */}
                    <div className="xl:hidden border-b border-white/5 mb-2 pb-2">
                       <span className="block px-5 py-2 text-[10px] text-zinc-500 font-mono uppercase">Navigation</span>
                       {['dashboard', 'products', 'auctions', 'offers', 'sales', 'analytics'].map(t => (
                          <button key={t} onClick={() => {setActiveTab(t); setShowProfileMenu(false);}} className="w-full text-left px-5 py-2 text-xs text-zinc-300 hover:text-[#bb86fc] hover:bg-white/5 uppercase font-mono">
                             {t}
                          </button>
                       ))}
                    </div>

                    <button 
                      onClick={() => { setShowProfileMenu(false); onLogout(); }}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold font-sans text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-left"
                    >
                      <LogOut size={16} className="text-zinc-500 group-hover:text-red-400" />
                      <span>Déconnexion Sécurisée</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 py-12 relative z-10">
        {renderTabContent()}
      </main>

      {/* Extended Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="glass-panel w-full max-w-3xl rounded-2xl border border-white/10 overflow-hidden my-8">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-[#bb86fc]/10 to-transparent relative overflow-hidden">
              <div className="absolute left-0 top-0 w-1 h-full bg-[#bb86fc]"></div>
              <div>
                 <h3 className="font-black text-white uppercase tracking-wider text-xl">
                   {currentProduct?.id ? 'Modifier la Fiche Véhicule' : 'Intégrer un Nouveau Véhicule'}
                 </h3>
                 <p className="text-xs text-[#bb86fc] font-mono mt-1">Base de données sécurisée Mercato Nova</p>
              </div>
              <button onClick={() => setIsProductModalOpen(false)} className="text-zinc-400 hover:text-white bg-black/50 p-2 rounded-full transition-colors border border-white/10">
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              <form onSubmit={handleSaveProduct} className="space-y-6">
                
                {/* Section 1: Basic Info */}
                <div>
                   <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-widest border-b border-white/10 pb-2 mb-4 flex items-center gap-2"><Target size={14}/> Identification Globale</h4>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                     <div className="space-y-1">
                       <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Marque</label>
                       <input type="text" required value={currentProduct?.make} onChange={e => setCurrentProduct({...currentProduct, make: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-[#bb86fc] focus:ring-1 focus:ring-[#bb86fc] outline-none transition-all" placeholder="Ex: Nissan" />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Modèle</label>
                       <input type="text" required value={currentProduct?.model} onChange={e => setCurrentProduct({...currentProduct, model: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-[#bb86fc] focus:ring-1 focus:ring-[#bb86fc] outline-none transition-all" placeholder="Ex: Skyline R34" />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Année</label>
                       <input type="number" required value={currentProduct?.year} onChange={e => setCurrentProduct({...currentProduct, year: parseInt(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-[#bb86fc] focus:ring-1 focus:ring-[#bb86fc] outline-none transition-all" />
                     </div>
                   </div>
                </div>
                
                {/* Section 2: Technical Specs */}
                <div>
                   <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-widest border-b border-white/10 pb-2 mb-4 flex items-center gap-2"><Zap size={14}/> Spécifications Techniques</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                     <div className="space-y-1">
                       <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Moteur</label>
                       <input type="text" required value={currentProduct?.engine} onChange={e => setCurrentProduct({...currentProduct, engine: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-[#bb86fc] outline-none" placeholder="Ex: RB26DETT" />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Puissance (CH)</label>
                       <input type="number" required value={currentProduct?.hp} onChange={e => setCurrentProduct({...currentProduct, hp: parseInt(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-[#bb86fc] outline-none" />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Kilométrage</label>
                       <input type="number" required value={currentProduct?.mileage} onChange={e => setCurrentProduct({...currentProduct, mileage: parseInt(e.target.value)})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-[#bb86fc] outline-none" />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Transmission</label>
                       <select value={currentProduct?.transmission} onChange={e => setCurrentProduct({...currentProduct, transmission: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-[#bb86fc] outline-none">
                         <option value="Manuelle 5 rap.">Manuelle 5 rap.</option>
                         <option value="Manuelle 6 rap.">Manuelle 6 rap.</option>
                         <option value="Automatique">Automatique</option>
                         <option value="Séquentielle">Séquentielle</option>
                       </select>
                     </div>
                   </div>
                </div>

                {/* Section 3: Market Data */}
                <div>
                   <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-widest border-b border-white/10 pb-2 mb-4 flex items-center gap-2"><DollarSign size={14}/> Données Marché</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                     <div className="space-y-1">
                       <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Prix/Mise à prix (€)</label>
                       <input type="number" required value={currentProduct?.price} onChange={e => setCurrentProduct({...currentProduct, price: parseInt(e.target.value)})} className="w-full bg-[#ffb2bc]/5 border border-[#ffb2bc]/30 rounded-lg px-4 py-3 text-[#ffb2bc] font-mono font-bold text-lg focus:border-[#ffb2bc] outline-none" />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Mode de Vente</label>
                       <select value={currentProduct?.sale_type} onChange={e => setCurrentProduct({...currentProduct, sale_type: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-[#bb86fc] outline-none">
                         <option value="enchere">Enchère</option>
                         <option value="negociation">Négociation</option>
                         <option value="mixte">Achat Immédiat + Enchère</option>
                       </select>
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Grade (État)</label>
                       <select value={currentProduct?.condition} onChange={e => setCurrentProduct({...currentProduct, condition: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-[#bb86fc] outline-none">
                         <option value="Grade S">Grade S (Neuf)</option>
                         <option value="Grade 5">Grade 5 (Excellent)</option>
                         <option value="Grade 4.5">Grade 4.5 (Très bon)</option>
                         <option value="Grade 4">Grade 4 (Bon)</option>
                         <option value="Grade 3.5">Grade 3.5 (Moyen)</option>
                         <option value="Grade R">Grade R (Réparé)</option>
                       </select>
                     </div>
                     <div className="space-y-1">
                       <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Localisation</label>
                       <input type="text" required value={currentProduct?.location} onChange={e => setCurrentProduct({...currentProduct, location: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-[#bb86fc] outline-none" placeholder="Ex: Tokyo, JP" />
                     </div>
                   </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex justify-end gap-4">
                  <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-6 py-3 rounded-lg text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors font-bold text-xs uppercase tracking-wider border border-white/10">
                    Annuler
                  </button>
                  <button type="submit" className="px-8 py-3 bg-gradient-to-r from-[#bb86fc] to-[#ffb2bc] text-[#460283] rounded-lg hover:shadow-[0_0_20px_rgba(187,134,252,0.4)] transition-all font-black text-xs uppercase tracking-wider">
                    {currentProduct?.id ? 'Sauvegarder les modifications' : 'Publier le Bolide'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#0e0e0e]/80 border-t border-white/5 py-8 mt-12 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 md:px-16 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-zinc-500 gap-4">
          <p>© 2026 Mercato Nova. Console Vendeur Sécurisée.</p>
          <div className="flex items-center gap-6">
             <div className="flex items-center space-x-2 uppercase text-[#bb86fc]">
               <Shield size={12} />
               <span>Connexion Chiffrée</span>
             </div>
             <div className="flex items-center space-x-2 uppercase text-[#ffb2bc]">
               <span className="w-1.5 h-1.5 bg-[#ffb2bc] rounded-full animate-pulse"></span>
               <span>API Sync</span>
             </div>
          </div>
        </div>
      </footer>

      {/* Custom Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-[#ffb2bc]/30 p-8 shadow-[0_0_50px_rgba(255,178,188,0.25)] animate-in fade-in zoom-in-95 duration-200 relative">
            <span className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-[#bb86fc] animate-pulse"></span>
            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#ffb2bc] animate-pulse"></span>
            
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#ffb2bc]/10 flex items-center justify-center mx-auto text-[#ffb2bc] border border-[#ffb2bc]/20 shadow-[0_0_15px_rgba(255,178,188,0.2)]">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-black italic tracking-tighter uppercase text-white font-headline-md">{confirmDialog.title}</h3>
              <p className="text-xs text-zinc-300 font-mono leading-relaxed">{confirmDialog.message}</p>
              
              <div className="flex gap-4 mt-6">
                <button 
                  onClick={() => setConfirmDialog(null)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-lg border border-white/10 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={confirmDialog.onConfirm}
                  className="flex-1 py-3 bg-gradient-to-r from-[#bb86fc] to-[#ffb2bc] text-[#460283] hover:brightness-110 font-black text-xs uppercase tracking-wider rounded-lg transition-all"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
