import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, ArrowLeft, Shield, Cpu, User, 
  Circle, HelpCircle, Sparkles, Loader2, UserCheck
} from 'lucide-react';

function Messages({ user, apiUrl, onNavigate, onLogout }) {
  const [threads, setThreads] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Fallback user ID for local tests if not logged in
  const currentUserId = user?.id || 5; 

  // 1. Fetch thread list and suggestions
  const fetchThreads = () => {
    fetch(`${apiUrl}/api/messages/get_threads.php?user_id=${currentUserId}`)
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          setThreads(res.data.threads || []);
          setSuggestions(res.data.suggestions || []);
          
          // Auto select first thread if none is selected
          if (!activeContact && res.data.threads && res.data.threads.length > 0) {
            setActiveContact(res.data.threads[0]);
          }
        }
      })
      .catch(err => console.error("Erreur threads:", err))
      .finally(() => setLoadingThreads(false));
  };

  useEffect(() => {
    fetchThreads();
  }, [apiUrl, currentUserId]);

  // 2. Fetch messages in active chat
  const fetchChat = (contactId) => {
    if (!contactId) return;
    fetch(`${apiUrl}/api/messages/get_chat.php?user_id=${currentUserId}&contact_id=${contactId}`)
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          setChatMessages(res.data || []);
        }
      })
      .catch(err => console.error("Erreur chat:", err));
  };

  useEffect(() => {
    if (activeContact) {
      setLoadingChat(true);
      fetchChat(activeContact.id);
      setLoadingChat(false);
      
      // Setup active polling every 3 seconds for simulated real-time replies
      const timer = setInterval(() => {
        fetchChat(activeContact.id);
      }, 3000);
      
      return () => clearInterval(timer);
    }
  }, [activeContact, currentUserId, apiUrl]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // 3. Send message handler
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeContact || sending) return;

    const textToSend = newMessageText.trim();
    setNewMessageText('');
    setSending(true);

    const payload = {
      sender_id: currentUserId,
      receiver_id: activeContact.id,
      message: textToSend
    };

    fetch(`${apiUrl}/api/messages/send.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(res => {
      if (res.status === 'success') {
        // Optimistic local update
        setChatMessages(prev => [...prev, res.data]);
        fetchThreads(); // Refresh sidebar with last message
        
        // Trigger simulated JDM Chatbot replies direct to the database!
        triggerJdmBotResponse(activeContact.id, textToSend);
      }
    })
    .catch(err => console.error("Erreur envoi:", err))
    .finally(() => setSending(false));
  };

  // 4. JDM Chatbot AI simulator (writes replies to database after 2 seconds)
  const triggerJdmBotResponse = (botId, userMsg) => {
    // Determine chatbot quotes
    let botQuote = "Réseau crypté connecté. Pilote en route.";
    
    if (botId === 5) { // Takumi Fujiwara
      const quotes = [
        "Je ne pense qu'à une seule chose en conduisant : ne pas faire déborder l'eau de mon gobelet.",
        "La Skyline ou la RX-7 sont rapides en ligne droite, mais sur les cols d'Akina, mon AE86 reste imbattable !",
        "Je viens de finir mes livraisons de tofu. Tu es chaud pour un run sur le Touge ce soir ?",
        "Mon père Bunta dit que si je commence à me soucier du compte-tours, je vais perdre ma glisse naturelle.",
        "Les jantes Volk TE37 que j'ai repérées sur le site seraient parfaites sur la Hachiroku !"
      ];
      botQuote = quotes[Math.floor(Math.random() * quotes.length)];
    } else if (botId === 6) { // Keiichi Tsuchiya (Drift King)
      const quotes = [
        "L'important ce n'est pas le moteur ou la puissance brute, c'est l'équilibre et la dérive contrôlée.",
        "Tu as vu le temps de passage de la NSX-R sur la piste de Tsukuba ? C'est absolument magique.",
        "N'oublie jamais : le sous-virage est ton ennemi, le drift est ton style de vie.",
        "Magnifique ta sélection de pièces HKS sur Mercato Nova. Ça va souffler fort dans les cylindres !",
        "Es-tu capable de garder les roues motrices fumantes sur 3 virages consécutifs ?"
      ];
      botQuote = quotes[Math.floor(Math.random() * quotes.length)];
    } else if (botId === 1) { // Gabin (Admin)
      const quotes = [
        "Le protocole d'entiercement sécurisé Nova Guard a validé ta dernière commande. Séquestre OK !",
        "Besoin d'un coup de main pour modérer tes annonces ou bannir un utilisateur suspect ?",
        "Notre serveur MAMP et notre base SQL tournent en souterrain à 99.9% de bande passante.",
        "Les clés de ton bolide importé de Yokohama sont prêtes au port. On valide dès que tu veux.",
        "Mercato Nova : l'underground de l'import JDM à portée de clic."
      ];
      botQuote = quotes[Math.floor(Math.random() * quotes.length)];
    } else { // Generic JDM Enthusiast reply
      const quotes = [
        "Le moteur RB26DETT sonne tellement bien à 8000 tours...",
        "Salut ! Est-ce que tu livres tes pièces depuis le port de Tokyo ou d'Osaka ?",
        "Je cherche un swap 2JZ-GTE complet, préviens-moi si tu as ça en stock !",
        "Prix sympa, mais est-ce que les douanes sont incluses dans ton estimation de transit ?"
      ];
      botQuote = quotes[Math.floor(Math.random() * quotes.length)];
    }

    // Call send message endpoint after 2 seconds as the BOT (sender_id = botId, receiver_id = currentUserId)
    setTimeout(() => {
      fetch(`${apiUrl}/api/messages/send.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: botId,
          receiver_id: currentUserId,
          message: botQuote
        })
      })
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success') {
          // Play a small notification sound or just let polling fetch it!
          fetchChat(botId);
          fetchThreads();
        }
      })
      .catch(err => console.error("Erreur bot response:", err));
    }, 2000);
  };

  // Helper for contact roles
  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-secondary/15 text-secondary text-[8px] font-bold uppercase tracking-wider">
          <Shield size={8} /> Admin
        </span>
      );
    }
    if (role === 'seller') {
      return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-tertiary/15 text-tertiary text-[8px] font-bold uppercase tracking-wider">
          <Cpu size={8} /> Vendeur
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-primary/15 text-primary text-[8px] font-bold uppercase tracking-wider">
        <User size={8} /> Client
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] antialiased overflow-x-hidden font-sans pt-24 selection:bg-primary selection:text-[#460283]">
      
      {/* Background Luminescent Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[150px]"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[40vw] h-[50vw] rounded-full bg-[#17deca]/5 blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjwvc3ZnPg==')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Cyberpunk Navigation Bar */}
      <nav className="bg-[#131313]/85 backdrop-blur-xl fixed top-0 w-full z-40 border-b border-white/10 shadow-[0_0_20px_rgba(187,134,252,0.1)]">
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
          
          {/* Back button */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-xs font-mono text-[#cdc3d4]/65 hover:text-white transition-colors cursor-pointer border border-white/10 rounded-lg px-4 py-2 bg-[#1c1b1b]/50 hover:bg-[#201f1f]"
          >
            <ArrowLeft size={14} />
            <span>Quitter le Hub</span>
          </button>
        </div>
      </nav>

      {/* Main Grid View */}
      <main className="relative z-10 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-4 h-[calc(100vh-8rem)] min-h-[500px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full items-stretch">
          
          {/* LEFT SIDEBAR : Contacts & Suggestions (4 columns) */}
          <aside className="md:col-span-4 bg-[#1c1b1b]/80 border border-white/10 backdrop-blur-md rounded-2xl flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            
            <div className="flex-1 flex flex-col min-h-0">
              {/* Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="text-[#bb86fc]" size={16} />
                  Canaux Réseau
                </h3>
                <span className="w-2.5 h-2.5 rounded-full bg-[#17deca] animate-pulse"></span>
              </div>

              {/* Discussions List */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                <span className="block text-[8px] font-mono text-[#cdc3d4]/30 uppercase tracking-widest px-3 py-2 font-bold">// Discussions actives</span>
                
                {loadingThreads ? (
                  <div className="py-12 text-center text-xs font-mono text-[#cdc3d4]/40 animate-pulse">
                    Accès aux canaux cryptés...
                  </div>
                ) : threads.length === 0 ? (
                  <div className="py-8 text-center text-xs font-mono text-[#cdc3d4]/30 italic px-4">
                    Aucun canal de discussion actif. Utilisez les suggestions ci-dessous !
                  </div>
                ) : (
                  threads.map((contact) => {
                    const isActive = activeContact?.id === contact.id;
                    const initials = contact.username.split('_').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                    return (
                      <div 
                        key={contact.id}
                        onClick={() => setActiveContact(contact)}
                        className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                          isActive 
                            ? 'bg-[#bb86fc]/10 border border-[#bb86fc]/20 shadow-[0_0_12px_rgba(187,134,252,0.05)]' 
                            : 'border border-transparent hover:bg-white/[0.02]'
                        }`}
                      >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-[#1c1b1b] border border-white/10 flex items-center justify-center font-bold text-xs text-[#bb86fc]">
                            {initials}
                          </div>
                          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#1c1b1b] ${
                            contact.id <= 6 ? 'bg-[#17deca]' : 'bg-zinc-600'
                          }`}></span>
                        </div>

                        {/* Thread text */}
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-xs text-white truncate">{contact.username}</span>
                            <span className="text-[8px] font-mono text-zinc-500 flex-shrink-0">
                              {contact.last_message_time ? contact.last_message_time.split(' ')[1].substring(0, 5) : ''}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-[10px] text-[#cdc3d4]/60 truncate pr-2">
                              {contact.last_message || 'Écrivez votre premier message...'}
                            </p>
                            
                            {contact.unread_count > 0 && (
                              <span className="bg-secondary text-[#400013] font-bold text-[8px] px-1.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(255,178,188,0.5)]">
                                {contact.unread_count}
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-1.5">{getRoleBadge(contact.role)}</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Suggestions list (Always at the bottom) */}
            <div className="p-3 border-t border-white/5 bg-black/10">
              <span className="block text-[8px] font-mono text-[#cdc3d4]/30 uppercase tracking-widest px-2 pb-2 font-bold">// Démarrer un canal JDM</span>
              <div className="space-y-1.5">
                {suggestions.map((sug) => {
                  const initials = sug.username.split('_').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                  return (
                    <div 
                      key={sug.id}
                      onClick={() => {
                        // Create a virtual thread object locally and select it
                        const newContact = {
                          id: sug.id,
                          username: sug.username,
                          email: sug.email,
                          role: sug.role,
                          last_message: '',
                          unread_count: 0
                        };
                        setActiveContact(newContact);
                        // Add to sidebar threads optimistically
                        setThreads(prev => {
                          if (prev.some(t => t.id === sug.id)) return prev;
                          return [newContact, ...prev];
                        });
                        setSuggestions(prev => prev.filter(t => t.id !== sug.id));
                      }}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#131313]/60 border border-white/5 hover:border-white/10 hover:bg-[#131313] transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#1c1b1b] border border-white/10 flex items-center justify-center font-bold text-[10px] text-zinc-400">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-[10px] text-white truncate">{sug.username}</div>
                          <div>{getRoleBadge(sug.role)}</div>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono text-[#bb86fc] px-2 py-0.5 rounded border border-[#bb86fc]/20 hover:bg-[#bb86fc]/5 uppercase tracking-wide">
                        Chat
                      </span>
                    </div>
                  );
                })}
                {suggestions.length === 0 && (
                  <span className="block text-[9px] font-mono text-zinc-600 italic px-2">
                    Aucun autre pilote disponible.
                  </span>
                )}
              </div>
            </div>

          </aside>

          {/* RIGHT CHAT AREA : Conversation View (8 columns) */}
          <section className="md:col-span-8 bg-[#1c1b1b]/80 border border-white/10 backdrop-blur-md rounded-2xl flex flex-col justify-between overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            
            {activeContact ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/5 bg-black/10 flex items-center justify-between font-mono">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#131313] border border-[#bb86fc]/20 flex items-center justify-center font-bold text-xs text-[#bb86fc]">
                      {activeContact.username.split('_').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white uppercase tracking-wider">{activeContact.username}</h4>
                      <p className="text-[9px] text-[#cdc3d4]/50 mt-0.5">{activeContact.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {getRoleBadge(activeContact.role)}
                    <span className="hidden sm:inline-flex items-center gap-1.5 text-[9px] text-[#17deca] uppercase tracking-widest">
                      <Circle size={8} className="fill-[#17deca]" /> En ligne
                    </span>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4">
                  {loadingChat ? (
                    <div className="py-24 text-center text-xs font-mono text-[#cdc3d4]/40 animate-pulse">
                      Chargement de l'historique sécurisé...
                    </div>
                  ) : chatMessages.length === 0 ? (
                    <div className="py-24 text-center space-y-3">
                      <Sparkles className="text-[#bb86fc] mx-auto animate-pulse" size={24} />
                      <p className="text-xs font-mono text-zinc-500">
                        Aucun message sécurisé échangé. Lancez le Touge !
                      </p>
                    </div>
                  ) : (
                    chatMessages.map((msg) => {
                      const isMe = msg.sender_id === currentUserId;
                      return (
                        <div 
                          key={msg.id}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] rounded-2xl px-4 py-3 relative group font-sans text-xs ${
                            isMe 
                              ? 'bg-gradient-to-br from-primary/30 to-[#bb86fc]/20 border border-[#bb86fc]/30 text-white rounded-br-none' 
                              : 'bg-[#131313]/90 border border-white/5 text-[#e5e2e1] rounded-bl-none'
                          }`}>
                            
                            {/* Message text */}
                            <p className="leading-relaxed break-words">{msg.message}</p>
                            
                            {/* Metadata */}
                            <div className="flex justify-between items-center mt-2 text-[8px] font-mono text-[#cdc3d4]/30 gap-6">
                              <span>
                                {msg.created_at ? msg.created_at.split(' ')[1].substring(0, 5) : ''}
                              </span>
                              {isMe && (
                                <span className={msg.is_read ? 'text-[#17deca]' : 'text-zinc-500'}>
                                  {msg.is_read ? 'Lu ✓✓' : 'Envoyé ✓'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Footer Form */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-black/10 flex gap-3 items-center">
                  <input 
                    type="text"
                    required
                    placeholder="Écrire un message crypté sur le Syndicat..."
                    className="flex-grow bg-[#131313] border border-white/10 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#bb86fc] transition-colors font-sans placeholder-zinc-700"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                  />
                  <button 
                    type="submit"
                    disabled={!newMessageText.trim() || sending}
                    className="p-3 bg-[#bb86fc] text-black rounded-xl hover:bg-[#cba2ff] hover:shadow-[0_0_12px_rgba(187,134,252,0.3)] transition-all cursor-pointer active:scale-95 flex items-center justify-center shrink-0 border-none disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed"
                    title="Envoyer"
                  >
                    {sending ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Send size={16} />
                    )}
                  </button>
                </form>
              </>
            ) : (
              // Empty View
              <div className="flex-grow flex flex-col items-center justify-center p-8 space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-[#bb86fc]/5 border border-[#bb86fc]/20 flex items-center justify-center text-[#bb86fc] animate-pulse">
                  <MessageSquare size={32} />
                </div>
                <div className="max-w-sm space-y-2">
                  <h3 className="font-extrabold text-base italic uppercase tracking-wider text-white">
                    Messagerie Sécurisée Nova Guard
                  </h3>
                  <p className="text-xs text-[#cdc3d4]/60 font-sans leading-relaxed">
                    Sélectionnez un canal actif ou commencez une nouvelle discussion avec un pilote suggéré pour négocier des bolides ou échanger des pièces JDM.
                  </p>
                </div>
              </div>
            )}

          </section>

        </div>
      </main>

    </div>
  );
}

export default Messages;
