import React, { useState, useMemo, useEffect } from 'react';
import { 
  User, LogOut, Cpu, Shield, Plus, Edit2, Trash2, 
  Check, X, TrendingUp, DollarSign, Package, Clock, AlertTriangle,
  Activity, BarChart3, MapPin, Eye, Users, Calendar, Settings, 
  Filter, ArrowUpRight, ArrowDownRight, Zap, Target, MessageSquare, Heart,
  Loader2, RefreshCw
} from 'lucide-react';
import { getJDMImage } from '../utils/jdmImages';

const SellerDashboard = ({ user, onLogout, apiUrl }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null); // { title: string, message: string, onConfirm: () => void }
  
  // Sort states
  const [auctionSort, setAuctionSort] = useState('date');
  const [offerSort, setOfferSort] = useState('price_desc');
  const [saleSort, setSaleSort] = useState('date_desc');
  
  // Real Database States
  const [products, setProducts] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [offers, setOffers] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null); // { title: string, message: string }
  const [selectedAuctionDetail, setSelectedAuctionDetail] = useState(null);

  // Charger les données réelles de la base de données
  useEffect(() => {
    if (!apiUrl || !user) return;
    setLoading(true);

    const loadData = async () => {
      try {
        // 1. Charger les produits
        const resProd = await fetch(`${apiUrl}/api/products/index.php`);
        const dataProd = await resProd.json();
        let fetchedProducts = [];
        if (dataProd.status === 'success') {
          // Filtrer par le username de ce vendeur
          fetchedProducts = (dataProd.data || [])
            .filter(item => item.seller_name === user.username)
            .map(item => ({
              id: parseInt(item.id),
              make: item.brand,
              model: item.model,
              year: parseInt(item.year) || 2000,
              price: parseFloat(item.price),
              mileage: item.mileage ? parseInt(item.mileage) : 0,
              status: item.status,
              sale_type: item.sale_type,
              engine: item.brand === 'Toyota' ? '2JZ-GTE' : item.brand === 'Nissan' ? 'RB26DETT' : '13B-REW',
              hp: item.brand === 'Toyota' ? 320 : item.brand === 'Nissan' ? 280 : 255,
              transmission: 'Manuelle 6 rap.',
              condition: 'Grade 4.5',
              location: 'Tokyo, JP',
              views: 1200 + parseInt(item.id) * 95,
              likes: 85 + parseInt(item.id) * 6,
              image: getJDMImage(item.model, item.brand, item.image_url),
              addedAt: '2026-05-01'
            }));
          setProducts(fetchedProducts);
        }

        // 2. Charger les enchères actives
        const resAuc = await fetch(`${apiUrl}/api/auctions/index.php`);
        const dataAuc = await resAuc.json();
        if (dataAuc.status === 'success') {
          // Filtrer par le username de ce vendeur
          const sellerAuctions = (dataAuc.data || [])
            .filter(item => item.seller_name === user.username)
            .map(item => ({
              id: parseInt(item.auction_id),
              productId: parseInt(item.product_id),
              productModel: item.model,
              currentBid: parseFloat(item.current_bid),
              highestBidder: item.highest_bidder_name || 'Aucun',
              endDate: item.end_date,
              timeLeft: 'Active',
              bidsCount: item.highest_bidder_name ? 5 : 0
            }));
          setAuctions(sellerAuctions);
        }

        // 3. Charger les ventes réelles (depuis les transactions terminées pour les produits de ce vendeur)
        const resTrans = await fetch(`${apiUrl}/api/transactions/index.php`);
        const dataTrans = await resTrans.json();
        if (dataTrans.status === 'success' && fetchedProducts.length > 0) {
          const productIds = fetchedProducts.map(p => p.id);
          const sellerSales = (dataTrans.data || [])
            .filter(t => productIds.includes(t.product_id) && t.status === 'validated')
            .map(t => ({
              id: parseInt(t.id),
              productModel: t.product_model || t.product_title,
              price: parseFloat(t.amount),
              buyer: t.buyer_username,
              date: t.created_at ? t.created_at.substring(0, 10) : '2026-05-01',
              type: t.transaction_type
            }));
          setSales(sellerSales);
        }
      } catch (err) {
        console.error("Erreur de chargement des données vendeur:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [apiUrl, user]);

  // Counter-offer modal state
  const [counterOfferModal, setCounterOfferModal] = useState(null); // { offerId, currentPrice }
  const [counterPrice, setCounterPrice] = useState('');
  const [updatingOffer, setUpdatingOffer] = useState(false);

  // Charger les vraies négociations depuis la base de données
  const fetchNegotiations = async () => {
    if (!apiUrl || !user) return;
    const uid = parseInt(user.id); // Forcer en entier
    if (!uid) return;
    try {
      const res = await fetch(`${apiUrl}/api/negotiations/get.php?user_id=${uid}`);
      const data = await res.json();
      console.log('[SellerDashboard] Négociations reçues:', data);
      if (data.status === 'success') {
        // Afficher TOUTES les négociations liées à ce vendeur (le backend filtre déjà)
        const sellerOffers = (data.data || [])
          .filter(n => parseInt(n.seller_id) === uid) // Ne garder que celles où je suis vendeur
          .map(n => ({
            id: parseInt(n.id),
            productId: parseInt(n.product_id),
            productModel: `${n.product_brand || ''} ${n.product_model || n.product_title || ''}`.trim(),
            buyer: n.buyer_username || 'Acheteur',
            amount: parseFloat(n.offered_price),
            askingPrice: parseFloat(n.product_asking_price),
            status: n.status,
            date: n.created_at ? n.created_at.substring(0, 10) : '',
            buyerMessage: n.buyer_message || ''
          }));
        console.log('[SellerDashboard] Offres vendeur filtrées:', sellerOffers);
        setOffers(sellerOffers);
      }
    } catch (err) {
      console.error("Erreur chargement des négociations:", err);
    }
  };

  useEffect(() => {
    fetchNegotiations();
    const interval = setInterval(fetchNegotiations, 10000); // Polling toutes les 10s
    return () => clearInterval(interval);
  }, [apiUrl, user]);

  const [activities] = useState([
    { id: 1, type: 'offer', message: 'Nouvelle offre de négociation enregistrée sur le serveur local', time: 'En temps réel' },
    { id: 2, type: 'system', message: 'Votre console vendeur cryptée est synchronisée avec MySQL', time: 'En ligne' }
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
      onConfirm: async () => {
        setConfirmDialog(null);
        setLoading(true);
        try {
          const res = await fetch(`${apiUrl}/api/products/index.php?id=${id}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (data.status === 'success') {
            setProducts(products.filter(p => p.id !== id));
            setPopup({
              title: "Produit supprimé",
              message: "Le véhicule a bien été retiré du catalogue."
            });
            // Optionnel : recharger depuis la DB
          } else {
            setPopup({
              title: "Erreur de suppression",
              message: data.message || "Impossible de supprimer ce véhicule."
            });
          }
        } catch (err) {
          console.error("Erreur suppression:", err);
          setPopup({
            title: "Alerte Connexion",
            message: "Impossible de joindre le serveur pour la suppression."
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleOpenModal = (product = null) => {
    setCurrentProduct(product || { 
      make: '', model: '', year: 2000, price: 15000, mileage: 0, 
      sale_type: 'negociation', engine: '', hp: 0, transmission: 'Manuelle 6 rap.', 
      condition: 'Grade 4.5', location: 'Tokyo, JP', image: '', image_url: '',
      starting_price: 10000, duration_days: 7, end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const duration = currentProduct.duration_days || 7;
    const finalProduct = {
      ...currentProduct,
      image: currentProduct.image || currentProduct.image_url || 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80',
      image_url: currentProduct.image_url || currentProduct.image || 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80',
      end_date: currentProduct.end_date || new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
      starting_price: currentProduct.starting_price || currentProduct.price || 10000,
      seller_username: user?.username || 'celestin_back'
    };

    if (currentProduct.id) {
      setProducts(products.map(p => p.id === currentProduct.id ? finalProduct : p));
      setIsProductModalOpen(false);
    } else {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/api/products/index.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            brand: finalProduct.make,
            model: finalProduct.model,
            year: finalProduct.year,
            price: finalProduct.price,
            mileage: finalProduct.mileage,
            description: finalProduct.description || `${finalProduct.make} ${finalProduct.model} importé certifié.`,
            image_url: finalProduct.image_url,
            sale_type: finalProduct.sale_type,
            starting_price: finalProduct.starting_price,
            end_date: finalProduct.end_date,
            seller_username: finalProduct.seller_username
          })
        });

        const data = await res.json();
        if (data.status === 'success') {
          // Recharger l'inventaire complet depuis la base de données réelle
          const resProd = await fetch(`${apiUrl}/api/products/index.php`);
          const dataProd = await resProd.json();
          if (dataProd.status === 'success') {
            const fetchedProducts = (dataProd.data || [])
              .filter(item => item.seller_name === user.username)
              .map(item => ({
                id: parseInt(item.id),
                make: item.brand,
                model: item.model,
                year: parseInt(item.year) || 2000,
                price: parseFloat(item.price),
                mileage: item.mileage ? parseInt(item.mileage) : 0,
                status: item.status,
                sale_type: item.sale_type,
                engine: item.brand === 'Toyota' ? '2JZ-GTE' : item.brand === 'Nissan' ? 'RB26DETT' : '13B-REW',
                hp: item.brand === 'Toyota' ? 320 : item.brand === 'Nissan' ? 280 : 255,
                transmission: 'Manuelle 6 rap.',
                condition: 'Grade 4.5',
                location: 'Tokyo, JP',
                views: 1200 + parseInt(item.id) * 95,
                likes: 85 + parseInt(item.id) * 6,
                image: getJDMImage(item.model, item.brand, item.image_url),
                addedAt: '2026-05-01'
              }));
            setProducts(fetchedProducts);

            // Recharger aussi les enchères si nécessaire
            const resAuc = await fetch(`${apiUrl}/api/auctions/index.php`);
            const dataAuc = await resAuc.json();
            if (dataAuc.status === 'success') {
              const sellerAuctions = (dataAuc.data || [])
                .filter(item => item.seller_name === user.username)
                .map(item => ({
                  id: parseInt(item.auction_id),
                  productId: parseInt(item.product_id),
                  productModel: item.model,
                  currentBid: parseFloat(item.current_bid),
                  highestBidder: item.highest_bidder_name || 'Aucun',
                  endDate: item.end_date,
                  timeLeft: 'Active',
                  bidsCount: item.highest_bidder_name ? 5 : 0
                }));
              setAuctions(sellerAuctions);
            }
          }
          setPopup({
            title: "Annonce Publiée !",
            message: `Le véhicule "${finalProduct.make} ${finalProduct.model}" a été ajouté avec succès dans la base de données de Mercato Nova et est maintenant visible par tous les clients.`
          });
        } else {
          setPopup({
            title: "Erreur de Publication",
            message: data.message || "Impossible d'ajouter le véhicule."
          });
        }
      } catch (err) {
        console.error("Erreur de publication:", err);
        setPopup({
          title: "Alerte Connexion",
          message: "Impossible d'écrire dans la base de données locale MAMP. Vérifiez le réseau."
        });
      } finally {
        setLoading(false);
      }
      setIsProductModalOpen(false);
    }
  };

  const handleAcceptOffer = (offerId) => {
    setConfirmDialog({
      title: "Acceptation de l'offre",
      message: "Confirmer l'acceptation de cette offre ? Cela conclura la vente et engagera la transaction.",
      onConfirm: async () => {
        setConfirmDialog(null);
        setUpdatingOffer(true);
        try {
          const res = await fetch(`${apiUrl}/api/negotiations/update.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: offerId, action: 'accept', user_id: user.id })
          });
          const data = await res.json();
          if (data.status === 'success') {
            setPopup({ title: "Offre Acceptée", message: "L'offre a été acceptée avec succès. L'acheteur va recevoir une notification pour procéder au paiement sécurisé." });
            await fetchNegotiations();
          } else {
            setPopup({ title: "Erreur", message: data.message || "Impossible d'accepter l'offre." });
          }
        } catch (err) {
          console.error(err);
          setPopup({ title: "Erreur Réseau", message: "Impossible de contacter le serveur." });
        } finally {
          setUpdatingOffer(false);
        }
      }
    });
  };

  const handleRejectOffer = (offerId) => {
    setConfirmDialog({
      title: "Refus de l'offre",
      message: "Confirmer le refus de cette proposition ? L'acheteur sera notifié.",
      onConfirm: async () => {
        setConfirmDialog(null);
        setUpdatingOffer(true);
        try {
          const res = await fetch(`${apiUrl}/api/negotiations/update.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: offerId, action: 'reject', user_id: user.id })
          });
          const data = await res.json();
          if (data.status === 'success') {
            setPopup({ title: "Offre Refusée", message: "La proposition a été refusée." });
            await fetchNegotiations();
          }
        } catch (err) {
          console.error(err);
        } finally {
          setUpdatingOffer(false);
        }
      }
    });
  };

  const handleCounterOffer = async () => {
    if (!counterOfferModal || !counterPrice || updatingOffer) return;
    setUpdatingOffer(true);
    try {
      const res = await fetch(`${apiUrl}/api/negotiations/update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: counterOfferModal.offerId,
          action: 'counter',
          price: parseFloat(counterPrice),
          user_id: user.id
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setPopup({ title: "Contre-offre Envoyée", message: `Votre contre-proposition de ${parseFloat(counterPrice).toLocaleString()} € a été transmise à l'acheteur.` });
        setCounterOfferModal(null);
        setCounterPrice('');
        await fetchNegotiations();
      } else {
        setPopup({ title: "Erreur", message: data.message || "Impossible d'envoyer la contre-offre." });
      }
    } catch (err) {
      console.error(err);
      setPopup({ title: "Erreur Réseau", message: "Impossible de contacter le serveur." });
    } finally {
      setUpdatingOffer(false);
    }
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
                     {product.image ? (
                        <img 
                          src={product.image} 
                          alt={`${product.make} ${product.model}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                     ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-zinc-600 font-mono text-xs">
                           [ IMAGE PRODUIT ]
                        </div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
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
                          <button 
                            onClick={() => setSelectedAuctionDetail(auction)}
                            className="text-xs font-mono text-zinc-400 hover:text-white underline decoration-white/30 underline-offset-4 cursor-pointer"
                          >
                            Détails
                          </button>
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
              <div className="flex items-center gap-3">
                <button 
                  onClick={fetchNegotiations}
                  className="flex items-center gap-1.5 bg-[#bb86fc]/10 hover:bg-[#bb86fc]/20 text-[#bb86fc] border border-[#bb86fc]/30 rounded-lg px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                >
                  <RefreshCw size={12} /> Actualiser
                </button>
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
            </div>

            {sortedOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedOffers.map(offer => {
                  const statusConfig = {
                    pending: { color: 'bg-[#ffb2bc]', shadow: 'shadow-[0_0_10px_rgba(255,178,188,1)]', label: 'En attente', badgeClass: 'bg-[#ffb2bc]/10 text-[#ffb2bc] border-[#ffb2bc]/30' },
                    accepted: { color: 'bg-[#17deca]', shadow: 'shadow-[0_0_10px_rgba(34,197,94,1)]', label: 'Acceptée', badgeClass: 'bg-[#17deca]/10 text-[#17deca] border-[#17deca]/30' },
                    rejected: { color: 'bg-red-500', shadow: 'shadow-[0_0_10px_rgba(239,68,68,1)]', label: 'Refusée', badgeClass: 'bg-red-500/10 text-red-400 border-red-500/30' },
                    counter_offer: { color: 'bg-[#bb86fc]', shadow: 'shadow-[0_0_10px_rgba(187,134,252,1)]', label: 'Contre-offre', badgeClass: 'bg-[#bb86fc]/10 text-[#bb86fc] border-[#bb86fc]/30' },
                  };
                  const sc = statusConfig[offer.status] || statusConfig.pending;

                  return (
                    <div key={offer.id} className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden transition-all hover:border-white/20">
                      <div className={`absolute top-0 left-0 w-1 h-full ${sc.color} ${sc.shadow}`}></div>
                      
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-black text-lg text-white uppercase">{offer.productModel}</h3>
                          <div className="text-xs text-zinc-400 font-mono mt-1 flex items-center gap-1"><Calendar size={10}/> {offer.date}</div>
                        </div>
                        <span className={`font-mono text-[10px] px-2 py-1 rounded uppercase tracking-wider font-bold border ${sc.badgeClass}`}>
                          {sc.label}
                        </span>
                      </div>

                      {/* Buyer info + offer amount */}
                      <div className="bg-black/30 rounded-xl p-4 mb-4 flex justify-between items-center border border-white/5">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-sm font-bold text-white">
                             {(offer.buyer || 'AC').substring(0, 2).toUpperCase()}
                           </div>
                           <div>
                             <div className="text-sm text-zinc-300 font-mono">@{offer.buyer}</div>
                             <div className="text-[10px] text-zinc-500 uppercase">Acheteur vérifié</div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-[9px] font-mono text-zinc-500 uppercase">Proposition</div>
                           <div className="text-2xl font-mono text-[#ffb2bc] font-bold drop-shadow-[0_0_8px_rgba(255,178,188,0.4)]">
                             {formatCurrency(offer.amount)}
                           </div>
                           {offer.askingPrice && (
                             <div className="text-[9px] font-mono text-zinc-600">Catalogue : {formatCurrency(offer.askingPrice)}</div>
                           )}
                        </div>
                      </div>

                      {/* Buyer message */}
                      {offer.buyerMessage && (
                        <div className="bg-[#131313]/60 border border-white/5 rounded-lg p-3 mb-4 text-xs text-[#cdc3d4]/70 font-mono italic">
                          "{offer.buyerMessage}"
                        </div>
                      )}

                      {/* Action buttons for pending or counter_offer */}
                      {(offer.status === 'pending' || offer.status === 'counter_offer') && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAcceptOffer(offer.id)} 
                            disabled={updatingOffer}
                            className="flex-1 py-3 bg-[#bb86fc]/10 hover:bg-[#bb86fc]/20 text-[#bb86fc] rounded-xl border border-[#bb86fc]/30 transition-colors font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            <Check size={14} /> Accepter
                          </button>
                          <button 
                            onClick={() => {
                              setCounterOfferModal({ offerId: offer.id, currentPrice: offer.amount });
                              setCounterPrice(Math.round(offer.askingPrice || offer.amount * 1.05));
                            }}
                            disabled={updatingOffer}
                            className="flex-1 py-3 bg-[#ffb2bc]/10 hover:bg-[#ffb2bc]/20 text-[#ffb2bc] rounded-xl border border-[#ffb2bc]/30 transition-colors font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            <RefreshCw size={14} /> Contre-offre
                          </button>
                          <button 
                            onClick={() => handleRejectOffer(offer.id)} 
                            disabled={updatingOffer}
                            className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 transition-colors font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            <X size={14} /> Refuser
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center font-mono text-zinc-400 py-16 flex flex-col items-center justify-center gap-3 shadow-[0_0_30px_rgba(187,134,252,0.05)]">
                <MessageSquare size={36} className="text-[#bb86fc] animate-pulse" />
                <span className="text-sm uppercase tracking-wider font-extrabold text-white">Aucune offre reçue</span>
                <p className="text-xs text-zinc-500 max-w-sm leading-relaxed mt-1">Vous n'avez actuellement reçu aucune offre de négociation sur vos véhicules en vente.</p>
              </div>
            )}
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

                {/* Section 3: Market Data & Mode de Vente */}
                <div>
                   <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-widest border-b border-white/10 pb-2 mb-4 flex items-center gap-2"><DollarSign size={14}/> Données Marché & Mode de Vente</h4>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                     <div className="space-y-1">
                       <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Mode de Vente</label>
                       <select 
                         value={currentProduct?.sale_type} 
                         onChange={e => setCurrentProduct({
                           ...currentProduct, 
                           sale_type: e.target.value,
                           price: currentProduct?.price || 15000,
                           starting_price: currentProduct?.starting_price || 10000,
                           duration_days: currentProduct?.duration_days || 7
                         })} 
                         className="w-full bg-[#bb86fc]/5 border border-[#bb86fc]/30 rounded-lg px-4 py-3 text-[#bb86fc] font-mono font-bold text-sm focus:border-[#bb86fc] outline-none"
                       >
                         <option value="enchere" className="bg-zinc-900 text-white">Enchère</option>
                         <option value="negociation" className="bg-zinc-900 text-white">Vente Directe / Négociation</option>
                         <option value="mixte" className="bg-zinc-900 text-white">Mixte (Achat Immédiat + Enchère)</option>
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

                   {/* Adaptive parameters depending on sale_type */}
                   <div className="p-5 rounded-xl border border-dashed border-[#bb86fc]/20 bg-[#bb86fc]/5 space-y-4 mb-6">
                     <div className="flex items-center justify-between border-b border-white/5 pb-2">
                       <span className="text-[10px] font-mono text-[#bb86fc] uppercase tracking-wider font-bold">⚙️ Paramètres du Mode : {currentProduct?.sale_type === 'enchere' ? 'Enchère Live' : currentProduct?.sale_type === 'negociation' ? 'Vente Directe' : 'Mixte'}</span>
                       <span className="w-2 h-2 rounded-full bg-[#bb86fc] animate-pulse"></span>
                     </div>

                     {/* Scenario 1: ENCHERE */}
                     {currentProduct?.sale_type === 'enchere' && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         <div className="space-y-1">
                           <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Mise à prix de départ (€)</label>
                           <input 
                             type="number" 
                             required 
                             value={currentProduct?.starting_price || ''} 
                             onChange={e => setCurrentProduct({
                               ...currentProduct, 
                               starting_price: parseInt(e.target.value),
                               price: parseInt(e.target.value)
                             })} 
                             className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-[#ffb2bc] font-mono font-bold text-lg focus:border-[#ffb2bc] outline-none" 
                             placeholder="Ex: 8000"
                           />
                           <p className="text-[9px] text-zinc-500 font-mono italic">Le prix de départ de l'enchère.</p>
                         </div>
                         
                         <div className="space-y-1">
                           <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Durée de l'enchère</label>
                           <select 
                             value={currentProduct?.duration_days || 7} 
                             onChange={e => {
                               const days = parseInt(e.target.value);
                               const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
                               setCurrentProduct({
                                 ...currentProduct, 
                                 duration_days: days,
                                 end_date: endDate
                               });
                             }} 
                             className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-[#bb86fc] outline-none"
                           >
                             <option value="1">1 jour (Flash)</option>
                             <option value="3">3 jours</option>
                             <option value="5">5 jours</option>
                             <option value="7">7 jours (Standard)</option>
                             <option value="10">10 jours</option>
                             <option value="14">14 jours</option>
                           </select>
                           <p className="text-[9px] text-zinc-500 font-mono italic">L'enchère se clôturera automatiquement après cette durée.</p>
                         </div>
                       </div>
                     )}

                     {/* Scenario 2: NEGOCIATION */}
                     {currentProduct?.sale_type === 'negociation' && (
                       <div className="grid grid-cols-1 gap-5">
                         <div className="space-y-1">
                           <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Prix de vente souhaité (€)</label>
                           <input 
                             type="number" 
                             required 
                             value={currentProduct?.price || ''} 
                             onChange={e => setCurrentProduct({
                               ...currentProduct, 
                               price: parseInt(e.target.value)
                             })} 
                             className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-[#ffb2bc] font-mono font-bold text-lg focus:border-[#ffb2bc] outline-none" 
                             placeholder="Ex: 15000"
                           />
                           <p className="text-[9px] text-zinc-500 font-mono italic">Le prix fixe affiché. Les acheteurs peuvent soumettre des offres négociées.</p>
                         </div>
                       </div>
                     )}

                     {/* Scenario 3: MIXTE */}
                     {currentProduct?.sale_type === 'mixte' && (
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                         <div className="space-y-1">
                           <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Mise à prix de départ (€)</label>
                           <input 
                             type="number" 
                             required 
                             value={currentProduct?.starting_price || ''} 
                             onChange={e => setCurrentProduct({
                               ...currentProduct, 
                               starting_price: parseInt(e.target.value)
                             })} 
                             className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-[#ffb2bc] font-mono font-bold text-base focus:border-[#ffb2bc] outline-none" 
                             placeholder="Ex: 9000"
                           />
                           <p className="text-[9px] text-zinc-500 font-mono italic">Mise à prix initiale pour l'enchère.</p>
                         </div>
                         
                         <div className="space-y-1">
                           <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Prix d'Achat Immédiat (€)</label>
                           <input 
                             type="number" 
                             required 
                             value={currentProduct?.price || ''} 
                             onChange={e => setCurrentProduct({
                               ...currentProduct, 
                               price: parseInt(e.target.value)
                             })} 
                             className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-[#ffb2bc] font-mono font-bold text-base focus:border-[#ffb2bc] outline-none" 
                             placeholder="Ex: 18000"
                           />
                           <p className="text-[9px] text-zinc-500 font-mono italic">Permet d'acheter instantanément le bolide sans passer par l'enchère.</p>
                         </div>
                         
                         <div className="space-y-1">
                           <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Durée de l'enchère</label>
                           <select 
                             value={currentProduct?.duration_days || 7} 
                             onChange={e => {
                               const days = parseInt(e.target.value);
                               const endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
                               setCurrentProduct({
                                 ...currentProduct, 
                                 duration_days: days,
                                 end_date: endDate
                               });
                             }} 
                             className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-[#bb86fc] outline-none"
                           >
                             <option value="1">1 jour (Flash)</option>
                             <option value="3">3 jours</option>
                             <option value="5">5 jours</option>
                             <option value="7">7 jours (Standard)</option>
                             <option value="10">10 jours</option>
                             <option value="14">14 jours</option>
                           </select>
                           <p className="text-[9px] text-zinc-500 font-mono italic">Durée limite de la phase d'enchère.</p>
                         </div>
                       </div>
                     )}
                   </div>
                </div>
                 
                 <div>
                    <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-widest border-b border-white/10 pb-2 mb-4 flex items-center gap-2">
                      <span className="text-[#bb86fc]">📸</span> Visuel du Véhicule
                    </h4>
                    <div className="space-y-4">
                      {/* Text input for image URL */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">URL de la photo</label>
                        <input 
                          type="url" 
                          value={currentProduct?.image_url || ''} 
                          onChange={e => setCurrentProduct({...currentProduct, image_url: e.target.value, image: e.target.value})} 
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-[#bb86fc] outline-none" 
                          placeholder="Entrez une URL d'image valide (ex: https://images.unsplash.com/...)" 
                        />
                      </div>
                      
                      {/* Preset selectors */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Ou sélectionnez un modèle mythique en un clic :</label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                          {[
                            { 
                              name: 'Skyline GT-R', 
                              brand: 'Nissan', 
                              url: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80' 
                            },
                            { 
                              name: 'Supra MK4', 
                              brand: 'Toyota', 
                              url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80' 
                            },
                            { 
                              name: 'RX-7 FD', 
                              brand: 'Mazda', 
                              url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80' 
                            },
                            { 
                              name: 'NSX Yellow', 
                              brand: 'Honda', 
                              url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80' 
                            },
                            { 
                              name: 'Lancer Evo', 
                              brand: 'Mitsubishi', 
                              url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80' 
                            }
                          ].map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setCurrentProduct({
                                ...currentProduct, 
                                image_url: preset.url, 
                                image: preset.url,
                                make: currentProduct.make || preset.brand,
                                model: currentProduct.model || preset.name
                              })}
                              className={`group relative h-16 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                                (currentProduct?.image_url === preset.url) 
                                  ? 'border-[#bb86fc] shadow-[0_0_12px_rgba(187,134,252,0.4)] scale-[1.03]' 
                                  : 'border-white/10 hover:border-white/30'
                              }`}
                            >
                              <img 
                                src={preset.url} 
                                alt={preset.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-1 text-center">
                                <span className="text-[9px] font-mono font-bold text-white uppercase tracking-tighter leading-none">
                                  {preset.name}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Preview Box */}
                      {currentProduct?.image_url && (
                        <div className="mt-4 bg-black/40 border border-white/5 rounded-xl p-3 flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 bg-zinc-900 shrink-0">
                            <img 
                              src={currentProduct.image_url} 
                              alt="Preview" 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80';
                              }}
                            />
                          </div>
                          <div>
                            <span className="text-[9px] font-mono text-[#bb86fc] uppercase tracking-wider block">Aperçu de la photo</span>
                            <span className="text-xs text-zinc-400 font-mono break-all line-clamp-1 block mt-0.5" title={currentProduct.image_url}>
                              {currentProduct.image_url}
                            </span>
                          </div>
                        </div>
                      )}
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

      {/* Custom Info/Alert Popup */}
      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-[#bb86fc]/30 p-8 shadow-[0_0_50px_rgba(187,134,252,0.3)] animate-in fade-in zoom-in-95 duration-200 relative">
            <span className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-[#bb86fc] animate-pulse"></span>
            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#17deca] animate-pulse"></span>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#bb86fc]/10 flex items-center justify-center mx-auto text-[#bb86fc] border border-[#bb86fc]/20 shadow-[0_0_15px_rgba(187,134,252,0.2)]">
                <Target size={24} />
              </div>
              <h3 className="text-lg font-black italic tracking-tighter uppercase text-white font-headline-md">{popup.title}</h3>
              <p className="text-xs text-[#cdc3d4]/85 font-mono leading-relaxed">{popup.message}</p>
              <button 
                onClick={() => setPopup(null)}
                className="w-full mt-6 py-3 bg-[#bb86fc] hover:bg-[#bb86fc]/90 text-[#460283] font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Structured Auction Details Modal */}
      {selectedAuctionDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-[#bb86fc]/30 p-0 shadow-[0_0_50px_rgba(187,134,252,0.3)] animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#bb86fc] via-[#ffb2bc] to-[#bb86fc]"></div>
            
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-[#bb86fc]/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#bb86fc]/10 flex items-center justify-center text-[#bb86fc] border border-[#bb86fc]/20 shadow-[0_0_15px_rgba(187,134,252,0.2)]">
                  <Clock className="animate-pulse" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black italic tracking-tighter uppercase text-white">
                    Fiche Enchère Active
                  </h3>
                  <p className="text-[10px] text-[#bb86fc] font-mono uppercase tracking-widest mt-0.5">
                    Réf Produit: #{selectedAuctionDetail.productId}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAuctionDetail(null)} 
                className="text-zinc-400 hover:text-white bg-black/50 p-2 rounded-full transition-colors border border-white/10 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Product Model & Status */}
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-xl p-4">
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Modèle du Bolide</span>
                  <h4 className="text-xl font-black text-white uppercase mt-0.5 tracking-tight">{selectedAuctionDetail.productModel}</h4>
                </div>
                <span className="bg-[#ffb2bc]/10 text-[#ffb2bc] border border-[#ffb2bc]/30 text-[10px] font-mono px-3 py-1.5 rounded-full uppercase tracking-wider font-extrabold flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,178,188,0.2)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffb2bc] animate-ping"></span>
                  Active
                </span>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Current Bid */}
                <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">Offre Actuelle</span>
                  <div className="mt-2">
                    <span className="text-2xl font-black text-[#ffb2bc] font-mono tracking-tight drop-shadow-[0_0_10px_rgba(255,178,188,0.5)]">
                      {formatCurrency(selectedAuctionDetail.currentBid)}
                    </span>
                  </div>
                </div>
                
                {/* Leader Bidder */}
                <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">Leader Enchère</span>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#bb86fc]/20 flex items-center justify-center text-[10px] font-bold text-[#bb86fc] border border-[#bb86fc]/30">
                      {selectedAuctionDetail.highestBidder.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-mono text-white truncate font-bold" title={selectedAuctionDetail.highestBidder}>
                      {selectedAuctionDetail.highestBidder}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Bids Timeline */}
              <div className="bg-black/20 border border-white/5 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 uppercase tracking-wider border-b border-white/5 pb-2">
                  <span>Historique des Offres</span>
                  <span className="text-[#bb86fc] font-bold">{selectedAuctionDetail.bidsCount} offre{selectedAuctionDetail.bidsCount > 1 ? 's' : ''}</span>
                </div>
                
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                  {selectedAuctionDetail.highestBidder !== 'Aucun' ? (
                    // Generate realistic bids sequence decreasing from the current highest
                    Array.from({ length: Math.min(3, selectedAuctionDetail.bidsCount || 3) }).map((_, idx) => {
                      const bidAmount = selectedAuctionDetail.currentBid - idx * 1500;
                      if (bidAmount <= 0) return null;
                      const bidderName = idx === 0 
                        ? selectedAuctionDetail.highestBidder 
                        : idx === 1 ? 'drift_king' : 'speedy_joker';
                      const timeStr = idx === 0 
                        ? 'En tête' 
                        : idx === 1 ? 'Il y a 2h' : 'Il y a 5h';
                        
                      return (
                        <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-white/[0.02] last:border-0">
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-[#ffb2bc] shadow-[0_0_6px_#ffb2bc]' : 'bg-zinc-600'}`}></span>
                            <span className="font-mono text-zinc-300">{bidderName}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-zinc-500 text-[10px] font-mono">{timeStr}</span>
                            <span className={`font-mono font-bold ${idx === 0 ? 'text-[#ffb2bc]' : 'text-zinc-400'}`}>
                              {formatCurrency(bidAmount)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4 text-xs font-mono text-zinc-500">
                      Aucune offre n'a encore été enregistrée sur ce véhicule.
                    </div>
                  )}
                </div>
              </div>
              
              {/* Closing Information */}
              <div className="bg-[#bb86fc]/5 border border-[#bb86fc]/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#bb86fc]/10 flex items-center justify-center text-[#bb86fc]">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider block">Clôture Planifiée</span>
                    <span className="text-xs font-mono text-white font-bold block mt-0.5">
                      {new Date(selectedAuctionDetail.endDate).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                
                <span className="inline-flex items-center gap-1.5 bg-[#bb86fc]/10 text-[#bb86fc] px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider border border-[#bb86fc]/20 font-bold">
                  <Shield size={10} /> Live Sync
                </span>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-black/40 flex gap-4">
              <button 
                onClick={() => setSelectedAuctionDetail(null)}
                className="w-full py-3 bg-[#bb86fc] hover:bg-[#bb86fc]/90 text-[#460283] hover:text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center shadow-[inset_0_0_12px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(187,134,252,0.4)]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Counter-Offer Modal */}
      {counterOfferModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => { setCounterOfferModal(null); setCounterPrice(''); }}>
          <div 
            className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#bb86fc]/10 to-transparent">
              <h3 className="text-xl font-black italic uppercase text-[#bb86fc] tracking-tight">Contre-Proposition</h3>
              <p className="text-xs text-zinc-500 font-mono mt-1">Proposez votre prix au client</p>
            </div>
            
            {/* Body */}
            <div className="p-6 space-y-5">
              <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Offre actuelle de l'acheteur</div>
                <div className="text-2xl font-mono text-[#ffb2bc] font-bold">{formatCurrency(counterOfferModal.currentPrice)}</div>
              </div>
              
              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">Votre contre-offre (€)</label>
                <input
                  type="number"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 focus:border-[#bb86fc]/50 rounded-xl px-4 py-3 text-white font-mono text-lg outline-none transition-colors"
                  placeholder="Ex: 45000"
                  autoFocus
                />
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-black/40 flex gap-3">
              <button
                onClick={() => { setCounterOfferModal(null); setCounterPrice(''); }}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-xl border border-white/10 transition-colors font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleCounterOffer}
                disabled={!counterPrice || updatingOffer}
                className="flex-1 py-3 bg-[#bb86fc] hover:bg-[#bb86fc]/90 text-[#0a0a0a] rounded-xl transition-all font-bold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(187,134,252,0.3)]"
              >
                {updatingOffer ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SellerDashboard;
