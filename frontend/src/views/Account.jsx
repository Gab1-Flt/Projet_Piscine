import React, { useState } from 'react';
import {
  User, Shield, ShieldCheck, Mail, Phone, Lock, CheckCircle2,
  AlertTriangle, ArrowLeft, LogOut, FileText, ShoppingCart,
  Clock, X, Printer, Compass, Timer, Bell, MessageSquare, Heart, Cpu
} from 'lucide-react';

const presetAvatars = [
  {
    id: 'keiichi',
    name: 'Keiichi',
    role: 'Pilote GTR',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCWDMbBlRUu1MohGZQ9jSeeS08LTMyDqmqSsxfW9fqi2lqjfDAWRDvJjDJ_t3cF9IL0SiLgqUhypM4P-kMc7KMwvkZxo6J9Q3NWnOtjJIx5LoU-DsooYK286gHHI0ctClYmJnG9gHtdBAXnGrie3rY2-vwy-6LuStRhrFeW2EmvRLsEhrLpwhnQInYw3sSKatnVOPiooq8H6PvUMX-cBCQw-IffL9vv8TtKaXO0ix1SI3Pt1Tm_pTRu_2wIpqwdGWAlvdyjfNh2BEV'
  },
  {
    id: 'yuki',
    name: 'Yuki',
    role: 'Wrench Pro',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'takeshi',
    name: 'Takeshi',
    role: 'Drift King',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'sayuri',
    name: 'Sayuri',
    role: 'Tuning Specialist',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
  }
];

