import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, ArrowLeft, Shield, Cpu, User, 
  Circle, Sparkles, Loader2, UserCheck, Ban, Check, 
  DollarSign, RefreshCw, Landmark, X, AlertTriangle 
} from 'lucide-react';
import { getJDMImage } from '../utils/jdmImages';

function Negotiation({ user, negotiationId, apiUrl, onNavigate }) {
  const [nego, setNego] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  // Counter offer state
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [counterPrice, setCounterPrice] = useState('');
  const [updatingNego, setUpdatingNego] = useState(false);

  const messagesEndRef = useRef(null);

  const currentUserId = user?.id ? parseInt(user.id) : 5; // Takumi as default fallback
  const isBuyer = nego ? currentUserId === parseInt(nego.buyer_id) : true;

  // 1. Fetch negotiation and participant info
  const fetchNegotiationDetails = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/negotiations/get.php?id=${negotiationId}`);
      const responseJson = await res.json();
      if (responseJson.status === 'success') {
        setNego(responseJson.data);
        if (!counterPrice) {
          setCounterPrice(Math.round(responseJson.data.offered_price));
        }
      }
    } catch (err) {
      console.error("Failed to fetch negotiation details:", err);
    }
  };

  // 2. Fetch chat messages between the buyer and the seller
  const fetchChatMessages = async () => {
    if (!nego) return;
    const contactId = isBuyer ? nego.seller_id : nego.buyer_id;
    try {
      const res = await fetch(`${apiUrl}/api/messages/get_chat.php?user_id=${currentUserId}&contact_id=${contactId}`);
      const responseJson = await res.json();
      if (responseJson.status === 'success') {
        setMessages(responseJson.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch chat messages:", err);
    }
  };

  // Fetch initial data
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchNegotiationDetails();
      setLoading(false);
    };
    init();
  }, [apiUrl, negotiationId]);

  // Load chat and setup 3-second real-time polling
  useEffect(() => {
    if (nego) {
      fetchChatMessages();
      const timer = setInterval(() => {
        fetchChatMessages();
        fetchNegotiationDetails(); // Also poll negotiation status changes
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [nego, currentUserId]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3. Send direct message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !nego || sending) return;

    const textToSend = newMessageText.trim();
    setNewMessageText('');
    setSending(true);

    const contactId = isBuyer ? nego.seller_id : nego.buyer_id;

    try {
      const res = await fetch(`${apiUrl}/api/messages/send.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: currentUserId,
          receiver_id: contactId,
          message: textToSend
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setMessages(prev => [...prev, data.data]);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  // 4. Accept/Reject/Counter Actions
  const handleNegotiationAction = async (action, priceVal = null) => {
    if (!nego || updatingNego) return;
    setUpdatingNego(true);

    try {
      const res = await fetch(`${apiUrl}/api/negotiations/update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: negotiationId,
          action: action,
          price: priceVal,
          user_id: currentUserId
        })
      });
      
      const responseJson = await res.json();
      if (responseJson.status === 'success') {
        setShowCounterModal(false);
        await fetchNegotiationDetails();
        await fetchChatMessages();
      }
    } catch (err) {
      console.error("Failed to update negotiation:", err);
    } finally {
      setUpdatingNego(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131313] flex items-center justify-center font-mono text-xs text-[#cdc3d4]/50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#bb86fc]" />
          <span className="tracking-widest uppercase animate-pulse">Protocole de Négociation en cours...</span>
        </div>
      </div>
    );
  }

  if (!nego) {
    return (
      <div className="min-h-screen bg-[#131313] flex items-center justify-center font-mono text-xs text-red-400">
        <div className="text-center space-y-4 max-w-sm glass-panel p-8 border-red-500/20 rounded-2xl">
          <AlertTriangle className="mx-auto" size={32} />
          <p>La négociation spécifiée est introuvable ou vous n'avez pas l'accès nécessaire.</p>
          <button onClick={() => onNavigate('home')} className="mt-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg px-4 py-2 uppercase font-bold tracking-wider">
            Retour
          </button>
        </div>
      </div>
    );
  }

  // Format currency
  const formatMoney = (amount) => `${Number(amount || 0).toLocaleString()} €`;

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] antialiased overflow-x-hidden font-sans pt-24 selection:bg-primary selection:text-[#460283]">
      
      {/* Background Luminescent Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#bb86fc]/5 blur-[150px]"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[40vw] h-[50vw] rounded-full bg-[#17deca]/5 blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjwvc3ZnPg==')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Cyberpunk Navigation Bar */}
      <nav className="bg-[#131313]/85 backdrop-blur-xl fixed top-0 w-full z-40 border-b border-white/10 shadow-[0_0_20px_rgba(187,134,252,0.1)]">
        <div className="flex justify-between items-center h-20 px-4 md:px-16 w-full max-w-[1440px] mx-auto font-sans">
          
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded bg-[#bb86fc] flex items-center justify-center font-black tracking-tighter text-[#460283] italic text-lg shadow-[0_0_12px_rgba(187,134,252,0.4)]">
              MN
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider text-[#dab9ff] italic uppercase">MERCATO <span className="text-[#ffb2bc]">NOVA</span></span>
              <p className="text-[9px] text-[#cdc3d4]/50 font-mono tracking-widest -mt-1 uppercase">Tokyo Underground</p>
            </div>
          </div>
          
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-xs font-mono text-[#cdc3d4]/65 hover:text-white transition-colors cursor-pointer border border-white/10 rounded-lg px-4 py-2 bg-[#1c1b1b]/50 hover:bg-[#201f1f]"
          >
            <ArrowLeft size={14} />
            <span>Quitter la négociation</span>
          </button>
        </div>
      </nav>

      {/* Main Grid View matching Panel 4 split panel */}
      <main className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-16 py-4 h-[calc(100vh-8rem)] min-h-[550px] font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full items-stretch">
          
          {/* LEFT SIDEBAR (1/3 columns) - Item details & actions */}
          <aside className="lg:col-span-4 flex flex-col gap-4 h-full min-h-0">
            <div className="glass-panel rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-white/10">
              
              {/* Product Visual */}
              <div className="relative h-48 w-full bg-[#1c1b1b]">
                <img 
                  alt={nego.product_model} 
                  className="w-full h-full object-cover opacity-85" 
                  src={getJDMImage(nego.product_model, nego.product_brand, nego.product_image)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent"></div>
                <span className="absolute top-4 left-4 bg-[#bb86fc] text-black font-mono text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(187,134,252,0.3)]">
                  {nego.product_brand} Performance
                </span>
              </div>
              
              {/* Product Info */}
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <span className="text-[#ffb2bc] text-[10px] font-mono uppercase tracking-widest">{nego.product_brand}</span>
                  <h2 className="font-extrabold text-2xl text-white tracking-tight leading-snug">{nego.product_title}</h2>
                  <p className="font-mono text-[10px] text-[#cdc3d4]/50 mt-1 uppercase">ID Objet: #MN-{nego.product_id}00{nego.product_id}</p>
                </div>
                
                {/* Prices Grid */}
                <div className="flex justify-between items-end border-t border-white/5 pt-4 mt-1 font-mono">
                  <div>
                    <p className="text-[9px] text-[#cdc3d4]/40 uppercase tracking-widest">Prix catalogue</p>
                    <p className="font-extrabold text-lg text-white mt-1">{formatMoney(nego.product_asking_price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-[#ffb2bc] uppercase tracking-widest font-bold">Proposition active</p>
                    <p className="font-black text-2xl text-[#ffb2bc] mt-1 drop-shadow-[0_0_8px_rgba(255,178,188,0.2)]">
                      {formatMoney(nego.offered_price)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTROL PANEL - Action Center depending on status & role */}
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 mt-auto border border-white/10 relative overflow-hidden">
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb2bc] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffb2bc]"></span>
              </span>

              {nego.status === 'pending' && (
                <>
                  {isBuyer ? (
                    <div className="space-y-4 text-center">
                      <h3 className="font-mono text-[10px] text-[#cdc3d4]/60 uppercase tracking-widest font-bold">
                        En attente de réponse du vendeur
                      </h3>
                      <div className="bg-[#131313]/60 p-4 border border-white/5 rounded-xl text-left space-y-1.5 font-mono text-[10px] text-[#cdc3d4]/70">
                        <p>• Votre offre : <strong className="text-white">{formatMoney(nego.offered_price)}</strong></p>
                        <p>• Statut : <span className="text-[#bb86fc]">Proposition transmise</span></p>
                      </div>
                      <p className="text-[9px] font-mono text-zinc-500 italic">
                        Le vendeur @{nego.seller_username} a été notifié par messagerie sécurisée.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h3 className="font-mono text-[10px] text-[#cdc3d4]/60 uppercase tracking-widest font-bold text-center">
                        Offre reçue de @{nego.buyer_username}
                      </h3>
                      
                      <button 
                        onClick={() => handleNegotiationAction('accept')}
                        className="w-full bg-[#bb86fc] text-black font-mono text-xs font-bold py-3.5 rounded-xl uppercase tracking-widest shadow-[0_0_15px_rgba(187,134,252,0.35)] hover:bg-[#cba2ff] transition-all active:scale-[0.98] cursor-pointer"
                      >
                        Accepter l'offre ({formatMoney(nego.offered_price)})
                      </button>

                      <button 
                        onClick={() => setShowCounterModal(true)}
                        className="w-full bg-transparent text-[#ffb2bc] font-mono text-xs font-bold py-3.5 rounded-xl uppercase tracking-widest border border-[#ffb2bc]/30 hover:bg-[#ffb2bc]/5 transition-all active:scale-[0.98] cursor-pointer flex justify-center items-center gap-1.5"
                      >
                        Contre-proposer
                      </button>

                      <button 
                        onClick={() => handleNegotiationAction('reject')}
                        className="w-full bg-transparent hover:bg-red-500/5 text-red-400 font-mono text-[10px] font-bold py-2 rounded-lg uppercase tracking-wider cursor-pointer border border-transparent transition-colors"
                      >
                        Refuser la négociation
                      </button>
                    </div>
                  )}
                </>
              )}

              {nego.status === 'counter_offer' && (
                <>
                  {isBuyer ? (
                    <div className="space-y-3">
                      <div className="text-center mb-2">
                        <span className="bg-[#ffb2bc]/10 text-[#ffb2bc] font-mono text-[9px] font-bold px-2.5 py-1 rounded-full border border-[#ffb2bc]/25 uppercase tracking-wider animate-pulse">
                          Contre-offre reçue !
                        </span>
                        <h3 className="font-mono text-[10px] text-[#cdc3d4]/60 uppercase tracking-widest mt-3">
                          Proposition de @{nego.seller_username} : <strong className="text-white">{formatMoney(nego.offered_price)}</strong>
                        </h3>
                      </div>

                      <button 
                        onClick={() => handleNegotiationAction('accept')}
                        className="w-full bg-[#bb86fc] text-black font-mono text-xs font-bold py-3.5 rounded-xl uppercase tracking-widest shadow-[0_0_15px_rgba(187,134,252,0.35)] hover:bg-[#cba2ff] transition-all active:scale-[0.98] cursor-pointer"
                      >
                        Accepter la contre-offre
                      </button>

                      <button 
                        onClick={() => setShowCounterModal(true)}
                        className="w-full bg-transparent text-[#ffb2bc] font-mono text-xs font-bold py-3.5 rounded-xl uppercase tracking-widest border border-[#ffb2bc]/30 hover:bg-[#ffb2bc]/5 transition-all active:scale-[0.98] cursor-pointer flex justify-center items-center gap-1.5"
                      >
                        Surenchérir / Négocier
                      </button>

                      <button 
                        onClick={() => handleNegotiationAction('reject')}
                        className="w-full bg-transparent hover:bg-red-500/5 text-red-400 font-mono text-[10px] font-bold py-2 rounded-lg uppercase tracking-wider cursor-pointer border border-transparent transition-colors"
                      >
                        Décliner et fermer
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 text-center">
                      <h3 className="font-mono text-[10px] text-[#cdc3d4]/60 uppercase tracking-widest font-bold">
                        Contre-offre envoyée à l'acheteur
                      </h3>
                      <div className="bg-[#131313]/60 p-4 border border-white/5 rounded-xl text-left space-y-1.5 font-mono text-[10px] text-[#cdc3d4]/70">
                        <p>• Votre contre-proposition : <strong className="text-white">{formatMoney(nego.offered_price)}</strong></p>
                        <p>• Statut : <span className="text-[#ffb2bc]">En attente de l'acheteur</span></p>
                      </div>
                      <p className="text-[9px] font-mono text-zinc-500 italic">
                        L'acheteur a reçu votre nouvelle offre.
                      </p>
                    </div>
                  )}
                </>
              )}

              {nego.status === 'accepted' && (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                    <Check size={24} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-green-400 uppercase italic tracking-wider">Négociation conclue !</h3>
                    <p className="text-[10px] font-mono text-[#cdc3d4]/60 mt-1 uppercase">Accord trouvé à {formatMoney(nego.offered_price)}</p>
                  </div>
                  
                  {isBuyer ? (
                    <button 
                      onClick={() => onNavigate('checkout', {
                        type: 'negotiation',
                        items: [{
                          id: nego.product_id,
                          name: `Négociation validée : ${nego.product_brand} ${nego.product_model}`,
                          price: parseFloat(nego.offered_price),
                          image: nego.product_image,
                          qty: 1
                        }]
                      })}
                      className="w-full bg-green-500 text-black font-mono text-xs font-black py-3.5 rounded-xl uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.35)] hover:bg-green-400 transition-all active:scale-[0.98] cursor-pointer"
                    >
                      Paiement sécurisé ({formatMoney(nego.offered_price)})
                    </button>
                  ) : (
                    <div className="bg-[#131313]/60 p-3.5 border border-white/5 rounded-xl font-mono text-[9px] text-[#cdc3d4]/70 leading-relaxed">
                      L'acheteur a été invité à régler le montant via notre système d'entiercement sécurisé. Vous recevrez une notification dès que les fonds seront bloqués.
                    </div>
                  )}
                </div>
              )}

              {nego.status === 'rejected' && (
                <div className="space-y-3 text-center py-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center mx-auto text-zinc-500">
                    <Ban size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-400 uppercase tracking-widest">Négociation Close</h3>
                    <p className="text-[9px] font-mono text-zinc-600 mt-1">Aucun accord n'a pu être trouvé.</p>
                  </div>
                  <button 
                    onClick={() => onNavigate('home')}
                    className="w-full bg-[#1c1b1b]/50 border border-white/5 text-zinc-400 font-mono text-[9px] py-2 rounded-lg uppercase tracking-wider"
                  >
                    Retour au catalogue
                  </button>
                </div>
              )}

              {/* Escrow Disclaimer */}
              <div className="border-t border-white/5 pt-4 flex gap-2.5 items-start text-[#cdc3d4]/50 text-[9px] font-mono leading-relaxed mt-2">
                <Landmark size={15} className="text-[#17deca] shrink-0 mt-0.5" />
                <p>Protection Escrow Nova Guard active. Le montant final est bloqué en séquestre neutre jusqu'à livraison.</p>
              </div>

            </div>
          </aside>

          {/* RIGHT MESSAGING VIEW (2/3 columns) - Full chat integrated with negotiations */}
          <section className="lg:col-span-8 bg-[#1c1b1b]/80 border border-white/10 backdrop-blur-md rounded-2xl flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.4)] h-full min-h-0 relative">
            
            {/* Chat Header */}
            <div className="h-20 border-b border-white/5 flex justify-between items-center px-6 bg-black/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#131313] border border-[#bb86fc]/20 flex items-center justify-center font-bold text-xs text-[#bb86fc]">
                  {((isBuyer ? nego.seller_username : nego.buyer_username) || "Pilote").substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white uppercase tracking-wider font-mono">
                    @{isBuyer ? nego.seller_username : nego.buyer_username}
                  </h4>
                  <p className="text-[9px] text-[#cdc3d4]/50 font-mono mt-0.5">
                    {isBuyer ? nego.seller_email : nego.buyer_email}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[9px] text-[#17deca] uppercase tracking-widest font-mono">
                  <Circle size={8} className="fill-[#17deca] animate-pulse" /> Live chat connecté
                </span>
              </div>
            </div>

            {/* Chat Messages flow with system event cards in between */}
            <div className="flex-grow overflow-y-auto p-6 space-y-5 bg-surface/10 custom-scrollbar">
              
              {/* System Session Start message */}
              <div className="flex justify-center">
                <span className="font-mono text-[9px] text-[#cdc3d4]/35 bg-[#131313] border border-white/5 px-3 py-1 rounded-full uppercase tracking-widest font-bold">
                  Négociation P2P Initialisée • {new Date(nego.created_at).toLocaleDateString()}
                </span>
              </div>

              {messages.map((msg, index) => {
                const isMe = parseInt(msg.sender_id) === currentUserId;
                const msgText = msg.message || "";
                const isSystemText = msgText.includes("NÉGOCIATION ACCEPTÉE") || msgText.includes("contre-proposition") || msgText.includes("refusée");

                // Render negotiation system cards uniquely in the flow
                if (isSystemText) {
                  const isAccepted = msg.message.includes("ACCEPTÉE");
                  const isRefused = msg.message.includes("refusée");
                  return (
                    <div key={msg.id} className="flex justify-center my-3 animate-in fade-in duration-200">
                      <div className={`glass-panel border rounded-xl p-4 flex items-center gap-3.5 max-w-md ${
                        isAccepted 
                          ? 'border-green-500/40 bg-green-950/10 shadow-[0_0_15px_rgba(34,197,94,0.1)] text-green-300' 
                          : isRefused
                            ? 'border-zinc-700 bg-zinc-900/10 text-zinc-400'
                            : 'border-[#ffb2bc]/30 bg-[#7e273b]/5 shadow-[0_0_12px_rgba(255,178,188,0.08)] text-[#ff97a7]'
                      }`}>
                        {isAccepted ? (
                          <Check size={18} className="text-green-400 shrink-0 animate-bounce" />
                        ) : (
                          <DollarSign size={18} className="text-[#ffb2bc] shrink-0 animate-pulse" />
                        )}
                        <div className="font-mono text-[10px] leading-relaxed">
                          <p className="font-bold uppercase tracking-wider mb-0.5">{isAccepted ? 'Accord Trouvé' : 'Alerte Offre'}</p>
                          <p>{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Render standard chat messages
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 font-sans text-xs relative ${
                      isMe 
                        ? 'bg-gradient-to-br from-primary/20 to-[#bb86fc]/10 border border-[#bb86fc]/20 text-white rounded-br-none shadow-[0_0_12px_rgba(187,134,252,0.03)]' 
                        : 'bg-[#131313]/90 border border-white/5 text-[#e5e2e1] rounded-bl-none'
                    }`}>
                      <p className="leading-relaxed break-words">{msg.message}</p>
                      
                      <div className="flex justify-between items-center mt-2 text-[8px] font-mono text-[#cdc3d4]/30 gap-6">
                        <span>
                          {msg.created_at && msg.created_at.includes(' ') ? msg.created_at.split(' ')[1].substring(0, 5) : ''}
                        </span>
                        {isMe && (
                          <span className={msg.is_read ? 'text-[#17deca]' : 'text-zinc-500'}>
                            {msg.is_read ? 'Lu ✓' : 'Envoyé'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input footer area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-black/10">
              <div className="flex items-center gap-3 bg-[#131313] p-2 rounded-xl border border-white/10 focus-within:border-[#bb86fc] transition-all">
                <input 
                  type="text"
                  required
                  placeholder="Écrire un message ou discuter de l'offre..."
                  className="flex-grow bg-transparent border-none text-white focus:outline-none focus:ring-0 text-xs px-3 py-2 font-sans placeholder-zinc-700"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!newMessageText.trim() || sending}
                  className="p-3 bg-[#bb86fc] text-black rounded-xl hover:bg-[#cba2ff] transition-all cursor-pointer active:scale-95 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed border-none shrink-0"
                >
                  {sending ? <Loader2 className="animate-spin" size={15} /> : <Send size={15} />}
                </button>
              </div>
            </form>

          </section>

        </div>
      </main>

      {/* COUNTER OFFER MODAL (Styled in premium Glassmorphism & Cyberpunk Neon) */}
      {showCounterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-[#ffb2bc]/30 p-8 shadow-[0_0_50px_rgba(255,178,188,0.2)] relative animate-in fade-in zoom-in-95 duration-200">
            <span className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-[#bb86fc] animate-pulse"></span>
            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#ffb2bc] animate-pulse"></span>
            
            <button 
              onClick={() => setShowCounterModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#ffb2bc]/10 border border-[#ffb2bc]/20 shadow-[0_0_15px_rgba(255,178,188,0.2)] flex items-center justify-center mx-auto text-[#ffb2bc]">
                <DollarSign size={24} />
              </div>
              
              <h3 className="text-lg font-black italic tracking-tighter uppercase text-white font-mono">
                {isBuyer ? "Saisir une Surenchère" : "Formuler une Contre-Offre"}
              </h3>
              
              <p className="text-xs text-[#cdc3d4]/70 font-mono">
                {isBuyer 
                  ? "Saisissez votre nouvelle offre d'achat pour convaincre le vendeur."
                  : "Proposez un nouveau tarif d'achat immédiat à l'acheteur."}
              </p>

              <div className="space-y-4 pt-4">
                <div className="relative rounded-xl bg-[#131313] border border-white/10 focus-within:border-[#ffb2bc] transition-all">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-zinc-600 font-extrabold text-sm">EUR (€)</span>
                  <input 
                    type="number"
                    required
                    min="1"
                    className="w-full bg-transparent border-none text-right font-mono font-bold text-white text-lg pr-4 pl-20 py-3.5 focus:outline-none focus:ring-0"
                    placeholder="0"
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(e.target.value)}
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => setShowCounterModal(false)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 rounded-xl font-bold font-mono text-xs uppercase tracking-wider"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleNegotiationAction('counter', counterPrice)}
                    disabled={!counterPrice || updatingNego}
                    className="flex-1 py-3 bg-gradient-to-r from-[#bb86fc] to-[#ffb2bc] text-black font-extrabold font-mono text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(255,178,188,0.3)] disabled:opacity-50"
                  >
                    {updatingNego ? <Loader2 className="animate-spin mx-auto" size={15} /> : "Transmettre"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Negotiation;
