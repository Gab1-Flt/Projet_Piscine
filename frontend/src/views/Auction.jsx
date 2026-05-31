import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Timer, Zap, Check, X, Shield, Info,
  MessageSquare, User, Award, TrendingUp, Coins, Gavel, RotateCcw, Sparkles, AlertTriangle
} from 'lucide-react';
import { getJDMImage } from '../utils/jdmImages';

function Auction({ user, product, onBack, onLogout, onNavigate, apiUrl }) {
  // Produit de repli si aucun n'est passé en prop
  const currentProduct = product || {
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
  };

  // États principaux
  const [currentPrice, setCurrentPrice] = useState(currentProduct.price);
  const [timeLeft, setTimeLeft] = useState(currentProduct.timeLeft || 45); // Compte à rebours initial de 45 secondes pour des tests rapides
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [highestBidder, setHighestBidder] = useState('drift_king');
  const [bidAmountInput, setBidAmountInput] = useState((currentProduct.price + 1000).toString());

  // Liste des enchères en direct
  const [bids, setBids] = useState([
    { bidder: 'drift_king', amount: currentProduct.price, time: 'Il y a 2 min', avatar: 'DK', isOpponent: true },
    { bidder: 'keiichi_tsuchiya', amount: currentProduct.price - 5000, time: 'Il y a 10 min', avatar: 'KT', isOpponent: true },
    { bidder: 'takumi_86', amount: currentProduct.price - 10000, time: 'Il y a 2 heures', avatar: 'T8', isOpponent: true }
  ]);

  // États pour les notifications de simulation
  const [opponentNotification, setOpponentNotification] = useState(null);
  const [snipingAlert, setSnipingAlert] = useState(false);
  const [userNotification, setUserNotification] = useState(null);
  const [popup, setPopup] = useState(null); // { title: string, message: string, type: string }

  // Mettre à jour l'input d'offre à chaque changement de prix actuel
  useEffect(() => {
    setBidAmountInput((currentPrice + 1000).toString());
  }, [currentPrice]);

  // Gérer le compte à rebours de l'enchère
  useEffect(() => {
    if (isCompleted || timeLeft <= 0) {
      if (timeLeft <= 0 && !isCompleted) {
        setIsCompleted(true);
        setHasWon(highestBidder === 'Vous');
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          setHasWon(highestBidder === 'Vous');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isCompleted, highestBidder]);

  // Helper pour formater le compte à rebours
  const formatTime = (seconds) => {
    if (seconds <= 0) return "00:00:00";
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Helper pour appliquer l'offre et la règle anti-sniping
  const applyBid = (bidderName, amount, avatar, isOpponent) => {
    setCurrentPrice(amount);
    setHighestBidder(bidderName);
    setBids(prev => [
      { bidder: bidderName, amount: amount, time: 'À l\'instant', avatar: avatar, isOpponent: isOpponent },
      ...prev
    ]);

    // Règle Anti-Sniping : prolonge à 10s s'il reste moins de 10s
    if (timeLeft < 10 && timeLeft > 0) {
      setTimeLeft(10);
      setSnipingAlert(true);
      setTimeout(() => setSnipingAlert(false), 2000);
    }
  };

  // Simulation d'opposants en arrière-plan
  useEffect(() => {
    // Ne surenchérit que si l'utilisateur est en tête, l'enchère est en cours et il reste du temps
    if (highestBidder !== 'Vous' || isCompleted || timeLeft <= 0) return;

    // Déclencher une offre d'opposant après 3 à 6 secondes
    const randomDelay = (Math.floor(Math.random() * 4) + 3) * 1000;

    const opponentTimer = setTimeout(() => {
      const pilots = [
        { name: 'takumi_86', avatar: 'T8' },
        { name: 'keiichi_tsuchiya', avatar: 'KT' },
        { name: 'drift_king', avatar: 'DK' },
        { name: 'ryosuke_fc', avatar: 'RF' },
        { name: 'mako_sileighty', avatar: 'MS' }
      ];

      // Choisir un pilote différent de "Vous" au hasard
      const pilot = pilots[Math.floor(Math.random() * pilots.length)];
      
      // Incrément d'offre aléatoire entre $1500 et $5000 (par pas de $500)
      const increment = (Math.floor(Math.random() * 8) + 3) * 500;
      const newPrice = currentPrice + increment;

      applyBid(pilot.name, newPrice, pilot.avatar, true);

      // Notification néon JDM
      setOpponentNotification({
        pilot: pilot.name,
        amount: newPrice,
        text: `Le pilote underground ${pilot.name} vient de réenchérir à ${newPrice.toLocaleString()} € !`
      });

      // Cacher la notification après 3.5 secondes
      setTimeout(() => {
        setOpponentNotification(null);
      }, 3500);

    }, randomDelay);

    return () => clearTimeout(opponentTimer);
  }, [highestBidder, currentPrice, isCompleted, timeLeft]);

  // Placer une offre manuellement (Utilisateur)
  const handleUserBidSubmit = async (e) => {
    e.preventDefault();
    const bidAmount = parseInt(bidAmountInput);
    if (isNaN(bidAmount) || bidAmount <= currentPrice) {
      setPopup({
        title: "Offre Non Valide",
        message: `Votre offre doit être strictement supérieure à l'offre actuelle (${currentPrice.toLocaleString()} €)`,
        type: "warning"
      });
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/auctions/bid.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          auction_id: currentProduct.auctionId || 1, // Fallback to 1
          buyer_id: user?.id || 5, // Fallback to Takumi Fujiwara in SQL seeds
          amount: bidAmount
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        applyBid('Vous', data.data.current_bid, 'VO', false);
        
        // Règle Anti-Sniping : prolonge à 60s si le serveur signale une prolongation
        if (data.data.sniping_extended) {
          setTimeLeft(60);
          setSnipingAlert(true);
          setTimeout(() => setSnipingAlert(false), 2000);
        }

        // Déclencher une petite notification de succès pour l'utilisateur
        setUserNotification("Votre offre a été placée en tête du réseau et enregistrée dans la base de données !");
        setTimeout(() => setUserNotification(null), 2500);
      } else {
        setPopup({
          title: "Offre Rejetée",
          message: data.message || "Impossible de soumettre votre offre.",
          type: "warning"
        });
      }
    } catch (err) {
      console.error(err);
      setPopup({
        title: "Alerte Réseau JDM",
        message: "Impossible d'enregistrer l'offre sur le serveur local MAMP. Connexion refusée.",
        type: "warning"
      });
    }
  };

  // Simuler la fin de l'enchère (Accélérer à 2 secondes pour tester le Panel 5)
  const triggerFastForward = () => {
    if (timeLeft > 2) {
      setTimeLeft(2);
      setUserNotification("Compte à rebours accéléré à 2 secondes !");
      setTimeout(() => setUserNotification(null), 2000);
    }
  };

  // Réinitialiser la simulation de l'enchère pour tester à nouveau
  const resetAuctionSimulation = () => {
    setCurrentPrice(currentProduct.price);
    setTimeLeft(45);
    setIsCompleted(false);
    setHasWon(false);
    setHighestBidder('drift_king');
    setBids([
      { bidder: 'drift_king', amount: currentProduct.price, time: 'Il y a 2 min', avatar: 'DK', isOpponent: true },
      { bidder: 'keiichi_tsuchiya', amount: currentProduct.price - 5000, time: 'Il y a 10 min', avatar: 'KT', isOpponent: true },
      { bidder: 'takumi_86', amount: currentProduct.price - 10000, time: 'Il y a 2 heures', avatar: 'T8', isOpponent: true }
    ]);
    setOpponentNotification(null);
    setSnipingAlert(false);
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] antialiased overflow-x-hidden font-sans pt-20 selection:bg-primary selection:text-[#460283] relative">
      
      {/* Gradients lumineux néons en arrière-plan */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-0 w-[35vw] h-[35vw] rounded-full bg-secondary/5 blur-[120px] pointer-events-none"></div>

      {/* Barre de navigation simplifiée de l'Enchère */}
      <nav className="bg-[#131313]/90 backdrop-blur-xl fixed top-0 w-full z-40 border-b border-white/10 shadow-[0_0_20px_rgba(187,134,252,0.15)]">
        <div className="flex justify-between items-center h-20 px-4 md:px-16 w-full max-w-[1440px] mx-auto">
          {/* Bouton Retour */}
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/15 hover:bg-white/10 text-zinc-300 hover:text-white transition-all text-xs font-mono font-bold uppercase tracking-wider cursor-pointer active:scale-95"
          >
            <ArrowLeft size={14} className="text-[#bb86fc]" />
            <span>Quitter le Live</span>
          </button>

          {/* Logo Central */}
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-[#bb86fc] flex items-center justify-center font-black tracking-tighter text-[#460283] italic text-base shadow-[0_0_10px_rgba(187,134,252,0.3)]">
              MN
            </div>
            <span className="font-extrabold text-sm tracking-widest text-[#dab9ff] italic uppercase hidden sm:inline">
              MERCATO <span className="text-[#ffb2bc]">NOVA LIVE</span>
            </span>
          </div>

          {/* Statut Réseau et Profil */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#ffb2bc]/10 border border-[#ffb2bc]/20 rounded-full px-3 py-1 text-[10px] font-mono text-[#ffb2bc] animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="uppercase tracking-widest">Enchère Sécurisée</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Zone de notifications en surimpression (Néon JDM Floating Popups) */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none space-y-3">
        {opponentNotification && (
          <div className="bg-[#ffb2bc]/95 text-[#30000a] font-bold text-xs p-4 rounded-xl border-2 border-secondary shadow-[0_0_25px_rgba(255,178,188,0.7)] animate-in slide-in-from-top-4 duration-300 pointer-events-auto flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#30000a] text-[#ffb2bc] flex items-center justify-center font-extrabold text-[10px] border border-[#ffb2bc]/30 flex-shrink-0">
              {opponentNotification.pilot.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-[9px] font-mono text-[#30000a]/60 block uppercase tracking-wider">Alerte Surenchère</span>
              <p className="leading-tight">{opponentNotification.text}</p>
            </div>
          </div>
        )}

        {snipingAlert && (
          <div className="bg-[#17deca] text-[#003830] font-black text-xs px-4 py-3 rounded-lg border border-[#17deca]/50 shadow-[0_0_20px_rgba(23,222,202,0.6)] text-center animate-bounce uppercase tracking-widest pointer-events-auto">
            ⚡ RÈGLE ANTI-SNIPING : +10 Secondes Ajoutées ! ⚡
          </div>
        )}

        {userNotification && (
          <div className="bg-[#bb86fc] text-[#2c0054] font-bold text-xs px-4 py-3 rounded-lg border border-[#bb86fc]/50 shadow-[0_0_20px_rgba(187,134,252,0.6)] text-center animate-in fade-in duration-200 pointer-events-auto font-mono">
            {userNotification}
          </div>
        )}
      </div>

      {/* Corps Principal (Grid Dual Column) */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Colonne de Gauche : Média & Spécifications (7 Cols) */}
        <section className="lg:col-span-7 space-y-6">
          
          {/* Boîtier Photo avec badge LIVE */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#1c1b1b] shadow-[0_15px_35px_rgba(0,0,0,0.5)] group">
            <img 
              src={getJDMImage(currentProduct.model, currentProduct.brand, currentProduct.image)} 
              alt={currentProduct.model} 
              className="w-full h-[320px] sm:h-[450px] object-cover group-hover:scale-[1.02] transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/10 to-transparent"></div>
            
            {/* Badge de statut clignotant */}
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-[#ffb2bc] text-[#400013] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(255,178,188,0.6)] border border-white/20 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#400013]"></span>
              <span>Enchère en Direct</span>
            </div>

            {/* Badge Châssis Flottant */}
            <div className="absolute bottom-6 left-6 font-mono text-xs text-white/80 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/10">
              Châssis : <span className="text-[#17deca] font-bold">{currentProduct.chassis}</span>
            </div>
          </div>

          {/* Description & Spécifications JDM (Format Tokyo Underground) */}
          <div className="glass-panel rounded-3xl p-6 border border-white/5 space-y-6 shadow-[0_10px_35px_rgba(0,0,0,0.2)]">
            <div>
              <span className="text-secondary font-mono text-xs uppercase tracking-widest font-bold">{currentProduct.brand}</span>
              <h2 className="text-2xl sm:text-3xl font-black italic tracking-tighter uppercase text-zinc-100 mt-1">
                {currentProduct.year} {currentProduct.model}
              </h2>
              <div className="h-0.5 w-16 bg-primary mt-3"></div>
            </div>

            <p className="text-sm text-[#cdc3d4]/80 leading-relaxed">
              Ce bolide JDM légendaire a été importé directement des enchères de Tokyo (USS Tokyo) sous certification complète du syndicat Mercato Nova. Châssis sain sans corrosion, moteur {currentProduct.engine} optimisé avec soin et mécanique entièrement vérifiée.
            </p>

            {/* Table des Spécifications Techniques */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-[#cdc3d4]/50 uppercase tracking-widest border-b border-white/5 pb-2">
                Fiche de Certification Technique
              </h4>
              <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                  <span className="text-[#cdc3d4]/30 block text-[9px] uppercase tracking-wider mb-1">MOTEUR</span>
                  <span className="font-bold text-zinc-200 text-[13px]">{currentProduct.engine}</span>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                  <span className="text-[#cdc3d4]/30 block text-[9px] uppercase tracking-wider mb-1">PUISSANCE (ESTIMÉE)</span>
                  <span className="font-bold text-zinc-200 text-[13px]">{currentProduct.power}</span>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                  <span className="text-[#cdc3d4]/30 block text-[9px] uppercase tracking-wider mb-1">KILOMÉTRAGE</span>
                  <span className="font-bold text-zinc-200 text-[13px]">
                    {currentProduct.mileage ? `${currentProduct.mileage.toLocaleString()} km` : "N/A"}
                  </span>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                  <span className="text-[#cdc3d4]/30 block text-[9px] uppercase tracking-wider mb-1">NUMÉRO DE BLOC</span>
                  <span className="font-bold text-[#17deca] text-[13px] truncate block" title={currentProduct.chassis}>
                    {currentProduct.chassis}
                  </span>
                </div>
              </div>
            </div>

            {/* Avertissement de sécurité */}
            <div className="flex gap-3 bg-[#bb86fc]/5 border border-[#bb86fc]/20 rounded-2xl p-4 text-xs font-mono text-[#dab9ff]">
              <Shield size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase block mb-1">Système d'Entiercement Nova Guard</span>
                <span className="text-[#cdc3d4]/70 leading-relaxed block">
                  Toutes les transactions du catalogue sont gérées par contrat intelligent simulé. Les fonds sont bloqués de manière sécurisée en USD jusqu'à livraison finale et validation physique du véhicule.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Colonne de Droite : Enchères & Contrôles (5 Cols) */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* Bloc Compte à Rebours (Tokyo Neon Clock) */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 bg-[#1c1b1b]/95 shadow-[0_15px_30px_rgba(0,0,0,0.4)] text-center relative overflow-hidden">
            {/* Lueur néon de fond */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-[#ffb2bc] to-tertiary"></div>
            
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#cdc3d4]/45 uppercase tracking-widest font-bold flex items-center justify-center gap-1.5">
                <Timer size={12} className="text-secondary animate-pulse" />
                Compte à rebours de clôture
              </span>
              <h3 className="font-mono text-3xl sm:text-4xl font-extrabold tracking-widest text-[#ffb2bc] font-bold drop-shadow-[0_0_12px_rgba(255,178,188,0.4)] py-2">
                {formatTime(timeLeft)}
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono">
                {timeLeft <= 10 && timeLeft > 0 ? "⚡ TEMPS CRITIQUE — RÉACTION RAPIDE CONSEILLÉE" : "Simulation réseau active en temps réel"}
              </p>
            </div>
          </div>

          {/* Valeur Actuelle de l'Enchère */}
          <div className="glass-panel rounded-3xl p-6 border border-white/5 bg-[#1c1b1b]/50 shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono text-[#cdc3d4]/40 uppercase tracking-widest block">Offre Actuelle</span>
                <span className="font-black text-3xl tracking-tight text-[#17deca] font-mono block mt-1 drop-shadow-[0_0_10px_rgba(23,222,202,0.25)]">
                  {currentPrice.toLocaleString()} €
                </span>
              </div>
              <div className="text-right bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5">
                <span className="text-[9px] font-mono text-[#cdc3d4]/40 uppercase tracking-widest block">Leader Actuel</span>
                <span className={`text-xs font-bold font-mono block mt-1.5 uppercase ${highestBidder === 'Vous' ? 'text-[#bb86fc]' : 'text-zinc-200'}`}>
                  {highestBidder === 'Vous' ? '👑 Vous' : highestBidder}
                </span>
              </div>
            </div>
          </div>

          {/* Formulaire Intelligent pour placer l'offre */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 bg-[#1c1b1b]/95 shadow-[0_15px_30px_rgba(0,0,0,0.3)]">
            <form onSubmit={handleUserBidSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#cdc3d4]/50 font-mono block">
                  Saisir le montant de votre offre (EUR)
                </label>
                <div className="relative rounded-xl border border-white/15 input-glow bg-[#1c1b1b] focus-within:border-primary transition-all">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-base text-[#cdc3d4]/30">€</span>
                  <input
                    required
                    type="number"
                    min={currentPrice + 1}
                    className="w-full bg-transparent border-none py-4 pl-9 pr-4 text-base font-mono text-white focus:outline-none focus:ring-0 placeholder-zinc-700"
                    placeholder={(currentPrice + 1000).toString()}
                    value={bidAmountInput}
                    onChange={(e) => setBidAmountInput(e.target.value)}
                  />
                  {/* Boutons d'incréments rapides */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setBidAmountInput((currentPrice + 1000).toString())}
                      className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-mono font-bold text-zinc-300 hover:text-white hover:bg-white/10 cursor-pointer transition-all"
                    >
                      +1k €
                    </button>
                    <button
                      type="button"
                      onClick={() => setBidAmountInput((currentPrice + 5000).toString())}
                      className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[9px] font-mono font-bold text-zinc-300 hover:text-white hover:bg-white/10 cursor-pointer transition-all"
                    >
                      +5k €
                    </button>
                  </div>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                  <span>Pas d'incrément minimum : 1 €</span>
                  <span>Offre minimale : {(currentPrice + 1).toLocaleString()} €</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#bb86fc] hover:bg-[#bb86fc]/85 text-[#460283] font-bold text-xs py-4 rounded-xl uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(187,134,252,0.3)] active:scale-[0.98]"
              >
                <Gavel size={15} />
                <span>Placer mon offre du Syndicat</span>
              </button>
            </form>
          </div>

          {/* Tableau de l'Historique en Direct (Panel 3 de Stitch) */}
          <div className="glass-panel rounded-3xl p-6 border border-white/5 bg-[#1c1b1b]/50 shadow-[0_10px_25px_rgba(0,0,0,0.2)] flex flex-col space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="text-[10px] font-mono text-[#cdc3d4]/50 uppercase tracking-widest font-bold flex items-center gap-1.5">
                <TrendingUp size={12} className="text-[#17deca]" />
                Historique des offres du réseau
              </span>
              <span className="text-[9px] font-mono text-[#17deca] bg-[#17deca]/10 px-2 py-0.5 rounded border border-[#17deca]/20 font-bold uppercase">
                {bids.length} Offres
              </span>
            </div>

            {/* Liste défilante des offres */}
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {bids.map((bid, i) => (
                <div 
                  key={i} 
                  className={`flex justify-between items-center text-xs p-2.5 rounded-xl border transition-all ${
                    bid.bidder === 'Vous' 
                      ? 'bg-[#bb86fc]/5 border-[#bb86fc]/30 shadow-[0_0_8px_rgba(187,134,252,0.05)]' 
                      : 'bg-white/5 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-[9px] border flex-shrink-0 ${
                      bid.bidder === 'Vous'
                        ? 'bg-[#bb86fc]/20 text-[#bb86fc] border-[#bb86fc]/40'
                        : 'bg-white/5 text-zinc-300 border-white/10'
                    }`}>
                      {bid.avatar}
                    </div>
                    <span className={`font-mono truncate ${bid.bidder === 'Vous' ? 'text-[#dab9ff] font-bold' : 'text-[#cdc3d4]'}`}>
                      {bid.bidder === 'Vous' ? '👑 Vous' : bid.bidder}
                    </span>
                  </div>
                  <div className="space-x-3 text-right">
                    <span className={`font-mono font-bold ${bid.bidder === 'Vous' ? 'text-[#bb86fc]' : 'text-zinc-200'}`}>
                      ${bid.amount.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono block sm:inline">{bid.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Console de Simulation Réseau pour développeur (Test JDM) */}
          <div className="bg-[#1c1b1b] border border-white/10 rounded-3xl p-5 space-y-3.5 shadow-[0_15px_30px_rgba(0,0,0,0.4)]">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider font-semibold border-b border-white/5 pb-2">
              🛠️ Console de Simulation Réseau (Gab1)
            </span>
            <div className="grid grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={triggerFastForward}
                disabled={timeLeft <= 2 || isCompleted}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <RotateCcw size={12} className="animate-spin text-[#bb86fc]" style={{ animationDuration: '4s' }} />
                <span>Simuler la fin (2s)</span>
              </button>
              <button
                type="button"
                onClick={resetAuctionSimulation}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <RotateCcw size={12} className="text-secondary" />
                <span>Réinitialiser Enchère</span>
              </button>
            </div>
          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#0e0e0e] border-t border-white/5 py-12 text-[#cdc3d4]/40 text-xs font-mono mt-12">
        <div className="max-w-[1440px] mx-auto px-4 md:px-16 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p>© 2026 Mercato Nova. Tous droits réservés.</p>
          <div className="flex items-center space-x-2 text-[10px] uppercase text-[#ffb2bc]">
            <Shield size={12} />
            <span>Bouclier d'Entiercement Sécurisé du Syndicat</span>
          </div>
        </div>
      </footer>

      {/* ============================================================== */}
      {/* PANEL 5 - ÉCRAN DE VICTOIRE TRIOMPHANTE (USER WINS) */}
      {/* ============================================================== */}
      {isCompleted && hasWon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0d0d]/95 backdrop-blur-xl animate-in fade-in duration-300">
          
          {/* Confettis simulés en CSS pur (animations étincelles de victoires) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: i % 3 === 0 ? '#bb86fc' : i % 3 === 1 ? '#17deca' : '#ffb2bc',
                  left: `${Math.random() * 100}%`,
                  top: `-20px`,
                  opacity: Math.random() * 0.7 + 0.3,
                  transform: `scale(${Math.random() * 0.8 + 0.4})`,
                  animation: `fall ${Math.random() * 3 + 2}s linear infinite`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              />
            ))}
          </div>

          <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden relative z-10 border border-primary/30 shadow-[0_0_80px_rgba(187,134,252,0.4)] animate-in zoom-in-95 duration-300 bg-[#151515] p-8 sm:p-12 text-center space-y-6">
            
            {/* Lueur décorative */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#bb86fc]/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-16 h-16 bg-[#bb86fc]/10 border border-[#bb86fc]/30 rounded-full flex items-center justify-center mx-auto text-[#bb86fc] shadow-[0_0_20px_rgba(187,134,252,0.2)]">
              <Award size={36} className="animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="text-[#17deca] font-mono text-xs uppercase tracking-widest font-bold">Félicitations, Pilote !</span>
              <h2 className="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase text-[#dab9ff] drop-shadow-[0_0_15px_rgba(187,134,252,0.5)]">
                ENCHÈRE REMPORTÉE !
              </h2>
              <p className="text-xs text-[#cdc3d4]/70 font-mono">
                Réseau de transaction sécurisée Mercato Nova • Code de transfert : MN-WIN-{currentProduct.id}
              </p>
            </div>

            {/* Récapitulatif du véhicule gagné */}
            <div className="bg-[#1c1b1b] border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 text-left">
              <img 
                src={getJDMImage(currentProduct.model, currentProduct.brand, currentProduct.image)} 
                alt={currentProduct.model} 
                className="w-32 h-20 object-cover rounded-lg border border-white/10 flex-shrink-0"
              />
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">{currentProduct.brand}</span>
                <h4 className="font-extrabold text-sm sm:text-base text-zinc-200">{currentProduct.year} {currentProduct.model}</h4>
                <div className="flex gap-4 font-mono text-[11px] text-[#cdc3d4]/70">
                  <span>Moteur : {currentProduct.engine}</span>
                  <span>Châssis : {currentProduct.chassis}</span>
                </div>
                <p className="text-xs font-mono text-[#17deca] font-bold mt-1">
                  Prix d'adjudication final : {currentPrice.toLocaleString()} €
                </p>
              </div>
            </div>

            {/* Instructions d'entiercement sécurisé */}
            <div className="bg-[#bb86fc]/5 border border-[#bb86fc]/20 rounded-2xl p-5 text-left font-mono text-xs space-y-3 text-[#dab9ff]">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                <Shield size={14} className="text-[#bb86fc]" />
                <span>Instructions de Paiement par Entiercement (Nova Guard)</span>
              </div>
              <p className="text-[#cdc3d4]/85 leading-relaxed text-[11px]">
                Votre transaction de <strong>{currentPrice.toLocaleString()} €</strong> a été bloquée de manière sécurisée sur le compte tiers de Mercato Nova. 
                Le vendeur dispose de <strong>48 heures</strong> pour organiser le transport sécurisé depuis le port de Yokohama. 
                Les clés et documents d'importation vous seront remis après inspection physique du bolide.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => onNavigate('checkout', {
                  type: 'auction',
                  items: [{
                    name: `Enchère gagnée : ${currentProduct.brand} ${currentProduct.model}`,
                    price: currentPrice,
                    image: currentProduct.image,
                    qty: 1
                  }]
                })}
                className="bg-[#bb86fc] hover:bg-[#bb86fc]/90 text-[#460283] font-bold text-xs px-8 py-4 rounded-xl uppercase tracking-wider cursor-pointer transition-all active:scale-95 shadow-[0_0_20px_rgba(187,134,252,0.3)] font-sans"
              >
                Procéder au Paiement
              </button>
              <button 
                onClick={onBack}
                className="bg-white/5 hover:bg-white/10 text-zinc-300 font-bold text-xs px-6 py-4 rounded-xl uppercase tracking-wider cursor-pointer border border-white/10 transition-all active:scale-95 font-sans"
              >
                Quitter l'Enchère
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ÉCRAN DE DÉFAITE (USER LACKS HIGHEST BID AT CLOTURE) */}
      {/* ============================================================== */}
      {isCompleted && !hasWon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0d0d]/95 backdrop-blur-xl animate-in fade-in duration-300">
          
          <div className="glass-panel w-full max-w-lg rounded-3xl overflow-hidden relative z-10 border border-secondary/30 shadow-[0_0_50px_rgba(255,178,188,0.3)] animate-in zoom-in-95 duration-300 bg-[#151515] p-8 sm:p-12 text-center space-y-6">
            
            <div className="w-16 h-16 bg-secondary/10 border border-secondary/30 rounded-full flex items-center justify-center mx-auto text-secondary shadow-[0_0_20px_rgba(255,178,188,0.2)]">
              <X size={36} />
            </div>

            <div className="space-y-2">
              <span className="text-secondary font-mono text-xs uppercase tracking-widest font-bold">Enchère Clôturée</span>
              <h2 className="text-2xl sm:text-3xl font-black italic tracking-tighter uppercase text-[#ffb2bc] drop-shadow-[0_0_15px_rgba(255,178,188,0.4)]">
                DÉPASSEMENT DE L'OFFRE !
              </h2>
              <p className="text-xs text-[#cdc3d4]/70 font-mono">
                L'enchère a pris fin et le compte à rebours est tombé à 0.
              </p>
            </div>

            <div className="bg-[#1c1b1b]/80 border border-white/5 rounded-2xl p-4 text-sm font-mono text-[#cdc3d4] leading-relaxed">
              Le pilote underground <strong className="text-secondary font-bold uppercase">{highestBidder}</strong> a emporté le bolide pour un montant final de <strong className="text-[#17deca] font-bold">{currentPrice.toLocaleString()} €</strong>.
            </div>

            <div className="pt-4 flex justify-center gap-4">
              <button 
                onClick={resetAuctionSimulation}
                className="bg-white/5 hover:bg-[#ffb2bc]/10 border border-white/10 hover:border-secondary/30 text-zinc-300 hover:text-secondary font-bold text-xs px-6 py-3.5 rounded-xl uppercase tracking-wider cursor-pointer transition-all active:scale-95 font-sans"
              >
                Réessayer la Simulation
              </button>
              <button 
                onClick={onBack}
                className="bg-secondary hover:bg-secondary/90 text-[#30000a] font-bold text-xs px-6 py-3.5 rounded-xl uppercase tracking-wider cursor-pointer transition-all active:scale-95 shadow-[0_0_20px_rgba(255,178,188,0.3)] font-sans"
              >
                Retourner au catalogue
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Ajout des styles CSS Fall pure simulation dans le DOM */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>

      {/* Custom Alert/Info Popup */}
      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className={`glass-panel w-full max-w-md rounded-2xl border p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative ${popup.type === 'warning' ? 'border-[#ffb2bc]/30 shadow-[0_0_50px_rgba(255,178,188,0.2)]' : 'border-[#bb86fc]/30 shadow-[0_0_50px_rgba(187,134,252,0.2)]'}`}>
            <span className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-[#bb86fc] animate-pulse"></span>
            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#ffb2bc] animate-pulse"></span>
            
            <div className="text-center space-y-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto border shadow-[0_0_15px_rgba(255,255,255,0.05)] ${popup.type === 'warning' ? 'bg-[#ffb2bc]/10 text-[#ffb2bc] border-[#ffb2bc]/20 shadow-[0_0_15px_rgba(255,178,188,0.2)]' : 'bg-[#bb86fc]/10 text-[#bb86fc] border-[#bb86fc]/20 shadow-[0_0_15px_rgba(187,134,252,0.2)]'}`}>
                {popup.type === 'warning' ? <AlertTriangle size={24} /> : <Sparkles size={24} />}
              </div>
              <h3 className="text-lg font-black italic tracking-tighter uppercase text-white font-headline-md">{popup.title}</h3>
              <p className="text-xs text-[#cdc3d4]/80 font-mono leading-relaxed">{popup.message}</p>
              
              <button 
                onClick={() => {
                  setPopup(null);
                  if (popup.onClose) popup.onClose();
                }}
                className={`w-full mt-6 py-3 font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${popup.type === 'warning' ? 'bg-[#ffb2bc] hover:brightness-110 text-[#400013]' : 'bg-[#bb86fc] hover:bg-[#bb86fc]/90 text-[#460283]'}`}
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Auction;