function Account({ user, onUpdateUser, onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'settings'
  
  // États de profil
  const [firstName, setFirstName] = useState(user?.firstName || 'Pilote');
  const [lastName, setLastName] = useState(user?.lastName || 'Nova');
  const [email, setEmail] = useState(user?.email || 'driver@mercatonova.com');
  const [phone, setPhone] = useState(user?.phone || '+33 6 12 34 56 78');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || presetAvatars[0].url);

  // États de mot de passe
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Dropdowns navbar
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);

  // Popup de validation in-site
  const [popup, setPopup] = useState(null); // { title, message, type }

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setPopup({
        title: "Données Incomplètes",
        message: "Les champs Prénom, Nom, et E-mail sont obligatoires pour valider votre licence de pilote.",
        type: "warning"
      });
      return;
    }

    onUpdateUser({
      firstName,
      lastName,
      email,
      phone,
      avatarUrl
    });

    setPopup({
      title: "Profil Mis à Jour",
      message: "Vos données de pilote cryptées ont été enregistrées avec succès dans la base du Syndicat.",
      type: "info"
    });
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (!oldPassword) {
      setPopup({
        title: "Sécurité Requise",
        message: "Veuillez saisir votre mot de passe actuel pour autoriser la modification.",
        type: "warning"
      });
      return;
    }
    if (newPassword.length < 6) {
      setPopup({
        title: "Sécurité Faible",
        message: "Votre nouveau mot de passe doit comporter au moins 6 caractères pour résister aux décrypteurs du réseau.",
        type: "warning"
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPopup({
        title: "Mots de Passe Différents",
        message: "La confirmation du mot de passe ne correspond pas au nouveau mot de passe saisi.",
        type: "warning"
      });
      return;
    }

    setPopup({
      title: "Mot de Passe Modifié",
      message: "Votre empreinte d'authentification a été mise à jour. La session reste active.",
      type: "info"
    });
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] antialiased overflow-x-hidden font-sans pt-24 selection:bg-primary selection:text-[#460283]">
      
      {/* Gradients de fond luminescents */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[150px]"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[40vw] h-[50vw] rounded-full bg-[#17deca]/5 blur-[150px]"></div>
      </div>

      {/* Navigation supérieure unifiée */}
      <nav className="bg-[#131313]/80 backdrop-blur-xl fixed top-0 w-full z-40 border-b border-white/10 shadow-[0_0_20px_rgba(187,134,252,0.15)]">
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
              onClick={() => onNavigate('home')}
              className="text-[#cdc3d4] hover:text-[#e5e2e1] px-3 py-2 rounded hover:bg-white/5 transition-all duration-200 cursor-pointer font-semibold text-sm bg-transparent border-none"
            >
              Catalogue
            </button>
            <button 
              onClick={() => onNavigate('auctions_list')}
              className="text-[#cdc3d4] hover:text-[#e5e2e1] px-3 py-2 rounded hover:bg-white/5 transition-all duration-200 cursor-pointer font-semibold text-sm bg-transparent border-none"
            >
              Enchères
            </button>
            <button 
              onClick={() => onNavigate('preparation')}
              className="text-[#cdc3d4] hover:text-[#e5e2e1] px-3 py-2 rounded hover:bg-white/5 transition-all duration-200 cursor-pointer font-semibold text-sm bg-transparent border-none"
            >
              Préparations
            </button>
          </div>

          {/* Profil déroulant navbar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotificationsMenu(false); }}
                className={`p-2 rounded-full transition-all active:scale-95 cursor-pointer text-[#bb86fc] bg-white/5 border border-[#bb86fc]/20 shadow-[0_0_10px_rgba(187,134,252,0.15)]`}
              >
                <User size={20} />
              </button>

              {showProfileMenu && (
                <>
                  <div onClick={() => setShowProfileMenu(false)} className="fixed inset-0 z-30"></div>
                  <div className="absolute right-0 mt-3 w-52 rounded-xl border border-white/10 bg-[#1c1b1b] py-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-40">
                    <div className="px-4 py-2.5 border-b border-white/5 mb-1.5 text-[10px] font-mono">
                      <span className="text-zinc-200 truncate block">{firstName} {lastName}</span>
                      <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded bg-[#bb86fc]/15 text-[#bb86fc] border border-[#bb86fc]/30 text-[8px] font-bold uppercase tracking-wider">
                        {user?.role === 'admin' ? '🛡️ Admin VIP' : user?.role === 'seller' ? '🔧 Vendeur' : '👤 Client'}
                      </span>
                    </div>
                    <button 
                      onClick={() => { setShowProfileMenu(false); onNavigate('home'); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-left cursor-pointer"
                    >
                      <Compass size={14} className="text-[#cdc3d4]" />
                      <span>Catalogue</span>
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

      {/* Contenu principal */}
      <main className="relative z-10 w-full max-w-[1100px] mx-auto px-4 md:px-8 py-8">
        
        {/* En-tête de la page */}
        <header className="mb-8 flex items-center justify-between border-b border-white/5 pb-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-zinc-100">
              Mon <span className="text-[#bb86fc]">Compte</span>
            </h1>
            <p className="text-xs text-[#cdc3d4]/70 font-mono mt-1">// LICENCE PILOTE SECURE: MN-{user?.role?.toUpperCase() || 'CLIENT'}</p>
          </div>
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#bb86fc] hover:text-white transition-all bg-white/5 border border-white/10 hover:border-[#bb86fc]/50 px-4 py-2 rounded-xl cursor-pointer hover:bg-white/10 active:scale-95 shadow-[0_0_12px_rgba(187,134,252,0.1)]"
          >
            <ArrowLeft size={12} />
            <span>Catalogue</span>
          </button>
        </header>

        {/* Carte de résumé de l'utilisateur (Panel 9 Stitch) */}
        <section className="glass-panel rounded-2xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/10">
          
          {/* Lueur d'ambiance de fond */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative shrink-0">
            <img 
              alt={firstName} 
              className="w-24 h-24 rounded-full object-cover border-2 border-[#bb86fc] shadow-[0_0_20px_rgba(187,134,252,0.4)] z-10 relative" 
              src={avatarUrl}
            />
          </div>

          <div className="text-center md:text-left z-10 space-y-2.5">
            <div>
              <h2 className="text-2xl font-black text-white italic tracking-wide">{firstName} {lastName}</h2>
              <p className="text-xs text-[#cdc3d4]/50 font-mono mt-0.5">{email}</p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#17deca]/30 bg-[#17deca]/10 text-[#17deca] text-[10px] font-mono uppercase font-bold tracking-wider">
                <ShieldCheck size={12} />
                Pilote Vérifié
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#bb86fc]/30 bg-[#bb86fc]/10 text-[#bb86fc] text-[10px] font-mono uppercase font-bold tracking-wider">
                Nova Guard Escrow
              </span>
            </div>
          </div>

          <div className="md:ml-auto flex gap-4 z-10">
            <button 
              onClick={() => setActiveTab('settings')}
              className="px-5 py-3 border border-[#bb86fc] text-[#bb86fc] hover:bg-[#bb86fc]/10 text-[10px] font-mono font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-[0_0_12px_rgba(187,134,252,0.1)] cursor-pointer"
            >
              Éditer le profil
            </button>
          </div>
        </section>

        {/* Onglets de Navigation réactifs */}
        <nav className="flex border-b border-white/10 mb-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 font-mono text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
              activeTab === 'overview' ? 'text-[#bb86fc] border-[#bb86fc]' : 'text-zinc-500 border-transparent hover:text-white'
            }`}
          >
            Vue d'ensemble
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-4 font-mono text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
              activeTab === 'settings' ? 'text-[#bb86fc] border-[#bb86fc]' : 'text-zinc-500 border-transparent hover:text-white'
            }`}
          >
            Paramètres & Sécurité
          </button>
        </nav>

        {/* CONTENU 1 : VUE D'ENSEMBLE */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Bento Grid statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col justify-between min-h-[140px] relative overflow-hidden bg-black/20">
                <div className="flex justify-between items-start text-[#cdc3d4]/50 font-mono text-[10px] uppercase tracking-wider">
                  <span>Enchères remportées</span>
                  <Timer size={16} className="text-[#17deca]" />
                </div>
                <div className="text-3xl font-black text-white font-mono mt-4">2</div>
                <span className="text-[9px] font-mono text-zinc-500 mt-2 block uppercase">// Skyline R34 & Supra RZ</span>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col justify-between min-h-[140px] relative overflow-hidden bg-black/20">
                <div className="flex justify-between items-start text-[#cdc3d4]/50 font-mono text-[10px] uppercase tracking-wider">
                  <span>Pièces mécaniques</span>
                  <Cpu size={16} className="text-[#bb86fc]" />
                </div>
                <div className="text-3xl font-black text-white font-mono mt-4">5</div>
                <span className="text-[9px] font-mono text-zinc-500 mt-2 block uppercase">// Turbos, Combinés, Jantes alloués</span>
              </div>

              <div className="glass-panel rounded-2xl p-6 border border-white/5 flex flex-col justify-between min-h-[140px] relative overflow-hidden bg-black/20 border-t-2 border-t-[#ffb2bc]/30">
                <div className="flex justify-between items-start text-[#cdc3d4]/50 font-mono text-[10px] uppercase tracking-wider">
                  <span>Vérification d'identité (KYC)</span>
                  <ShieldCheck size={16} className="text-[#ffb2bc]" />
                </div>
                <div className="text-sm font-extrabold text-[#ffb2bc] font-mono mt-4">NIVEAU 2 APPROUVÉ</div>
                <span className="text-[9px] font-mono text-[#ffb2bc]/60 mt-2 block uppercase">// Dépôt de garantie supérieur à 15k débloqué</span>
              </div>

            </div>

            {/* Tableau d'Historique des Transactions (Panel 9 Stitch) */}
            <section className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
              <div className="p-5 border-b border-white/5 bg-black/40 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <FileText className="text-[#bb86fc]" size={16} />
                  Historique des Transactions JDM
                </h3>
                <span className="text-[9px] font-mono text-[#17deca] bg-[#17deca]/10 px-2 py-0.5 rounded border border-[#17deca]/20 font-bold uppercase">
                  Fonds Bloqués Nova Guard
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/20 text-[#cdc3d4]/50 uppercase tracking-widest text-[9px]">
                      <th className="p-5">Désignation Produit</th>
                      <th className="p-5">Type d'opération</th>
                      <th className="p-5">Date</th>
                      <th className="p-5">Montant Net</th>
                      <th className="p-5">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    
                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-5 font-sans font-bold text-white">1994 Toyota Supra RZ MK4</td>
                      <td className="p-5 text-[#cdc3d4]/70">Enchère remportée</td>
                      <td className="p-5 text-[#cdc3d4]/50">12 oct. 2023</td>
                      <td className="p-5 font-bold text-[#17deca]">95 000 €</td>
                      <td className="p-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold border border-[#17deca]/30 text-[#17deca] bg-[#17deca]/10 uppercase tracking-wider">
                          <CheckCircle2 size={10} />
                          Terminé
                        </span>
                      </td>
                    </tr>

                    <tr className="bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
                      <td className="p-5 font-sans font-bold text-white">Kit Turbocompresseur Garrett G30-770</td>
                      <td className="p-5 text-[#cdc3d4]/70">Achat direct catalogue</td>
                      <td className="p-5 text-[#cdc3d4]/50">28 sept. 2023</td>
                      <td className="p-5 font-bold text-[#17deca]">2 850 €</td>
                      <td className="p-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold border border-[#17deca]/30 text-[#17deca] bg-[#17deca]/10 uppercase tracking-wider">
                          <CheckCircle2 size={10} />
                          Terminé
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-5 font-sans font-bold text-white">Combinés Filetés Tein Mono Sport (Tuning)</td>
                      <td className="p-5 text-[#cdc3d4]/70">Ordre de Préparation</td>
                      <td className="p-5 text-[#cdc3d4]/50">15 sept. 2023</td>
                      <td className="p-5 font-bold text-[#17deca]">1 650 €</td>
                      <td className="p-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold border border-yellow-500/30 text-yellow-400 bg-yellow-500/10 uppercase tracking-wider">
                          <Clock size={10} className="animate-spin" style={{ animationDuration: '4s' }} />
                          En attente
                        </span>
                      </td>
                    </tr>

                    <tr className="bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
                      <td className="p-5 font-sans font-bold text-white">Nissan Skyline GT-R R34 V-Spec</td>
                      <td className="p-5 text-[#cdc3d4]/70">Enchère remportée</td>
                      <td className="p-5 text-[#cdc3d4]/50">02 juil. 2023</td>
                      <td className="p-5 font-bold text-[#ffb2bc]">185 000 €</td>
                      <td className="p-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold border border-red-500/30 text-[#ffb2bc] bg-[#ffb2bc]/10 uppercase tracking-wider">
                          <X size={10} />
                          Annulé
                        </span>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </section>
            
          </div>
        )}

        {/* CONTENU 2 : PARAMÈTRES DE SÉCURITÉ */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            
            {/* Colonne Gauche (7 cols) : Infos Persos & Avatar Presets */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Formulaire 1 : Informations Pilote */}
              <section className="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.3)] bg-black/10">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider border-b border-white/5 pb-4 mb-6 flex items-center gap-2">
                  <User className="text-[#bb86fc]" size={16} />
                  Informations Personnelles
                </h3>
                
                <form onSubmit={handleProfileSave} className="space-y-4 font-mono text-xs">
                  
                  {/* Prénom / Nom */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-[#cdc3d4]/40 uppercase tracking-widest block">Prénom</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-[#131313] border border-white/10 text-white rounded-lg p-3 focus:outline-none focus:border-[#bb86fc] focus:ring-0 transition-colors"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] text-[#cdc3d4]/40 uppercase tracking-widest block">Nom de famille</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-[#131313] border border-white/10 text-white rounded-lg p-3 focus:outline-none focus:border-[#bb86fc] focus:ring-0 transition-colors"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* E-mail / Téléphone */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-[#cdc3d4]/40 uppercase tracking-widest block">Adresse E-mail de contact</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                      <input 
                        type="email" 
                        required
                        className="w-full bg-[#131313] border border-white/10 text-white rounded-lg p-3 pl-10 focus:outline-none focus:border-[#bb86fc] focus:ring-0 transition-colors"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-[#cdc3d4]/40 uppercase tracking-widest block">Téléphone Sécurisé (MAMP)</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                      <input 
                        type="text" 
                        required
                        className="w-full bg-[#131313] border border-white/10 text-white rounded-lg p-3 pl-10 focus:outline-none focus:border-[#bb86fc] focus:ring-0 transition-colors"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Sélecteur d'Avatars Presets (Cyber JDM Icons) */}
                  <div className="space-y-3 pt-3 border-t border-white/5">
                    <label className="text-[9px] text-[#cdc3d4]/40 uppercase tracking-widest block">Choisir votre portrait de Pilote</label>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {presetAvatars.map((av) => {
                        const isSelected = avatarUrl === av.url;
                        return (
                          <div 
                            key={av.id}
                            onClick={() => setAvatarUrl(av.url)}
                            className={`glass-panel p-3 rounded-xl border-2 cursor-pointer transition-all hover:bg-white/5 flex flex-col items-center text-center ${
                              isSelected ? 'border-[#bb86fc] bg-[#bb86fc]/5 shadow-[0_0_12px_rgba(187,134,252,0.2)]' : 'border-white/5'
                            }`}
                          >
                            <img src={av.url} alt={av.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                            <span className="block font-bold text-white text-[10px] mt-1.5">{av.name}</span>
                            <span className="block text-[8px] text-[#cdc3d4]/40 font-mono mt-0.5">{av.role}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-[#bb86fc] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-[#cba2ff] transition-all cursor-pointer shadow-[0_0_15px_rgba(187,134,252,0.25)] active:scale-[0.98] border-none font-mono flex items-center justify-center gap-2 mt-6"
                  >
                    <CheckCircle2 size={14} />
                    Sauvegarder mon Profil
                  </button>

                </form>
              </section>

            </div>

            {/* Colonne Droite (5 cols) : Mot de passe & Statut Sécurité */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Formulaire 2 : Sécurité Mot de passe */}
              <section className="glass-panel rounded-2xl p-6 border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.3)] bg-black/10">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider border-b border-white/5 pb-4 mb-6 flex items-center gap-2">
                  <Lock className="text-[#ffb2bc]" size={16} />
                  Mise à jour d'Accès Réseau
                </h3>

                <form onSubmit={handlePasswordSave} className="space-y-4 font-mono text-xs">
                  
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-[#cdc3d4]/40 uppercase tracking-widest block">Mot de passe actuel</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-[#131313] border border-white/10 text-white rounded-lg p-3 focus:outline-none focus:border-[#bb86fc] focus:ring-0 transition-colors"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-[#cdc3d4]/40 uppercase tracking-widest block">Nouveau mot de passe</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-[#131313] border border-white/10 text-white rounded-lg p-3 focus:outline-none focus:border-[#bb86fc] focus:ring-0 transition-colors"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] text-[#cdc3d4]/40 uppercase tracking-widest block">Confirmer nouveau mot de passe</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-[#131313] border border-white/10 text-white rounded-lg p-3 focus:outline-none focus:border-[#bb86fc] focus:ring-0 transition-colors"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-[#ffb2bc] text-[#400013] font-black text-xs uppercase tracking-widest rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-[0_0_15px_rgba(255,178,188,0.25)] active:scale-[0.98] border-none font-mono flex items-center justify-center gap-2 mt-6"
                  >
                    <Lock size={14} />
                    Mettre à jour mot de passe
                  </button>

                </form>
              </section>

              {/* Fiche Sécurité d'identité (Nova Guard KYC) */}
              <section className="bg-black/30 border border-white/5 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-[#17deca] font-mono text-xs border-b border-white/5 pb-2">
                  <Shield size={14} />
                  <span className="uppercase font-bold tracking-wider">Nova Guard Security Hub</span>
                </div>
                
                <p className="text-[11px] text-[#cdc3d4]/70 leading-relaxed font-sans">
                  Votre identité de pilote underground a été authentifiée sous signature cryptographique par nos administrateurs. Vos documents d'identité physiques (passeport/carte d'identité) ont expiré le 14 nov. 2027.
                </p>

                <div className="bg-[#17deca]/5 border border-[#17deca]/20 rounded-xl p-3.5 flex gap-3 items-center font-mono text-[10px] text-[#17deca]">
                  <CheckCircle2 size={14} className="shrink-0 text-[#17deca]" />
                  <span>NIVEAU DE CONFIANCE MAXIMAL ACTIF</span>
                </div>
              </section>

            </div>

          </div>
        )}

      </main>

      {/* POPUP DE NOTIFICATION CYBERPUNK (PAS D'ALERTES DU NAVIGATEUR !) */}
      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className={`glass-panel w-full max-w-md rounded-2xl border p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative ${
            popup.type === 'warning' ? 'border-[#ffb2bc]/30 shadow-[0_0_50px_rgba(255,178,188,0.2)]' : 'border-[#bb86fc]/30 shadow-[0_0_50px_rgba(187,134,252,0.2)]'
          }`}>
            <span className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-[#bb86fc] animate-pulse"></span>
            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#ffb2bc] animate-pulse"></span>
            
            <div className="text-center space-y-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto border shadow-[0_0_15px_rgba(255,255,255,0.05)] ${
                popup.type === 'warning' 
                  ? 'bg-[#ffb2bc]/10 text-[#ffb2bc] border-[#ffb2bc]/20 shadow-[0_0_15px_rgba(255,178,188,0.2)]' 
                  : 'bg-[#bb86fc]/10 text-[#bb86fc] border-[#bb86fc]/20 shadow-[0_0_15px_rgba(187,134,252,0.2)]'
              }`}>
                {popup.type === 'warning' ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
              </div>
              <h3 className="text-lg font-black italic tracking-tighter uppercase text-white">{popup.title}</h3>
              <p className="text-xs text-[#cdc3d4]/80 font-mono leading-relaxed">{popup.message}</p>
              
              <button 
                onClick={() => setPopup(null)}
                className={`w-full mt-6 py-3 font-bold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  popup.type === 'warning' 
                    ? 'bg-[#ffb2bc] hover:brightness-110 text-[#400013]' 
                    : 'bg-[#bb86fc] hover:bg-[#bb86fc]/90 text-[#460283]'
                }`}
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

export default Account;
