import React, { useState, useEffect } from 'react';
import {
  Search, Bell, MessageSquare, User, Grid, List, Shield,
  ShoppingCart, Timer, SlidersHorizontal, ArrowUpRight,
  Check, X, Zap, Cpu, Compass, Landmark, Heart, LogOut,
  Trash2, Pencil, Plus, Users, FileCheck, BarChart3, Ban,
  AlertTriangle, UserCheck, Crown
} from 'lucide-react';
import { adminStats, initialPendingListings, mockUsers } from '../data/mockData';

const roleLabels = {
  utilisateur: 'Utilisateur',
  admin: 'Administrateur',
  directeur: 'Directeur',
};

const formatMoney = (amount) => `$${Number(amount || 0).toLocaleString()}`;

function AdminWorkspace({
  user,
  activePanel,
  setActivePanel,
  users,
  pendingListings,
  products,
  onApproveListing,
  onRejectListing,
  onBanUser,
  onDeleteUser,
  onDeleteProduct,
  onOpenEdit,
  onStartAdd,
}) {
  const isDirector = user?.role === 'directeur';
  const visibleUsers = isDirector ? users : users.filter((account) => account.role !== 'directeur');
  const visibleProducts = products;

  const tabs = [
    { id: 'catalog', label: 'Catalogue', icon: Compass },
    { id: 'overview', label: 'Statistiques', icon: BarChart3 },
    { id: 'pending', label: 'Annonces a valider', icon: FileCheck },
    { id: 'accounts', label: 'Gerer les comptes', icon: Users },
    ...(isDirector ? [{ id: 'director', label: 'Espace directeur', icon: Crown }] : []),
  ];

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 space-y-8">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5 border-b border-white/5 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest mb-3">
            <Shield size={13} />
            {isDirector ? 'Direction generale' : 'System metrics & moderation control'}
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tight text-[#e5e2e1]">
            {isDirector ? 'Espace Directeur' : 'Espace Admin'}
          </h1>
          <p className="text-sm text-[#cdc3d4]/70 font-mono mt-2">
            Connecte : {user?.email} - role {roleLabels[user?.role]}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePanel(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${activePanel === tab.id ? 'bg-secondary text-[#400013] border-secondary' : 'border-white/10 text-[#cdc3d4] hover:text-white hover:bg-white/5'}`}
              >
                <TabIcon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {(activePanel === 'overview' || activePanel === 'director') && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { label: 'Utilisateurs actifs', value: adminStats.activeUsers.toLocaleString(), hint: '+12.5% cette semaine', icon: Users },
              { label: 'Volume quotidien', value: `¥${(adminStats.dailyVolume / 1000000).toFixed(1)}M`, hint: '+8.2% cette semaine', icon: Landmark },
              { label: 'Annonces signalees', value: adminStats.flaggedListings, hint: 'Action requise', icon: AlertTriangle },
            ].map((metric) => {
              const MetricIcon = metric.icon;
              return (
                <div key={metric.label} className="glass-panel rounded-lg p-6 border border-white/10 min-h-[170px]">
                  <div className="flex justify-between items-start text-[#cdc3d4] font-mono text-xs">
                    <span>{metric.label}</span>
                    <MetricIcon className="text-primary" size={20} />
                  </div>
                  <div className="text-4xl font-black mt-8">{metric.value}</div>
                  <div className="text-[11px] font-mono text-tertiary mt-4">{metric.hint}</div>
                  <div className="h-10 mt-4 rounded bg-gradient-to-r from-primary/10 via-secondary/20 to-tertiary/10 border border-white/5"></div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 glass-panel rounded-2xl p-6 border border-white/10 space-y-6">
              <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-[#cdc3d4] flex items-center gap-2">
                <BarChart3 size={16} />
                Performances du Marche
              </h3>
              <div className="h-[260px] flex items-end justify-between gap-2 pt-6 border-b border-white/5">
                {[45, 58, 62, 79, 90, 85, 95, 110, 105, 115, 130, 142].map((height, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[8px] font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">${height}k</span>
                    <div style={{ height: `${height * 1.5}px` }} className="w-full bg-gradient-to-t from-primary/40 to-primary rounded-t-sm group-hover:from-secondary/40 group-hover:to-secondary transition-all"></div>
                    <span className="text-[8px] font-mono text-[#cdc3d4]/40 mt-1">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][idx]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-[#cdc3d4] flex items-center gap-2">
                <Shield size={16} />
                Journal d'audit
              </h3>
              <div className="space-y-3 font-mono text-[9px] text-[#cdc3d4]/70">
                {[
                  { time: '15:24', act: 'Admin supprime annonce 104', type: 'warn' },
                  { time: '14:52', act: 'Nouveau compte: nicolas@mercatonova.com', type: 'info' },
                  { time: '13:01', act: 'Approbation annonce 102 par Camille', type: 'success' },
                  { time: '11:15', act: 'Tentative connexion suspecte bannie', type: 'error' },
                ].map((log, idx) => (
                  <div key={idx} className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <span className="text-[#cdc3d4]/30">{log.time}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase ${log.type === 'warn' ? 'bg-secondary/10 text-secondary' : log.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-primary/10 text-primary'}`}>{log.type}</span>
                    <span className="truncate">{log.act}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {activePanel === 'pending' && (
        <section className="space-y-6">
          <h2 className="text-xl font-extrabold italic uppercase tracking-wider text-[#cdc3d4] flex items-center gap-2">
            <FileCheck className="text-primary" />
            Annonces en attente de validation
          </h2>
          {pendingListings.length === 0 ? (
            <div className="py-16 text-center glass-panel rounded-2xl border border-white/10">
              <p className="text-[#cdc3d4]/50 font-mono text-xs">Aucune annonce en attente de validation.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pendingListings.map((listing) => (
                <article key={listing.id} className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between">
                  <div>
                    <img src={listing.image} alt={listing.model} className="w-full h-48 object-cover border-b border-white/5" />
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-[10px] font-mono text-secondary uppercase">{listing.brand}</div>
                          <h3 className="font-extrabold text-lg text-white">{listing.year} {listing.model}</h3>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-[#ffb2bc]/10 text-secondary text-[9px] font-mono uppercase tracking-wider font-bold">{listing.status}</span>
                      </div>
                      <div className="space-y-2 border-t border-b border-white/5 py-3 font-mono text-[10px] text-[#cdc3d4]/70">
                        <p>Vendeur : <span className="text-white">{listing.sellerName}</span> ({listing.sellerEmail})</p>
                        <p>Tel : <span className="text-white">{listing.sellerPhone}</span></p>
                        <p>Prix demande : <span className="text-primary font-bold">{formatMoney(listing.price)}</span></p>
                        <p>Type de vente : <span className="text-tertiary uppercase">{listing.saleType}</span></p>
                      </div>
                      <div className="bg-[#1c1b1b]/70 border border-white/5 rounded-lg p-3 text-[9px] font-mono space-y-1.5">
                        <span className="text-secondary uppercase font-bold">Signalement moderation :</span>
                        <p className="text-[#cdc3d4] leading-relaxed">{listing.reason}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 pt-0 flex gap-2">
                    <button onClick={() => onApproveListing(listing.id)} className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-[#460283] rounded-lg py-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]">
                      <Check size={14} /> Valider
                    </button>
                    <button onClick={() => onRejectListing(listing.id)} className="flex-1 flex items-center justify-center gap-1.5 border border-red-500/30 hover:bg-red-500/5 text-red-300 rounded-lg py-2.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all active:scale-[0.98]">
                      <X size={14} /> Refuser
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {activePanel === 'accounts' && (
        <section className="space-y-6">
          <h2 className="text-xl font-extrabold italic uppercase tracking-wider text-[#cdc3d4] flex items-center gap-2">
            <Users className="text-primary" />
            Gestion des comptes utilisateurs
          </h2>
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-[10px]">
                <thead>
                  <tr className="border-b border-white/10 bg-[#1c1b1b]/50 text-[#cdc3d4]/50 uppercase tracking-widest">
                    <th className="p-4">Utilisateur</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Statut compte</th>
                    <th className="p-4">Statut KYC</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {visibleUsers.map((account) => (
                    <tr key={account.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white text-[11px]">{account.firstName} {account.lastName}</div>
                        <div className="text-[#cdc3d4]/50">{account.email}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold ${account.role === 'directeur' ? 'bg-secondary/10 text-secondary' : account.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-zinc-800 text-zinc-300'}`}>{roleLabels[account.role]}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold ${account.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{account.status}</span>
                      </td>
                      <td className="p-4">
                        <div className="text-[9px]">{account.idCardStatus}</div>
                        <div className="text-[8px] text-[#cdc3d4]/40 truncate max-w-[150px]">{account.idCardCriteria}</div>
                      </td>
                      <td className="p-4 text-right space-x-1.5">
                        {account.status !== 'banned' && account.role !== 'directeur' && (
                          <button onClick={() => onBanUser(account.email)} className="border border-red-500/20 text-red-400/80 hover:bg-red-500/10 px-2.5 py-1.5 rounded text-[9px] uppercase tracking-wider font-bold transition-all">Bannir</button>
                        )}
                        {account.role !== 'directeur' && (
                          <button onClick={() => onDeleteUser(account.email)} className="border border-white/10 text-[#cdc3d4]/50 hover:bg-white/5 px-2.5 py-1.5 rounded text-[9px] uppercase tracking-wider font-bold transition-all">Effacer</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {activePanel === 'director' && isDirector && (
        <section className="space-y-6">
          <h2 className="text-xl font-extrabold italic uppercase tracking-wider text-[#cdc3d4] flex items-center gap-2">
            <Crown className="text-secondary" />
            Espace Directeur General
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 glass-panel rounded-2xl p-6 border border-white/10 space-y-6">
              <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-[#cdc3d4]">Controle global de la plateforme</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Frais de transaction', val: '2.5% par vente (escrow)', act: 'Ajuster les frais' },
                  { label: 'Limite de depot', val: '¥15,000,000 sans KYC', act: 'Modifier le seuil' },
                  { label: 'Entiercement systeme', val: 'Actif (99.9% de couverture)', act: 'Gérer la clé d'administration' },
                  { label: 'Devises acceptées', val: 'JPY (¥), EUR (€), USD ($)', act: 'Ajouter/Enlever des devises' },
                ].map((ctrl) => (
                  <div key={ctrl.label} className="bg-[#1c1b1b]/70 border border-white/5 rounded-xl p-4 flex flex-col justify-between min-h-[120px]">
                    <div>
                      <div className="text-[10px] font-mono text-[#cdc3d4]/50 uppercase">{ctrl.label}</div>
                      <div className="font-bold text-xs mt-2 text-white">{ctrl.val}</div>
                    </div>
                    <button onClick={() => alert("Action administrative - Bientôt disponible")} className="text-secondary text-[9px] font-mono font-bold hover:underline text-left mt-4 uppercase tracking-wider">{ctrl.act} →</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-6">
              <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-[#cdc3d4]">Base JDM (Administration)</h3>
              <div className="bg-[#1c1b1b]/50 border border-white/5 rounded-xl p-4 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span>Vehicules en ligne</span>
                  <span className="text-white font-bold">{visibleProducts.length}</span>
                </div>
                <button onClick={onStartAdd} className="w-full bg-secondary text-[#400013] rounded-lg py-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]">
                  <Plus size={14} /> Ajouter un vehicule
                </button>
              </div>
              <div className="space-y-3 max-h-[170px] overflow-y-auto pr-1">
                {visibleProducts.map((product) => (
                  <div key={product.id} className="flex justify-between items-center bg-[#1c1b1b]/40 border border-white/5 rounded-lg p-2.5 text-[9px] font-mono">
                    <span className="truncate text-white">{product.year} {product.model}</span>
                    <div className="flex gap-1.5 ml-2">
                      <button onClick={() => onOpenEdit(product)} className="text-primary hover:underline">Editer</button>
                      <button onClick={() => onDeleteProduct(product.id)} className="text-red-400 hover:underline">Suppr</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function Home({ user, onLogout, onSelectAuction, onNavigate }) {
  // Jeu de données des produits traduit en français, en lien avec init.sql
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
      power: '276 ch (Est.)',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYHi8qgkPyuiftrZVdjQQwE4Eh7S158JuDGf2KJyFbAw4_KWz5d4jb56mQAqWwjei9durzUYfFKGEcqwY7tRbAFsG2V9SdRFM8_yOmMtdP-yeB2RSFav-20zapB5A2-eLNo1kVnIqHo-POlbW5KxaxTogcAEnl5734j-HI8ydyidVNsbUvFB2exBJWtgnyc4OqLMPJ3rvxKyXWl7HL8f0q8XDTPtQi4fVT27C-2shtfJlBWkwwnE48FdyHlVzDv4IJCqDPhX9qVpuS',
      category: 'Voitures JDM',
      status: 'Enchère en Cours',
      saleType: 'auction',
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
      power: '320 ch',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDSmJnIPbRjQaMNC1mHAisMSOoLuNqShjOz7DWIKtIg3yh_kD7839JfpBJPcbJfOn5wJi2zX0OolZH1QQMxMgRSNO9_8Vu3NkqQT1eZyvYICQH67HV5W9HT-ADfP83VaY5DX4vhuGqveqbUP_BeFLoYr4nAfh6R2gb_h5zhTMNF2lYv4ovJ7CSVWnlWW87jX_Y7YQfjYpSS6Lk4GmdzIl-alIhGDjNq0zI2tHfz7PtvN7LA-Nw92WC9WMgFmLDnKUBF0w5gWMyD0AP',
      category: 'Voitures JDM',
      status: 'Négociation',
      saleType: 'negotiation',
      verified: false
    },
    {
      id: 3,
      brand: 'HKS',
      model: 'Kit Turbine Sport GTIII-RS',
      year: 2024,
      price: 2450,
      chassis: 'Montage : Direct (Bolt-On)',
      engine: 'Moteurs : RB25DET / SR20DET',
      power: 'Cible : Jusqu\'à 450 ch',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFS_XUZxgUN809E7Tkl0nMfYsklWjXQomaFH_9Ehqim3Om8JpnDOo8Ms6GRPKjL7oiIN9Kowkch3-CjgZ-E-5oKxmeVDcHyc7cFJtsANv5KV6JMpeSmZX2T-P_eICndaeXgb1PhgCsIjmLwtzi8zhOMkwsdoIZSGx_pNwEvwwe1NS-iSLURfcT8U497XBOCuA9mg2NBGodYm8SgBO0qFDs1qHGp9IR1LLOMPX1svBVrxS7phBWKfaNiKO-n15c8084RcTvKW-6cUXE',
      category: 'Pièces Performance',
      status: 'Achat Direct',
      saleType: 'direct',
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
      engine: '13B-REW Rotatif',
      power: '276 ch',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
      category: 'Voitures JDM',
      status: 'Négociation',
      saleType: 'negotiation',
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
      power: '290 ch',
      image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80',
      category: 'Voitures JDM',
      status: 'Enchère en Cours',
      saleType: 'auction',
      verified: true
    },
    {
      id: 6,
      brand: 'Mugen',
      model: 'Jantes GP 18" Bronze (Set)',
      year: 2023,
      price: 3200,
      chassis: 'Taille : 18x8.5J +45',
      engine: 'Moteurs : Civic Type R FK8/FL5',
      power: 'Poids : 7.8 kg par jante',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
      category: 'Accessoires',
      status: 'Achat Direct',
      saleType: 'direct',
      verified: false
    }
  ];

  // Gestion des états
  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'admin';
  const isDirector = user?.role === 'directeur';
  const canModerate = isAdmin || isDirector;

  const [products, setProducts] = useState(initialProducts);
  const [pendingListings, setPendingListings] = useState(initialPendingListings);
  const [adminUsers, setAdminUsers] = useState(() => {
    try {
      const bannedEmails = JSON.parse(localStorage.getItem('mn_banned_emails') || '[]');
      const deletedEmails = JSON.parse(localStorage.getItem('mn_deleted_emails') || '[]');
      return mockUsers
        .filter((account) => !deletedEmails.includes(account.email))
        .map((account) => bannedEmails.includes(account.email) ? { ...account, status: 'banned' } : account);
    } catch (e) {
      return mockUsers;
    }
  });
  const [activePanel, setActivePanel] = useState('catalog');
  const [editingProduct, setEditingProduct] = useState(null);
  const [productDraft, setProductDraft] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProductDraft, setNewProductDraft] = useState({
    brand: 'Nissan',
    model: 'Silvia S15 Spec-R',
    year: 2001,
    price: 52000,
    mileage: 79000,
    chassis: 'S15-088451',
    engine: 'SR20DET',
    power: '250 ch',
    image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80',
    category: 'Voitures JDM',
    status: 'Achat Direct',
    saleType: 'direct',
    verified: true
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['Voitures JDM', 'Pièces Performance', 'Accessoires']);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState([]); // Tableau contenant les IDs des produits favoris
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false); // Filtre favoris uniquement
  const [salesFilter, setSalesFilter] = useState('all'); // 'all', 'auction', 'negotiation', 'direct'
  
  // États de Panier Premium
  const [cartItems, setCartItems] = useState([]);
  const [showCartMenu, setShowCartMenu] = useState(false);

  // États de Profil & Menus Déroulants opaques (pour éviter les overlapping bizarres)
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [showMessagesMenu, setShowMessagesMenu] = useState(false);

  // Données de Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Enchère Skyline R34 dépassée par takumi_86", time: "Il y a 10 min", read: false },
    { id: 2, text: "Nouveau message de Keiichi Tsuchiya", time: "Il y a 2 heures", read: false },
    { id: 3, text: "Entiercement validé pour Jantes GP 18\"", time: "Hier", read: true }
  ]);

  // Données de Messagerie
  const [messages, setMessages] = useState([
    { id: 1, sender: "Takumi Fujiwara", snippet: "Le turbo HKS est encore dispo ?", time: "18:42", online: true },
    { id: 2, sender: "Keiichi Tsuchiya", snippet: "Je pose une offre sur ta R34.", time: "15:20", online: false },
    { id: 3, sender: "Célestin (Admin)", snippet: "Réseau crypté opérationnel.", time: "Hier", online: true }
  ]);



  const requestAuthentication = (message = "Connexion requise pour continuer.") => {
    alert(message);
    onLoginRequest?.();
    return false;
  };

  const writeStoredList = (key, email) => {
    try {
      const current = JSON.parse(localStorage.getItem(key) || '[]');
      localStorage.setItem(key, JSON.stringify(Array.from(new Set([...current, email]))));
    } catch (e) {
      localStorage.setItem(key, JSON.stringify([email]));
    }
  };

  const handleDeleteProduct = (productId) => {
    if (!canModerate) return;
    setProducts(prev => prev.filter(product => product.id !== productId));
  };

  const handleOpenEditProduct = (product) => {
    if (!canModerate) return;
    setEditingProduct(product);
    setProductDraft({ ...product });
  };

  const handleSaveProductDraft = () => {
    if (!productDraft || !editingProduct) return;
    setProducts(prev => prev.map(product => (
      product.id === editingProduct.id
        ? { ...productDraft, price: editingProduct.price }
        : product
    )));
    setEditingProduct(null);
    setProductDraft(null);
  };

  const handleAddProduct = () => {
    if (!canModerate) return;
    const nextId = Math.max(...products.map(product => product.id), 0) + 1;
    setProducts(prev => [{ ...newProductDraft, id: nextId }, ...prev]);
    setAddingProduct(false);
  };

  const handleApproveListing = (listing) => {
    if (!canModerate) return;
    const nextId = Math.max(...products.map(product => product.id), 0) + 1;
    setProducts(prev => [{
      id: nextId,
      brand: listing.brand,
      model: listing.model,
      year: listing.year,
      price: listing.price,
      mileage: listing.mileage,
      chassis: listing.category === 'Voitures JDM' ? 'KYC vendeur approuve' : 'Piece verifiee',
      engine: listing.category === 'Voitures JDM' ? 'Dossier import complet' : 'Compatibilite confirmee',
      power: listing.identityStatus === 'validee' ? 'Vendeur verifie' : 'Validation admin',
      image: listing.image,
      category: listing.category,
      status: listing.saleType === 'auction' ? 'Enchere en Cours' : listing.saleType === 'negotiation' ? 'Negociation' : 'Achat Direct',
      saleType: listing.saleType,
      verified: true
    }, ...prev]);
    setPendingListings(prev => prev.filter(item => item.id !== listing.id));
  };

  const handleRejectListing = (listingId) => {
    if (!canModerate) return;
    setPendingListings(prev => prev.filter(item => item.id !== listingId));
  };

  const handleBanUser = (email) => {
    if (!canModerate) return;
    writeStoredList('mn_banned_emails', email);
    setAdminUsers(prev => prev.map(account => account.email === email ? { ...account, status: 'banned' } : account));
  };

  const handleDeleteUser = (email) => {
    if (!canModerate) return;
    writeStoredList('mn_deleted_emails', email);
    setAdminUsers(prev => prev.filter(account => account.email !== email));
  };

  // Fermer les autres menus lors de l'ouverture d'un nouveau menu
  const toggleNotifications = () => {
    setShowNotificationsMenu(!showNotificationsMenu);
    setShowMessagesMenu(false);
    setShowCartMenu(false);
    setShowProfileMenu(false);
  };

  const toggleMessages = () => {
    setShowMessagesMenu(!showMessagesMenu);
    setShowNotificationsMenu(false);
    setShowCartMenu(false);
    setShowProfileMenu(false);
  };

  const toggleCart = () => {
    setShowCartMenu(!showCartMenu);
    setShowNotificationsMenu(false);
    setShowMessagesMenu(false);
    setShowProfileMenu(false);
  };

  const toggleProfile = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotificationsMenu(false);
    setShowMessagesMenu(false);
    setShowCartMenu(false);
  };

  // Ajouter / Retirer des favoris
  const toggleFavorite = (productId) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  // Clic sur une catégorie
  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Clic pastille de marque
  const handleBrandSelect = (brand) => {
    if (selectedBrand === brand) {
      setSelectedBrand(null);
    } else {
      setSelectedBrand(brand);
    }
  };

  // Filtrage dynamique
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.engine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.chassis.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategories.includes(product.category);
    const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;
    const matchesFavorites = showOnlyFavorites ? favorites.includes(product.id) : true;
    const matchesSalesType = salesFilter === 'all' ? true : product.saleType === salesFilter;

    return matchesSearch && matchesCategory && matchesBrand && matchesFavorites && matchesSalesType;
  });




  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      requestAuthentication("Vous devez etre connecte pour acheter une voiture ou une piece.");
      return;
    }
    setCartItems(prev => [...prev, product]);
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  // Action administrative : supprimer un produit de la liste locale
  const handleAdminDelete = (productId, model) => {
    if (window.confirm(`[ADMIN] Confirmer la suppression définitive du produit : ${model} ?`)) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      alert(`Produit ${model} supprimé du catalogue.`);
    }
  };

  const handleReadNotification = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Lancement de l'alerte vendeur à la connexion
  useEffect(() => {
    if (user?.role === 'seller') {
      alert("La page espace vendeur doit être implémentée par Nicolas.");
    }
  }, [user]);

  // Rendu conditionnel si vendeur
  if (user?.role === 'seller') {
    return (
      <div className="min-h-screen bg-[#131313] text-[#e5e2e1] antialiased overflow-x-hidden font-sans pt-24 selection:bg-primary selection:text-[#460283]">
        {/* Gradients lumineux néons en arrière-plan */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-[#17deca]/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] left-0 w-[35vw] h-[35vw] rounded-full bg-secondary/5 blur-[120px] pointer-events-none"></div>

        {/* Navigation Vendeur */}
        <nav className="bg-[#131313]/80 backdrop-blur-xl fixed top-0 w-full z-40 border-b border-white/10 shadow-[0_0_20px_rgba(23,222,202,0.1)]">
          <div className="flex justify-between items-center h-20 px-4 md:px-16 w-full max-w-[1440px] mx-auto">
            {/* Logo & Titre */}
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded bg-[#17deca] flex items-center justify-center font-black tracking-tighter text-[#003830] italic text-lg shadow-[0_0_12px_rgba(23,222,202,0.4)]">
                MN
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-wider text-[#dab9ff] italic uppercase">MERCATO <span className="text-[#ffb2bc]">NOVA</span></span>
                <p className="text-[9px] text-[#cdc3d4]/50 font-mono tracking-widest -mt-1 uppercase">Tokyo Underground</p>
              </div>
            </div>

            {/* Onglet vendeur */}
            <div className="hidden lg:flex gap-8 items-center font-semibold text-sm">
              <span className="text-[#17deca] border-b-2 border-[#17deca] pb-1 font-mono uppercase tracking-widest text-xs">Espace Vendeur</span>
            </div>

            {/* Profil */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={toggleProfile}
                  className={`p-2 rounded-full transition-all active:scale-95 cursor-pointer ${
                    showProfileMenu ? 'text-[#17deca] bg-white/5' : 'text-[#cdc3d4] hover:text-[#17deca] hover:bg-white/5'
                  }`}
                >
                  <User size={20} />
                </button>

                {showProfileMenu && (
                  <>
                    <div onClick={() => setShowProfileMenu(false)} className="fixed inset-0 z-30"></div>
                    <div className="absolute right-0 mt-3 w-52 rounded-xl border border-white/10 bg-[#1c1b1b] py-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-40">
                      <div className="px-4 py-2.5 border-b border-white/5 mb-1.5 text-[10px] font-mono">
                        <span className="block text-[#cdc3d4]/40 font-bold uppercase tracking-wider text-[8px]">Réseau Vendeur</span>
                        <span className="text-zinc-200 truncate block mt-0.5" title={user?.email}>{user?.email}</span>
                        <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded bg-tertiary/10 text-tertiary border border-tertiary/20 text-[8px] font-bold uppercase tracking-wider">
                          <Cpu size={8} /> Vendeur
                        </span>
                      </div>

                      <button 
                        onClick={() => { setShowProfileMenu(false); alert("La page espace vendeur doit être implémentée par Nicolas."); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-xs font-mono text-[#cdc3d4] hover:text-tertiary hover:bg-tertiary/5 transition-all text-left cursor-pointer"
                      >
                        <Cpu size={14} className="text-tertiary" />
                        <span>Mon Inventaire</span>
                      </button>

                      <button 
                        onClick={() => { setShowProfileMenu(false); onLogout(); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-xs font-mono text-zinc-400 hover:text-red-400 hover:bg-red-500/5 transition-all text-left cursor-pointer border-t border-white/5 mt-1.5 pt-2"
                      >
                        <LogOut size={14} className="text-zinc-500" />
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Dashboard Placeholder */}
        <main className="max-w-[1440px] mx-auto px-4 md:px-16 py-12 flex items-center justify-center min-h-[60vh] relative z-10">
          <div className="glass-panel w-full max-w-2xl rounded-3xl border border-white/5 p-10 text-center space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.4)]">
            <div className="w-16 h-16 rounded-full bg-[#17deca]/10 border border-[#17deca]/30 text-[#17deca] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(23,222,202,0.15)]">
              <Cpu size={28} className="animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <span className="text-[#17deca] font-mono text-xs uppercase tracking-widest font-bold">Syndicate Vendor Console</span>
              <h2 className="text-2xl sm:text-3xl font-black italic tracking-tighter uppercase text-[#dab9ff]">
                Votre Espace Vendeur
              </h2>
              <p className="text-sm text-[#cdc3d4]/70 max-w-md mx-auto">
                Interface de gestion des stocks, d'ajout de bolides JDM et de suivi des enchères en cours.
              </p>
            </div>

            {/* Avertissement de développement */}
            <div className="bg-[#17deca]/5 border border-[#17deca]/20 rounded-xl p-5 max-w-lg mx-auto text-left font-mono text-xs space-y-2 text-[#17deca]">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                <Shield size={14} />
                <span>Message du Système</span>
              </div>
              <p className="text-[#cdc3d4]/80 leading-relaxed text-[11px]">
                Ce module de vente crypté (ajout de voitures en base de données, validation d'offres) doit être implémenté par <strong>Nicolas</strong> lors de la prochaine étape d'intégration du backend.
              </p>
            </div>

            <div className="pt-4 flex justify-center gap-4">
              <button 
                onClick={() => alert("La page espace vendeur doit être implémentée par Nicolas.")}
                className="bg-[#17deca] hover:bg-[#17deca]/95 text-[#003830] font-bold text-xs px-6 py-3.5 rounded-lg uppercase tracking-wider cursor-pointer transition-all active:scale-95 shadow-[0_0_15px_rgba(23,222,202,0.3)] font-sans"
              >
                Ajouter un Bolide
              </button>
              <button 
                onClick={onLogout}
                className="bg-white/5 hover:bg-white/10 text-zinc-300 font-bold text-xs px-6 py-3.5 rounded-lg uppercase tracking-wider cursor-pointer border border-white/10 transition-all active:scale-95 font-sans"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </main>

        <footer className="bg-[#0e0e0e] border-t border-white/5 py-12 text-[#cdc3d4]/40 text-xs font-mono">
          <div className="max-w-[1440px] mx-auto px-4 md:px-16 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p>© 2026 Mercato Nova. Tous droits réservés.</p>
            <div className="flex items-center space-x-2 text-[10px] uppercase text-tertiary">
              <Shield size={12} />
              <span>Bouclier de Vente Vérifié</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] antialiased overflow-x-hidden font-sans pt-24 selection:bg-primary selection:text-[#460283]">

      {/* Gradients lumineux néons en arrière-plan */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-0 w-[35vw] h-[35vw] rounded-full bg-secondary/5 blur-[120px] pointer-events-none"></div>

      {/* Barre de navigation */}
      <nav className="bg-[#131313]/80 backdrop-blur-xl fixed top-0 w-full z-40 border-b border-white/10 shadow-[0_0_20px_rgba(187,134,252,0.1)]">
        <div className="flex justify-between items-center h-20 px-4 md:px-16 w-full max-w-[1440px] mx-auto">

          {/* Logo & Titre */}
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded bg-[#bb86fc] flex items-center justify-center font-black tracking-tighter text-[#460283] italic text-lg shadow-[0_0_12px_rgba(187,134,252,0.4)]">
              MN
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider text-[#dab9ff] italic uppercase">MERCATO <span className="text-[#ffb2bc]">NOVA</span></span>
              <p className="text-[9px] text-[#cdc3d4]/50 font-mono tracking-widest -mt-1 uppercase">Tokyo Underground</p>
            </div>
          </div>

          {/* Onglets Principaux */}
          <div className="hidden lg:flex gap-8 items-center font-semibold text-sm">
            <button 
              onClick={() => setSalesFilter('all')}
              className="text-[#bb86fc] border-b-2 border-[#bb86fc] pb-1 cursor-pointer transition-colors font-semibold text-sm bg-transparent border-none"
            >
              Catalogue
            </button>
            <button 
              onClick={() => onNavigate('auctions_list')}
              className="text-[#cdc3d4] hover:text-[#e5e2e1] pb-1 cursor-pointer transition-colors font-semibold text-sm bg-transparent border-none"
            >
              Enchères
            </button>
            <button 
              onClick={() => alert("Espace Préparations bientôt disponible (Gabin / Préparations)")}
              className="text-[#cdc3d4] hover:text-[#e5e2e1] pb-1 cursor-pointer transition-colors bg-transparent border-none font-semibold text-sm"
            >
              Préparations
            </button>
          </div>

          {/* Recherche & Icônes d'action */}
          <div className="flex items-center gap-4 md:gap-6">

            {/* Input de Recherche */}
            <div className="relative group input-glow border border-white/10 rounded-lg bg-[#1c1b1b] transition-all duration-300 w-44 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#cdc3d4] w-4.5 h-4.5" />
              <input
                className="w-full bg-transparent border-none text-[#e5e2e1] font-mono text-xs pl-10 pr-4 py-2.5 focus:outline-none focus:ring-0 placeholder-[#cdc3d4]/30"
                placeholder="Rechercher châssis, moteur, pièces..."
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
              
              {/* Menu Déroulant Notifications */}
              <div className="relative">
                <button 
                  onClick={toggleNotifications}
                  className={`p-2 rounded-full transition-all relative active:scale-95 cursor-pointer ${
                    showNotificationsMenu ? 'text-[#bb86fc] bg-white/5' : 'text-[#cdc3d4] hover:text-[#bb86fc] hover:bg-white/5'
                  }`}
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(187,134,252,0.6)]"></span>
                  )}
                </button>

                {showNotificationsMenu && (
                  <>
                    <div onClick={() => setShowNotificationsMenu(false)} className="fixed inset-0 z-30"></div>
                    <div className="absolute right-0 mt-3 w-80 rounded-xl border border-white/10 bg-[#1c1b1b] py-3 shadow-[0_10px_30px_rgba(0,0,0,0.6)] z-40 animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                      <div className="px-4 pb-2 border-b border-white/5 flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-[#cdc3d4]/50 uppercase tracking-widest">Flux Réseau</span>
                        <button 
                          onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                          className="text-[9px] font-mono text-[#bb86fc] hover:underline font-bold"
                        >
                          Tout lire
                        </button>
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto mt-1 divide-y divide-white/5">
                        {notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => handleReadNotification(n.id)}
                            className={`px-4 py-3 hover:bg-white/5 transition-all relative cursor-pointer ${!n.read ? 'bg-primary/5' : ''}`}
                          >
                            {!n.read && <span className="absolute top-3.5 left-2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>}
                            <p className="text-xs text-zinc-200 pl-1">{n.text}</p>
                            <span className="text-[9px] font-mono text-zinc-500 block mt-1 pl-1">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Menu Déroulant Messagerie */}
              <div className="relative">
                <button 
                  onClick={toggleMessages}
                  className={`p-2 rounded-full transition-all relative active:scale-95 cursor-pointer ${
                    showMessagesMenu ? 'text-[#bb86fc] bg-white/5' : 'text-[#cdc3d4] hover:text-[#bb86fc] hover:bg-white/5'
                  }`}
                  title="Messages"
                >
                  <MessageSquare size={20} />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-secondary"></span>
                </button>

                {showMessagesMenu && (
                  <>
                    <div onClick={() => setShowMessagesMenu(false)} className="fixed inset-0 z-30"></div>
                    <div className="absolute right-0 mt-3 w-80 rounded-xl border border-white/10 bg-[#1c1b1b] py-3 shadow-[0_10px_30px_rgba(0,0,0,0.6)] z-40 animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                      <div className="px-4 pb-2 border-b border-white/5 flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-[#cdc3d4]/50 uppercase tracking-widest">Messagerie</span>
                        <span className="text-[9px] font-mono text-[#17deca] font-bold">3 Actifs</span>
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto mt-1 divide-y divide-white/5">
                        {messages.map(m => (
                          <div 
                            key={m.id} 
                            onClick={() => { setShowMessagesMenu(false); alert(`Discussion ouverte avec ${m.sender} (simulation)`); }} 
                            className="px-4 py-3 hover:bg-white/5 transition-all flex items-start gap-3 cursor-pointer"
                          >
                            <div className="relative flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-[#bb86fc]">
                                {m.sender.split(' ').map(n=>n[0]).join('')}
                              </div>
                              {m.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#17deca] border-2 border-[#1c1b1b]"></span>}
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="flex justify-between items-baseline mb-0.5">
                                <h4 className="text-xs font-bold text-zinc-200 truncate">{m.sender}</h4>
                                <span className="text-[9px] font-mono text-zinc-500">{m.time}</span>
                              </div>
                              <p className="text-[11px] text-[#cdc3d4]/70 truncate">{m.snippet}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Bouton Favoris Interactif */}
              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`p-2 rounded-full transition-all relative active:scale-95 cursor-pointer ${showOnlyFavorites ? 'text-[#ffb2bc] bg-[#ffb2bc]/10 shadow-[0_0_12px_rgba(255,178,188,0.25)]' : 'text-[#cdc3d4] hover:text-[#ffb2bc] hover:bg-white/5'
                  }`}
                title={showOnlyFavorites ? "Afficher tout le catalogue" : "Afficher mes favoris"}
              >
                <Heart size={20} className={showOnlyFavorites ? "fill-[#ffb2bc]" : ""} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ffb2bc] text-[9px] text-[#400013] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(255,178,188,0.5)]">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Menu Déroulant Panier */}
              <div className="relative">
                <button 
                  onClick={toggleCart}
                  className={`p-2 rounded-full transition-all relative active:scale-95 cursor-pointer ${
                    showCartMenu ? 'text-[#bb86fc] bg-white/5' : 'text-[#cdc3d4] hover:text-[#bb86fc] hover:bg-white/5'
                  }`}
                  title="Panier"
                >
                  <ShoppingCart size={20} />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary text-[9px] text-[#400013] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(255,178,188,0.5)]">
                      {cartItems.length}
                    </span>
                  )}
                </button>

                {showCartMenu && (
                  <>
                    <div onClick={() => setShowCartMenu(false)} className="fixed inset-0 z-30"></div>
                    <div className="absolute right-0 mt-3 w-80 rounded-xl border border-white/10 bg-[#1c1b1b] py-3 shadow-[0_10px_30px_rgba(0,0,0,0.6)] z-40 animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                      <div className="px-4 pb-2 border-b border-white/5 flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-[#cdc3d4]/50 uppercase tracking-widest">Panier</span>
                        <span className="text-[9px] font-mono text-zinc-400 font-bold">{cartItems.length} article{cartItems.length > 1 ? 's' : ''}</span>
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto mt-1 divide-y divide-white/5">
                        {cartItems.length === 0 ? (
                          <div className="px-4 py-8 text-center space-y-2">
                            <ShoppingCart size={24} className="text-zinc-600 mx-auto" />
                            <p className="text-xs text-zinc-500">Votre panier est vide.</p>
                          </div>
                        ) : (
                          cartItems.map((item, index) => (
                            <div key={index} className="px-4 py-3 hover:bg-white/5 transition-all flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <img src={item.image} alt={item.model} className="w-10 h-8 object-cover rounded border border-white/10 flex-shrink-0" />
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-zinc-200 truncate">{item.model}</h4>
                                  <span className="text-[10px] font-mono text-[#bb86fc]">${item.price.toLocaleString()}</span>
                                </div>
                              </div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleRemoveFromCart(item.id); }}
                                className="text-zinc-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                                title="Retirer"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {cartItems.length > 0 && (
                        <div className="px-4 pt-3 border-t border-white/5 mt-2 space-y-2.5">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-zinc-400">Total :</span>
                            <span className="font-bold text-[#17deca]">${cartItems.reduce((acc, item) => acc + item.price, 0).toLocaleString()}</span>
                          </div>
                          <button 
                            onClick={() => { setShowCartMenu(false); alert("Panier validé ! Célestin mettra bientôt en place le tunnel de paiement de l'entiercement."); }}
                            className="w-full bg-[#bb86fc] hover:bg-[#bb86fc]/80 text-[#460283] font-bold text-[10px] font-mono py-2.5 rounded uppercase tracking-wider text-center cursor-pointer transition-colors block"
                          >
                            Valider la commande
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Menu Profil avec Dropdown - OPAQUE */}
              <div className="relative">
                <button 
                  onClick={toggleProfile}
                  className={`p-2 rounded-full transition-all active:scale-95 cursor-pointer ${
                    showProfileMenu ? 'text-[#bb86fc] bg-white/5' : 'text-[#cdc3d4] hover:text-[#bb86fc] hover:bg-white/5'
                  }`}
                  title="Mon profil"
                >
                  <User size={20} />
                </button>

                {/* Dropdown Menu de Profil OPAQUE */}
                {showProfileMenu && (
                  <>
                    <div 
                      onClick={() => setShowProfileMenu(false)}
                      className="fixed inset-0 z-30"
                    ></div>
                    
                    <div className="absolute right-0 mt-3 w-52 rounded-xl border border-white/10 bg-[#1c1b1b] py-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                      
                      {/* En-tête de Profil Premium */}
                      <div className="px-4 py-2.5 border-b border-white/5 mb-1.5 text-[10px] font-mono">
                        <span className="block text-[#cdc3d4]/40 font-bold uppercase tracking-wider text-[8px]">Réseau Pilote</span>
                        <span className="text-zinc-200 truncate block mt-0.5" title={user?.email || 'Invite'}>
                          {user?.email || 'Invite - consultation libre'}
                        </span>
                        {user?.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20 text-[8px] font-bold uppercase tracking-wider shadow-[0_0_8px_rgba(255,178,188,0.15)]">
                            <Shield size={8} /> Admin VIP
                          </span>
                        ) : user?.role === 'seller' ? (
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded bg-tertiary/10 text-tertiary border border-tertiary/20 text-[8px] font-bold uppercase tracking-wider">
                            <Cpu size={8} /> Vendeur
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[8px] font-bold uppercase tracking-wider">
                            <User size={8} /> Client
                          </span>
                        )}
                      </div>

                      {!user && (
                        <button 
                          onClick={() => { setShowProfileMenu(false); onLoginRequest?.(); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-xs font-mono text-primary hover:bg-primary/5 transition-all text-left cursor-pointer"
                        >
                          <UserCheck size={14} className="text-primary" />
                          <span>Se connecter</span>
                        </button>
                      )}

                      <button 
                        onClick={() => { setShowProfileMenu(false); alert("Ouverture de l'espace Mon compte (Célestin / Profil)"); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-xs font-mono text-[#cdc3d4] hover:text-primary hover:bg-primary/5 transition-all text-left cursor-pointer"
                      >
                        <User size={14} className="text-[#bb86fc]" />
                        <span>Mon compte</span>
                      </button>
                      
                      <button 
                        onClick={() => { setShowProfileMenu(false); alert("Ouverture de l'espace Mes achats (Gabin / Historique)"); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-xs font-mono text-[#cdc3d4] hover:text-secondary hover:bg-secondary/5 transition-all text-left cursor-pointer"
                      >
                        <ShoppingCart size={14} className="text-[#ffb2bc]" />
                        <span>Mes achats</span>
                      </button>
                      
                      {/* Cacher l'espace vendeur pour les clients de type buyer */}
                      {user?.role !== 'buyer' && (
                        <button 
                          onClick={() => { setShowProfileMenu(false); alert("La page espace vendeur doit être implémentée par Nicolas."); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-xs font-mono text-[#cdc3d4] hover:text-[#17deca] hover:bg-[#17deca]/5 transition-all text-left cursor-pointer border-t border-white/5 mt-1 pt-1.5"
                        >
                          <Cpu size={14} className="text-[#17deca]" />
                          <span>Espace vendeur</span>
                        </button>
                      )}

                      {/* Lien Administrateur Conditionnel */}
                      {canModerate && (
                        <button 
                          onClick={() => { setShowProfileMenu(false); alert("Accès à l'Espace d'Administration Système. Bienvenue Gabin !"); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-xs font-mono text-secondary hover:bg-secondary/5 transition-all text-left cursor-pointer border-t border-white/5 mt-1 pt-1.5"
                        >
                          <Shield size={14} className="text-secondary" />
                          <span>Console Admin</span>
                        </button>
                      )}

                      {/* Bouton Déconnexion */}
                      <button 
                        onClick={() => { setShowProfileMenu(false); onLogout(); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-xs font-mono text-zinc-400 hover:text-red-400 hover:bg-red-500/5 transition-all text-left cursor-pointer border-t border-white/5 mt-1.5 pt-2"
                      >
                        <LogOut size={14} className="text-zinc-500" />
                        <span>Se déconnecter</span>
                      </button>

                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Zone de contenu principale */}
      {activePanel === 'catalog' ? (
      <main className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 grid grid-cols-4 lg:grid-cols-12 gap-6">

        {/* Panneau de Filtres Latéral */}
        <aside className="col-span-4 lg:col-span-3 space-y-6">
          {canModerate && (
            <div className="glass-panel rounded-2xl p-5 border border-secondary/20">
              <div className="flex items-center gap-2 text-secondary mb-3">
                {isDirector ? <Crown size={18} /> : <Shield size={18} />}
                <h3 className="font-bold text-sm uppercase tracking-wider">{isDirector ? 'Espace directeur' : 'Espace admin'}</h3>
              </div>
              <p className="text-[11px] text-[#cdc3d4]/70 font-mono mb-4">
                Moderation des annonces, gestion des comptes et statistiques.
              </p>
              <button
                onClick={() => setActivePanel(isDirector ? 'director' : 'overview')}
                className="w-full bg-secondary text-[#400013] rounded-lg py-2.5 text-[10px] font-bold uppercase tracking-wider"
              >
                Ouvrir la console
              </button>
            </div>
          )}
          <div className="glass-panel rounded-2xl p-5 border border-tertiary/20">
            <div className="flex items-center gap-2 text-tertiary mb-3">
              <Plus size={18} />
              <h3 className="font-bold text-sm uppercase tracking-wider">Vendre un bien</h3>
            </div>
            <p className="text-[11px] text-[#cdc3d4]/70 font-mono mb-4">
              Toute nouvelle annonce passe en attente jusqu'a validation admin.
            </p>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  requestAuthentication("Vous devez etre connecte pour ajouter une annonce au catalogue.");
                  return;
                }
                const nextId = Math.max(...pendingListings.map(item => item.id), 100) + 1;
                setPendingListings(prev => [{
                  id: nextId,
                  brand: 'Honda',
                  model: 'Civic Type R EK9',
                  year: 1998,
                  price: 36000,
                  mileage: 92000,
                  sellerEmail: user.email,
                  sellerName: `${user.firstName || 'Vendeur'} ${user.lastName || 'Mercato'}`,
                  sellerPhone: user.phone || 'A renseigner',
                  identityStatus: 'a verifier',
                  idCardCriteria: ['recto verso lisible', 'date valide', 'nom identique au compte'],
                  image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80',
                  category: 'Voitures JDM',
                  saleType: 'negotiation',
                  status: 'En attente',
                  reason: 'Annonce creee depuis le catalogue par un vendeur connecte.',
                }, ...prev]);
                alert("Annonce envoyee en moderation. Elle apparait dans la console admin.");
              }}
              className="w-full border border-tertiary/40 text-tertiary rounded-lg py-2.5 text-[10px] font-bold uppercase tracking-wider hover:bg-tertiary/10"
            >
              Proposer une annonce
            </button>
          </div>
          <div className="glass-panel rounded-2xl p-6 border border-white/5">
            <div className="flex items-center space-x-2.5 mb-6">
              <SlidersHorizontal className="text-[#bb86fc]" size={18} />
              <h3 className="font-bold text-base tracking-wide font-sans">Affiner la Recherche</h3>
            </div>

            <div className="space-y-6">

              {/* Choix des Catégories */}
              <div>
                <h4 className="text-[11px] font-bold text-[#cdc3d4]/50 uppercase tracking-widest mb-3">Catégories</h4>
                <ul className="space-y-2.5">
                  {['Voitures JDM', 'Pièces Performance', 'Accessoires'].map((cat) => (
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

              {/* Constructeurs JDM */}
              <div className="pt-5 border-t border-white/5">
                <h4 className="text-[11px] font-bold text-[#cdc3d4]/50 uppercase tracking-widest mb-3">Marque / Constructeur</h4>
                <div className="flex flex-wrap gap-2">
                  {['Nissan', 'Toyota', 'Honda', 'Mazda', 'HKS', 'Mugen'].map((brand) => (
                    <button
                      key={brand}
                      onClick={() => handleBrandSelect(brand)}
                      className={`px-3.5 py-1.5 rounded-full border transition-all font-mono text-xs cursor-pointer ${selectedBrand === brand
                          ? 'border-[#bb86fc] text-[#bb86fc] bg-[#bb86fc]/10 shadow-[0_0_10px_rgba(187,134,252,0.25)]'
                          : 'border-white/10 text-[#cdc3d4] hover:border-[#bb86fc]/50 hover:text-[#bb86fc]'
                        }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Favoris Uniquement */}
              <div className="pt-4 mt-4 border-t border-white/5">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    checked={showOnlyFavorites}
                    onChange={() => setShowOnlyFavorites(!showOnlyFavorites)}
                    className="form-checkbox bg-[#201f1f] border-white/10 text-[#ffb2bc] focus:ring-[#ffb2bc] rounded cursor-pointer"
                    type="checkbox"
                  />
                  <span className="text-sm text-[#e5e2e1] group-hover:text-[#ffb2bc] transition-colors flex items-center gap-1.5">
                    <Heart size={14} className={showOnlyFavorites ? "fill-[#ffb2bc] text-[#ffb2bc]" : "text-[#cdc3d4]"} />
                    Favoris uniquement
                  </span>
                </label>
              </div>

              {/* Bloc de Statut Réseau */}
              <div className="pt-6 border-t border-white/5 bg-[#1c1b1b]/30 p-4 rounded-xl">
                <div className="flex items-center space-x-2 text-[#ffb2bc] mb-2">
                  <Zap size={14} />
                  <span className="text-xs font-bold uppercase tracking-wider">Syndicat Hub</span>
                </div>
                <p className="text-[11px] text-[#cdc3d4]/65 leading-relaxed font-mono">
                  Base de données active (MAMP OK). Flux d'enchères connecté. Système d'entiercement sécurisé.
                </p>
              </div>

            </div>
          </div>
        </aside>

        {/* Grille du Catalogue Produits */}
        <section className="col-span-4 lg:col-span-9 space-y-6">

          {/* Bannière Modérateur Admin */}
          {user?.role === 'admin' && (
            <div className="bg-[#ffb2bc]/5 border border-[#ffb2bc]/20 rounded-xl p-4 flex items-center justify-between font-mono text-xs text-[#ffb2bc] shadow-[0_0_15px_rgba(255,178,188,0.05)] animate-in fade-in duration-300 relative z-10">
              <div className="flex items-center gap-2.5">
                <Shield size={16} />
                <span><strong>Mode Modérateur Actif</strong> — Droits de modération globale et suppression d'annonces activés.</span>
              </div>
              <span className="text-[9px] bg-[#ffb2bc]/10 px-2 py-0.5 rounded uppercase tracking-wider font-bold">Admin Console</span>
            </div>
          )}

          {/* En-tête de section */}
          <div className="flex justify-between items-end border-b border-white/5 pb-4">
            <div>
              <div className="inline-flex items-center space-x-2.5 bg-[#7e273b]/20 border border-[#ffb2bc]/30 px-3 py-1 rounded-full text-xs text-[#ffb2bc] mb-3">
                <Compass size={13} className="animate-spin" style={{ animationDuration: '6s' }} />
                <span>Marché du Syndicat Tokyo Drift</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#e5e2e1] uppercase">
                Performance Légendaire
              </h1>
              <p className="text-xs text-[#cdc3d4] mt-1 font-mono">
                {filteredProducts.length} légendes mécaniques vérifiées sous notre charte.
              </p>
            </div>

            {/* Bascule Grille / Liste */}
            <div className="hidden sm:flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded border cursor-pointer transition-all ${viewMode === 'grid'
                    ? 'glass-panel text-primary border-primary neon-glow-primary'
                    : 'glass-panel border-white/15 text-[#cdc3d4] hover:text-[#e5e2e1]'
                  }`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded border cursor-pointer transition-all ${viewMode === 'list'
                    ? 'glass-panel text-primary border-primary neon-glow-primary'
                    : 'glass-panel border-white/15 text-[#cdc3d4] hover:text-[#e5e2e1]'
                  }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Sélecteur de type de vente (Tabs Horizontaux) */}
          <div className="flex flex-wrap gap-2 p-1 bg-[#1c1b1b]/80 border border-white/5 rounded-xl max-w-2xl">
            {[
              { id: 'all', label: 'Tout afficher', icon: Compass },
              { id: 'auction', label: 'Enchères en direct', icon: Timer },
              { id: 'negotiation', label: 'Négociations', icon: MessageSquare },
              { id: 'direct', label: 'Achat direct', icon: ShoppingCart },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSalesFilter(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${salesFilter === tab.id
                      ? 'bg-[#bb86fc] text-[#460283] shadow-[0_0_12px_rgba(187,134,252,0.3)]'
                      : 'text-[#cdc3d4] hover:text-[#e5e2e1] hover:bg-white/5'
                    }`}
                >
                  <TabIcon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Grille ou Liste de Cartes */}
          <div className={viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 gap-6"
            : "space-y-4"
          }>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`glass-panel rounded-2xl overflow-hidden group hover:neon-glow-primary transition-all duration-300 border border-white/5 flex flex-col ${viewMode === 'list' ? 'md:flex-row' : ''
                    }`}
                >
                  {/* Image de la voiture ou pièce */}
                  <div className={`relative overflow-hidden bg-[#2a2a2a] ${viewMode === 'list' ? 'h-48 md:w-72 md:h-full flex-shrink-0' : 'h-56 w-full'
                    }`}>
                    <img
                      alt={product.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                      src={product.image}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/20 to-transparent"></div>

                    {/* Bouton de mise en favori flottant */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      className="absolute top-4 right-4 p-2 rounded-full glass-panel border border-white/20 hover:scale-110 active:scale-95 transition-all text-white cursor-pointer hover:bg-white/10 z-10"
                      title={favorites.includes(product.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      <Heart
                        size={14}
                        className={favorites.includes(product.id) ? "fill-[#ffb2bc] text-[#ffb2bc] drop-shadow-[0_0_8px_rgba(255,178,188,0.6)]" : "text-white"}
                      />
                    </button>

                    {canModerate && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product.id);
                        }}
                        className="absolute top-4 right-16 p-2 rounded-full bg-red-500/80 border border-red-200/30 hover:scale-110 active:scale-95 transition-all text-white cursor-pointer z-10"
                        title="Supprimer l'annonce"
                      >
                        <X size={14} />
                      </button>
                    )}

                    {/* Tags Flottants */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                      {product.verified && (
                        <span className="bg-[#bb86fc] text-[#460283] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_8px_rgba(187,134,252,0.4)] flex items-center gap-1">
                          <Check size={9} strokeWidth={3} /> Vérifié
                        </span>
                      )}
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-white/10 ${product.saleType === 'auction'
                          ? 'bg-secondary-dark/45 text-[#ffb2bc] border-[#ffb2bc]/30 shadow-[0_0_8px_rgba(255,178,188,0.2)]'
                          : product.saleType === 'negotiation'
                            ? 'bg-tertiary/10 text-tertiary border-tertiary/20 shadow-[0_0_8px_rgba(23,222,202,0.2)]'
                            : 'bg-[#1c1b1b] text-zinc-300 border-zinc-700/50'
                        }`}>
                        {product.status}
                      </span>
                    </div>
                  </div>

                  {/* Corps de la Fiche */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-[#ffb2bc] text-[10px] font-mono uppercase tracking-widest">{product.brand}</span>
                          <h3 className="font-extrabold text-base md:text-lg group-hover:text-primary transition-colors text-zinc-100">
                            {product.year} {product.model}
                          </h3>
                        </div>
                        {product.category === 'Voitures JDM' && (
                          <div className="text-right">
                            <span className="text-[9px] text-[#cdc3d4]/40 font-mono block">Valeur Actuelle</span>
                            <span className="font-extrabold text-[#bb86fc] tracking-tight font-mono">
                              ${product.price.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Caractéristiques techniques */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 my-4 border-t border-b border-white/5 py-3 font-mono text-[11px] text-[#cdc3d4]/70">
                        <div>
                          <span className="text-[#cdc3d4]/30 block text-[9px] uppercase tracking-wider">CHÂSSIS / GRADE</span>
                          <span className="font-semibold text-zinc-200">{product.chassis}</span>
                        </div>
                        {product.mileage ? (
                          <div>
                            <span className="text-[#cdc3d4]/30 block text-[9px] uppercase tracking-wider">KILOMÉTRAGE</span>
                            <span className="font-semibold text-zinc-200">{product.mileage.toLocaleString()} km</span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-[#cdc3d4]/30 block text-[9px] uppercase tracking-wider">STATUT</span>
                            <span className="font-semibold text-[#17deca]">{product.status}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-[#cdc3d4]/30 block text-[9px] uppercase tracking-wider">MOTEUR</span>
                          <span className="font-semibold text-zinc-200">{product.engine}</span>
                        </div>
                        <div>
                          <span className="text-[#cdc3d4]/30 block text-[9px] uppercase tracking-wider">PUISSANCE / CIBLE</span>
                          <span className="font-semibold text-zinc-200">{product.power}</span>
                        </div>
                      </div>
                    </div>

                    {canModerate && (
                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={() => handleOpenEditProduct(product)}
                          className="flex items-center justify-center gap-1.5 border border-primary/40 text-primary hover:bg-primary/10 rounded-lg py-2 px-3 text-[10px] font-bold uppercase tracking-wider"
                        >
                          <Pencil size={12} />
                          Modifier
                        </button>
                        <span className="text-[10px] font-mono text-[#cdc3d4]/50 self-center">Prix verrouille</span>
                      </div>
                    )}

                    {/* Bloc d'Actions interactives */}
                    <div className="flex flex-col justify-between h-full">
                      <div className="flex justify-between items-center gap-3 mt-4 pt-1">
                        {product.category !== 'Voitures JDM' ? (
                          <>
                            <div className="font-extrabold text-base md:text-lg text-zinc-100 font-mono">
                              ${product.price.toLocaleString()}
                            </div>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="bg-white/10 hover:bg-white/20 text-[#e5e2e1] text-xs font-semibold px-4.5 py-2.5 rounded-lg transition-all cursor-pointer active:scale-95"
                            >
                              Ajouter au Panier
                            </button>
                          </>
                        ) : product.status === 'Enchère en Cours' ? (
                          <>
                            <div className="flex items-center space-x-1.5 text-xs text-[#ffb2bc] font-semibold animate-pulse">
                              <Timer size={14} />
                              <span>6j 23h restants</span>
                            </div>
                            <button
                              onClick={() => onSelectAuction(product)}
                              className="neon-border-btn text-xs font-bold px-6 py-2.5 rounded-lg uppercase tracking-wider cursor-pointer active:scale-95"
                            >
                              Placer une Offre
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center space-x-1.5 text-xs text-[#17deca] font-semibold">
                              <Landmark size={14} />
                              <span>Entiercement Vérifié</span>
                            </div>
                            <button
                              onClick={() => alert(`Négociation ouverte pour la ${product.model}. Une fois le backend connecté par Nicolas, cette action enverra une offre en base.`)}
                              className="bg-white/10 hover:bg-[#ffb2bc]/15 border border-white/10 hover:border-[#ffb2bc]/30 text-[#e5e2e1] text-xs font-bold px-5 py-2.5 rounded-lg uppercase tracking-wider cursor-pointer transition-all active:scale-95"
                            >
                              Négocier le Prix
                            </button>
                          </>
                        )}
                      </div>

                      {/* Bouton de suppression Admin conditionnel */}
                      {user?.role === 'admin' && (
                        <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleAdminDelete(product.id, product.model)}
                            className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-secondary hover:text-red-400 hover:bg-secondary/5 px-2.5 py-1.5 rounded transition-all cursor-pointer"
                          >
                            <X size={12} />
                            <span>Supprimer l'annonce (Admin)</span>
                          </button>
</div>
                      )}
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center glass-panel rounded-2xl border border-white/5">
                <p className="text-zinc-500 text-sm font-mono mb-2">Aucun bolide trouvé dans la base.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedBrand(null); setSelectedCategories(['Voitures JDM', 'Pièces Performance', 'Accessoires']); }}
                  className="text-[#bb86fc] text-xs font-semibold hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>

          {/* Pagination Bouton */}
          {filteredProducts.length > 0 && (
            <div className="flex justify-center pt-8">
              <button
                onClick={() => alert("Inventaire complet chargé. Gabin ajoutera la pagination lors de l'intégration finale avec Célestin.")}
                className="neon-border-btn text-xs font-bold px-8 py-3 rounded-full uppercase tracking-widest text-[#e5e2e1] hover:text-[#bb86fc] cursor-pointer active:scale-95"
              >
                Charger plus de Véhicules
              </button>
            </div>
          )}
        </section>
      </main>
      ) : (
        <AdminWorkspace
          user={user}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          users={adminUsers}
          pendingListings={pendingListings}
          products={products}
          onApproveListing={handleApproveListing}
          onRejectListing={handleRejectListing}
          onBanUser={handleBanUser}
          onDeleteUser={handleDeleteUser}
          onDeleteProduct={handleDeleteProduct}
          onOpenEdit={handleOpenEditProduct}
          onStartAdd={() => setAddingProduct(true)}
        />
      )}



      {(editingProduct || addingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => {
              setEditingProduct(null);
              setProductDraft(null);
              setAddingProduct(false);
            }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          ></div>
          <div className="glass-panel w-full max-w-2xl rounded-2xl border border-white/10 relative z-10 overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#1c1b1b]/80">
              <div className="flex items-center gap-2">
                {editingProduct ? <Pencil className="text-primary" size={18} /> : <Plus className="text-tertiary" size={18} />}
                <h3 className="font-extrabold uppercase tracking-wider text-sm">
                  {editingProduct ? "Modifier l'annonce" : 'Ajouter une vente'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductDraft(null);
                  setAddingProduct(false);
                }}
                className="text-[#cdc3d4]/60 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              {[
                ['brand', 'Marque'],
                ['model', 'Modele'],
                ['year', 'Annee'],
                ['mileage', 'Kilometrage'],
                ['chassis', 'Chassis / grade'],
                ['engine', 'Moteur'],
                ['power', 'Puissance'],
                ['category', 'Categorie'],
                ['status', 'Statut affiche'],
                ['saleType', 'Type de vente'],
                ['image', 'Image URL'],
              ].map(([field, label]) => {
                const draft = editingProduct ? productDraft : newProductDraft;
                const setDraft = editingProduct ? setProductDraft : setNewProductDraft;
                return (
                  <label key={field} className={field === 'image' ? 'md:col-span-2 space-y-2' : 'space-y-2'}>
                    <span className="text-[#cdc3d4]/50 uppercase tracking-widest">{label}</span>
                    <input
                      value={draft?.[field] ?? ''}
                      onChange={(e) => setDraft(prev => ({ ...prev, [field]: field === 'year' || field === 'mileage' ? Number(e.target.value) : e.target.value }))}
                      className="w-full bg-[#1c1b1b] border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-primary"
                    />
                  </label>
                );
              })}

              <label className="space-y-2">
                <span className="text-[#cdc3d4]/50 uppercase tracking-widest">Prix</span>
                <input
                  type="number"
                  disabled={Boolean(editingProduct)}
                  value={editingProduct ? editingProduct.price : newProductDraft.price}
                  onChange={(e) => setNewProductDraft(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="w-full bg-[#1c1b1b] border border-white/10 rounded-lg px-3 py-2.5 text-white disabled:text-[#cdc3d4]/40 disabled:cursor-not-allowed focus:outline-none focus:border-primary"
                />
                {editingProduct && <span className="text-[10px] text-secondary">Le prix ne peut pas etre modifie par un administrateur.</span>}
              </label>
            </div>

            <div className="px-6 pb-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductDraft(null);
                  setAddingProduct(false);
                }}
                className="border border-white/10 text-[#cdc3d4] rounded-lg px-4 py-2 text-xs font-bold uppercase"
              >
                Annuler
              </button>
              <button
                onClick={editingProduct ? handleSaveProductDraft : handleAddProduct}
                className="bg-primary text-[#460283] rounded-lg px-5 py-2 text-xs font-bold uppercase"
              >
                {editingProduct ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu mobile (Mobile Only) */}
      <nav className="bg-[#1c1b1b]/90 backdrop-blur-md text-[#bb86fc] fixed bottom-0 w-full z-40 rounded-t-2xl border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] flex justify-around items-center h-16 px-4 lg:hidden">
        <button
          onClick={() => { setSelectedCategories(['Voitures JDM', 'Pièces Performance', 'Accessoires']); setSelectedBrand(null); setSalesFilter('all'); }}
          className="flex flex-col items-center justify-center text-[#bb86fc] filter drop-shadow-[0_0_8px_rgba(187,134,252,0.6)] active:scale-105 transition-transform"
        >
          <Compass size={18} className="mb-0.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Boutique</span>
        </button>
        <button
          onClick={() => onNavigate('auctions_list')}
          className="flex flex-col items-center justify-center text-[#cdc3d4] hover:text-[#bb86fc] active:scale-105 transition-transform"
        >
          <Timer size={18} className="mb-0.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Enchères</span>
        </button>
        <button
          onClick={() => alert("Messagerie (Paul/Nicolas) - Bientôt en ligne")}
          className="flex flex-col items-center justify-center text-[#cdc3d4] hover:text-[#bb86fc] active:scale-105 transition-transform relative"
        >
          <MessageSquare size={18} className="mb-0.5" />
          <span className="absolute top-1 right-3.5 w-1.5 h-1.5 rounded-full bg-secondary"></span>
          <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Messagerie</span>
        </button>
        <button
          onClick={() => onLogout()}
          className="flex flex-col items-center justify-center text-[#cdc3d4] hover:text-red-400 active:scale-105 transition-transform"
          title="Se déconnecter"
        >
          <LogOut size={18} className="mb-0.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Quitter</span>
        </button>
      </nav>

      {/* Pied de page */}
      <footer className="bg-[#0e0e0e] border-t border-white/5 py-12 text-[#cdc3d4]/40 text-xs font-mono">
        <div className="max-w-[1440px] mx-auto px-4 md:px-16 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p>© 2026 Mercato Nova. Tous droits réservés.</p>
          <div className="flex space-x-6 text-[10px] uppercase">
            <span className="hover:text-white cursor-pointer">Conditions d'utilisation</span>
            <span className="hover:text-white cursor-pointer">Protection d'Entiercement</span>
            <span className="hover:text-white cursor-pointer">Statut API</span>
          </div>
          <div className="flex items-center space-x-2 text-[10px] uppercase text-[#ffb2bc]">
            <Shield size={12} />
            <span>Bouclier d'Entiercement Sécurisé du Syndicat</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;
