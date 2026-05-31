import React, { useState, useEffect } from 'react';
import {
  CreditCard, ShieldCheck, CheckCircle2, ArrowRight, X, Copy,
  Printer, ArrowLeft, RefreshCw, AlertTriangle, Building, Wallet,
  Info, Cpu, Landmark, HelpCircle, FileText
} from 'lucide-react';

function Checkout({ checkoutData, onClearCart, onNavigate, user, apiUrl }) {
  // Par défaut, si aucune donnée n'est fournie (accès direct), on simule un article
  const transactionType = checkoutData?.type || 'cart';
  const rawItems = checkoutData?.items || [
    { name: "Jantes RAYS Volk Racing TE37 Saga", price: 3600, image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80", qty: 1 }
  ];

  // Calculs financiers réels
  const subtotal = rawItems.reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0);
  
  // Frais logistiques JDM (15€ pour les colis pièces, 1200€ pour l'import de véhicules/preps depuis Yokohama)
  const shippingFee = transactionType === 'cart' ? 15 : 1200;
  
  // Taxes : 20% TVA
  const taxAmount = Math.round(subtotal * 0.20);
  const totalAmount = subtotal + shippingFee + taxAmount;

  // États du formulaire
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'crypto', 'bank'
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cryptoCopied, setCryptoCopied] = useState(false);
  
  // États de simulation de transaction
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Étapes successives de vérification de sécurité
  const securitySteps = [
    "Initialisation de la passerelle sécurisée Nova Guard...",
    "Vérification de l'intégrité cryptographique des données...",
    "Authentification bancaire 3D Secure 2.0 active...",
    "Séquestration des fonds sur compte de garantie bloqué...",
    "Génération de la facture cryptographique finale..."
  ];

  // Effet pour l'animation de traitement sécurisé
  useEffect(() => {
    let timer;
    if (isProcessing) {
      if (processingStep < securitySteps.length) {
        timer = setTimeout(() => {
          setProcessingStep(prev => prev + 1);
        }, 800);
      } else {
        // Fin de la transaction avec succès !
        // Enregistrer la transaction dans la base de données réelle via notre API PHP
        const payload = {
          buyer_id: user?.id || 5,
          payment_method: paymentMethod,
          transaction_type: transactionType === 'cart' ? 'direct' : transactionType
        };

        if (transactionType === 'preparation') {
          payload.is_preparation = true;
          payload.preparation_details = {
            title: `Préparation Custom JDM (${rawItems[0]?.name || 'Projet'})`,
            brand: 'JDM',
            model: 'Custom',
            price: totalAmount,
            description: `Commande de préparation JDM personnalisée comprenant : ${rawItems.map(i => i.name).join(', ')}`
          };
        } else {
          payload.items = rawItems.map(item => ({
            product_id: item.id || 7, // Produit fallback
            amount: item.price
          }));
        }

        fetch(`${apiUrl}/api/transactions/create.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(res => {
          if (!res.ok) {
            throw new Error("Erreur de communication avec la base de données.");
          }
          return res.json();
        })
        .then(data => {
          if (data.status === 'success') {
            setIsProcessing(false);
            setPaymentSuccess(true);
            // Nettoyer le panier si c'est un achat de panier
            if (transactionType === 'cart' && onClearCart) {
              onClearCart();
            }
          } else {
            throw new Error(data.message || "Erreur lors de l'enregistrement en base.");
          }
        })
        .catch(err => {
          setIsProcessing(false);
          setErrorMessage(err.message || "Impossible de joindre le serveur de base de données. Veuillez réessayer.");
        });
      }
    }
    return () => clearTimeout(timer);
  }, [isProcessing, processingStep, transactionType, onClearCart, user, apiUrl, paymentMethod, rawItems, totalAmount]);

  // Détecteur de fournisseur de carte pour afficher le bon logo néon
  const getCardProvider = () => {
    const cleanNumber = cardNumber.replace(/\s+/g, '');
    if (cleanNumber.startsWith('4')) return 'Visa';
    if (cleanNumber.startsWith('5')) return 'Mastercard';
    if (cleanNumber.startsWith('3')) return 'American Express';
    return null;
  };

  // Formater le numéro de carte (ajoute des espaces automatiquement)
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, ''); // enlever tout sauf chiffres
    let formatted = '';
    for (let i = 0; i < val.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += val[i];
    }
    setCardNumber(formatted);
  };

  // Formater la date d'expiration (MM/AA)
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    let formatted = '';
    if (val.length > 0) {
      formatted += val.substring(0, 2);
      if (val.length > 2) {
        formatted += '/' + val.substring(2, 4);
      }
    }
    setCardExpiry(formatted);
  };

  // Validation et soumission
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (paymentMethod === 'card') {
      if (!cardHolder.trim()) {
        setErrorMessage("Le nom du titulaire est requis.");
        return;
      }
      if (cardNumber.replace(/\s+/g, '').length < 16) {
        setErrorMessage("Numéro de carte invalide (16 chiffres requis).");
        return;
      }
      if (cardExpiry.length < 5) {
        setErrorMessage("Date d'expiration invalide (MM/AA requis).");
        return;
      }
      if (cardCvc.length < 3) {
        setErrorMessage("Code CVC invalide (3 chiffres requis).");
        return;
      }
    }

    // Déclencher le chargement
    setIsProcessing(true);
    setProcessingStep(0);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCryptoCopied(true);
    setTimeout(() => setCryptoCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] antialiased overflow-x-hidden font-sans pt-24 selection:bg-primary selection:text-[#460283]">
      
      {/* Gradients de fond luminescents */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[150px]"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[40vw] h-[50vw] rounded-full bg-[#17deca]/5 blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjwvc3ZnPg==')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Barre de navigation simplifiée pour maximiser la sécurité transactionnelle */}
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
          
          {/* Label de sécurité */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#17deca]">
            <ShieldCheck size={16} />
            <span className="hidden sm:inline uppercase tracking-widest">Tunnel de Paiement Chiffré</span>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="relative z-10 w-full max-w-[1100px] mx-auto px-4 md:px-8 py-8">
        
        {/* Bouton retour */}
        {!paymentSuccess && !isProcessing && (
          <button 
            onClick={() => onNavigate(transactionType === 'preparation' ? 'preparation' : transactionType === 'auction' ? 'auctions_list' : 'home')}
            className="flex items-center gap-2 text-xs font-mono text-[#cdc3d4]/65 hover:text-white transition-colors cursor-pointer mb-6 border border-white/10 rounded-lg px-3 py-1.5 bg-[#1c1b1b]/50 hover:bg-[#201f1f]"
          >
            <ArrowLeft size={14} />
            <span>Retourner au site</span>
          </button>
        )}

        {/* Écran 1 : Formulaire de Paiement & Récapitulatif */}
        {!paymentSuccess && !isProcessing && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Colonne gauche (7 cols) : Choix Paiement & Formulaire */}
            <div className="lg:col-span-7 space-y-6">
              
              <section className="bg-[#1c1b1b]/80 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
                
                <h3 className="text-lg font-bold text-white flex items-center font-mono uppercase tracking-wide border-b border-white/5 pb-4 mb-6">
                  <CreditCard className="mr-3 text-[#bb86fc]" size={18} />
                  Mode de Paiement Sécurisé
                </h3>

                {/* Boutons d'onglets de paiement */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <button 
                    onClick={() => { setPaymentMethod('card'); setErrorMessage(''); }}
                    className={`py-3.5 px-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'card' 
                        ? 'border-[#bb86fc] bg-[#bb86fc]/5 text-[#bb86fc] font-bold shadow-[0_0_12px_rgba(187,134,252,0.15)]' 
                        : 'border-white/5 bg-[#131313] text-[#cdc3d4]/70 hover:text-white hover:border-white/10'
                    }`}
                  >
                    <CreditCard size={18} />
                    <span className="text-[10px] font-mono uppercase tracking-wide">Carte Bancaire</span>
                  </button>

                  <button 
                    onClick={() => { setPaymentMethod('crypto'); setErrorMessage(''); }}
                    className={`py-3.5 px-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'crypto' 
                        ? 'border-[#17deca] bg-[#17deca]/5 text-[#17deca] font-bold shadow-[0_0_12px_rgba(23,222,202,0.15)]' 
                        : 'border-white/5 bg-[#131313] text-[#cdc3d4]/70 hover:text-white hover:border-white/10'
                    }`}
                  >
                    <Wallet size={18} />
                    <span className="text-[10px] font-mono uppercase tracking-wide">Crypto Escrow</span>
                  </button>

                  <button 
                    onClick={() => { setPaymentMethod('bank'); setErrorMessage(''); }}
                    className={`py-3.5 px-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'bank' 
                        ? 'border-[#ffb2bc] bg-[#ffb2bc]/5 text-[#ffb2bc] font-bold shadow-[0_0_12px_rgba(255,178,188,0.15)]' 
                        : 'border-white/5 bg-[#131313] text-[#cdc3d4]/70 hover:text-white hover:border-white/10'
                    }`}
                  >
                    <Landmark size={18} />
                    <span className="text-[10px] font-mono uppercase tracking-wide">Virement</span>
                  </button>
                </div>

                {/* Affichage conditionnel des formulaires */}
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  
                  {/* MESSAGE D'ERREUR */}
                  {errorMessage && (
                    <div className="border border-[#ffb2bc]/20 bg-[#ffb2bc]/5 text-[#ffb2bc] rounded-xl p-3.5 text-xs flex gap-3 items-center font-mono">
                      <AlertTriangle size={16} className="shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* FORMULAIRE 1 : CARTE BANCAIRE */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 font-mono text-xs">
                      
                      {/* Titulaire */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] text-[#cdc3d4]/40 uppercase tracking-widest block">Nom complet sur la carte</label>
                        <input 
                          type="text" 
                          required
                          placeholder="TAKUMI FUJIWARA"
                          className="w-full bg-[#131313] border border-white/10 text-white rounded-lg p-3 focus:outline-none focus:border-[#bb86fc] focus:ring-0 transition-colors placeholder-zinc-700 uppercase"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                        />
                      </div>

                      {/* Numéro de carte avec logo interactif */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] text-[#cdc3d4]/40 uppercase tracking-widest block">Numéro de carte de crédit</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            required
                            placeholder="4000 1234 5678 9010"
                            className="w-full bg-[#131313] border border-white/10 text-white rounded-lg p-3 pl-3 pr-16 focus:outline-none focus:border-[#bb86fc] focus:ring-0 transition-colors placeholder-zinc-700"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                          />
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center font-black tracking-tighter text-[#bb86fc] text-[10px] italic">
                            {getCardProvider() || <span className="text-zinc-600">CARD</span>}
                          </div>
                        </div>
                      </div>

                      {/* Exp / CVC */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] text-[#cdc3d4]/40 uppercase tracking-widest block">Date d'expiration</label>
                          <input 
                            type="text" 
                            required
                            placeholder="MM/AA"
                            className="w-full bg-[#131313] border border-white/10 text-white rounded-lg p-3 text-center focus:outline-none focus:border-[#bb86fc] focus:ring-0 transition-colors placeholder-zinc-700"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] text-[#cdc3d4]/40 uppercase tracking-widest block">Code secret (CVC)</label>
                          <input 
                            type="password" 
                            required
                            maxLength="3"
                            placeholder="•••"
                            className="w-full bg-[#131313] border border-white/10 text-white rounded-lg p-3 text-center focus:outline-none focus:border-[#bb86fc] focus:ring-0 transition-colors placeholder-zinc-700 font-sans"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                          />
                        </div>
                      </div>

                      <div className="border border-white/5 bg-white/2 rounded-xl p-3.5 flex gap-3 items-start mt-2">
                        <Info className="text-[#bb86fc] shrink-0 mt-0.5" size={14} />
                        <p className="text-[10px] text-[#cdc3d4]/60 font-sans leading-relaxed">
                          La transaction sera protégée par le système cryptographique <strong>Nova Guard Escrow</strong>. Les fonds ne seront libérés au vendeur qu'après signature finale à la réception.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* FORMULAIRE 2 : CRYPTO ESCROW */}
                  {paymentMethod === 'crypto' && (
                    <div className="space-y-4 font-mono text-xs">
                      
                      {/* Adresse de séquestre */}
                      <div className="space-y-2">
                        <label className="text-[9px] text-[#cdc3d4]/40 uppercase tracking-widest block">Adresse Ethereum / Nova Guard Séquestre</label>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-[#131313] border border-white/10 rounded-lg p-3 text-zinc-300 text-[10px] truncate select-all">
                            0xNovaGuard5421F387052637738f61EscrowSecureJDM
                          </div>
                          <button 
                            type="button"
                            onClick={() => copyToClipboard('0xNovaGuard5421F387052637738f61EscrowSecureJDM')}
                            className="px-4.5 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-[10px] font-bold"
                          >
                            {cryptoCopied ? <span className="text-[#17deca]">Copié</span> : <><Copy size={12} /><span>Copier</span></>}
                          </button>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="bg-[#17deca]/5 border border-[#17deca]/20 rounded-xl p-4 flex gap-4 items-start text-[#17deca] font-sans">
                        <Wallet size={20} className="shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wide">Paiement Cryptographique</h4>
                          <p className="text-[10px] text-[#cdc3d4]/70 mt-1 leading-relaxed">
                            Veuillez envoyer le montant exact de <strong>{totalAmount.toLocaleString()} €</strong> (valeur équivalente en USDT/ETH) à l'adresse ci-dessus. Notre réseau validera la transaction après 2 confirmations sur la blockchain.
                          </p>
                        </div>
                      </div>

                      {/* QR Code simulé */}
                      <div className="flex flex-col items-center justify-center p-4 bg-[#131313] border border-white/5 rounded-xl">
                        <div className="w-24 h-24 border border-[#17deca]/40 rounded bg-white p-1 shadow-[0_0_15px_rgba(23,222,202,0.2)] flex items-center justify-center">
                          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDUwIDUwIj48cmVjdCB3aWRoPSI1MCIgaGVpZ2h0PSI1MCIgZmlsbD0iI2ZmZiIvPjxyZWN0IHg9IjUiIHk9IjUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjM1IiB5PSI1IiB3aWRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjUiIHk9IjM1IiB3aWRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzAwMCIvPjxyZWN0IHg9IjE1IiB5PSIxNSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuNiIvPjwvc3ZnPg==')] bg-cover"></div>
                        </div>
                        <span className="text-[8px] text-[#cdc3d4]/30 uppercase font-mono tracking-widest mt-2">QR Code de transaction unique</span>
                      </div>

                    </div>
                  )}

                  {/* FORMULAIRE 3 : VIREMENT BANCAIRE */}
                  {paymentMethod === 'bank' && (
                    <div className="space-y-4 font-mono text-xs">
                      
                      {/* IBAN */}
                      <div className="bg-[#131313] border border-white/10 rounded-xl p-4 space-y-3.5">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-[9px] text-[#cdc3d4]/40 uppercase tracking-widest">Bénéficiaire</span>
                          <span className="text-white font-bold">MERCATO NOVA TOKYO ESCROW</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-[9px] text-[#cdc3d4]/40 uppercase tracking-widest">IBAN de séquestre</span>
                          <span className="text-white font-bold select-all tracking-wider text-[10px]">FR76 1026 9204 3427 2508 0675 421</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-[#cdc3d4]/40 uppercase tracking-widest">Code BIC / SWIFT</span>
                          <span className="text-white font-bold select-all tracking-wider">NOVATOKYFRXX</span>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="bg-[#ffb2bc]/5 border border-[#ffb2bc]/20 rounded-xl p-4 flex gap-4 items-start text-[#ffb2bc] font-sans">
                        <Landmark size={20} className="shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wide">Virement de compte à compte</h4>
                          <p className="text-[10px] text-[#cdc3d4]/70 mt-1 leading-relaxed">
                            Veuillez effectuer le virement de <strong>{totalAmount.toLocaleString()} €</strong> avec le libellé <strong>MN-JDM-8821</strong>. Les fonds seront bloqués de façon cryptographique et débloqués uniquement à la réception de votre commande.
                          </p>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* BOUTON DE SOUMISSION DU PAIEMENT */}
                  <button 
                    type="submit"
                    className="w-full py-4 bg-[#bb86fc] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-[#cba2ff] transition-all cursor-pointer shadow-[0_0_20px_rgba(187,134,252,0.3)] active:scale-[0.98] flex items-center justify-center font-mono mt-6 border-none"
                  >
                    <ShieldCheck size={14} className="mr-2" />
                    Procéder au Paiement Sécurisé ({totalAmount.toLocaleString()} €)
                  </button>

                </form>

              </section>

            </div>

            {/* Colonne droite (5 cols) : Récapitulatif détaillé des Achats */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-24 bg-[#1c1b1b]/95 border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-black/85">
                
                {/* En-tête récap */}
                <div className="p-6 border-b border-white/5 bg-[#1c1b1b]/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#bb86fc]/10 to-transparent opacity-50 pointer-events-none"></div>
                  <h3 className="text-sm font-bold text-white font-mono flex items-center relative z-10 uppercase tracking-wider">
                    <FileText className="mr-3 text-[#bb86fc]" size={18} />
                    Récapitulatif Achat
                  </h3>
                  <p className="text-[9px] font-mono text-[#cdc3d4]/40 mt-1 uppercase tracking-widest relative z-10">
                    TYPE : {transactionType.toUpperCase()}
                  </p>
                </div>

                {/* Liste des articles détaillés */}
                <div className="p-6 space-y-4 max-h-[calc(100vh-28rem)] overflow-y-auto bg-black/25">
                  {rawItems.map((item, index) => (
                    <div key={index} className="flex gap-4 items-start pb-4 border-b border-white/5 last:border-none last:pb-0">
                      
                      {/* Image de l'article */}
                      {item.image ? (
                        <div className="w-16 h-12 rounded overflow-hidden border border-white/10 shrink-0 relative bg-zinc-900">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-12 rounded bg-white/5 border border-white/10 shrink-0 flex items-center justify-center text-zinc-500 font-mono text-[9px] uppercase">
                          PART
                        </div>
                      )}

                      {/* Nom et prix */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                        <div className="flex gap-3 text-[10px] font-mono text-[#cdc3d4]/50 mt-1">
                          <span>Quantité : {item.qty || 1}</span>
                          {item.brand && <span>Marque : {item.brand}</span>}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs text-[#bb86fc] font-bold">
                          {(item.price * (item.qty || 1)).toLocaleString()} €
                        </span>
                      </div>

                    </div>
                  ))}
                </div>

                {/* Calculs financiers détaillée */}
                <div className="p-6 bg-[#131313]/90 border-t border-white/10 font-mono text-xs space-y-3">
                  
                  <div className="flex justify-between text-[#cdc3d4]/60">
                    <span>Sous-Total</span>
                    <span>{subtotal.toLocaleString()} €</span>
                  </div>

                  <div className="flex justify-between text-[#cdc3d4]/60">
                    <span>Logistique & Transit Yokohama</span>
                    <span>{shippingFee.toLocaleString()} €</span>
                  </div>

                  <div className="flex justify-between text-[#cdc3d4]/60">
                    <span>Taxes & Douanes (TVA 20%)</span>
                    <span>{taxAmount.toLocaleString()} €</span>
                  </div>

                  <div className="flex justify-between items-center text-sm font-bold text-[#17deca] pt-3.5 border-t border-white/5 mt-2">
                    <span>Total Net à Régler</span>
                    <span className="text-lg filter drop-shadow-[0_0_8px_rgba(23,222,202,0.15)]">
                      {totalAmount.toLocaleString()} €
                    </span>
                  </div>

                </div>

              </div>
            </div>

          </div>
        )}

        {/* Écran 2 : Chargement / Simulation de Paiement Sécurisé */}
        {isProcessing && (
          <div className="max-w-xl mx-auto bg-[#1c1b1b]/80 border border-white/10 backdrop-blur-md rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-6 shadow-[0_0_50px_rgba(187,134,252,0.2)] min-h-[450px]">
            
            <div className="relative w-20 h-20 mb-4">
              {/* Spinner rotatif néon */}
              <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-[#bb86fc] animate-spin shadow-[0_0_15px_rgba(187,134,252,0.3)]"></div>
              <div className="absolute inset-2 rounded-full border-4 border-white/5 border-b-[#17deca] animate-spin duration-1000"></div>
              <div className="absolute inset-0 flex items-center justify-center text-[#bb86fc]">
                <Cpu size={24} className="animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[9px] text-[#bb86fc] uppercase tracking-widest font-black animate-pulse">NOVA GUARD PROTOCOLE SÉCURISÉ ACTIF</span>
              <h3 className="text-base font-extrabold text-white tracking-wide uppercase font-mono">
                Transaction en cours de traitement...
              </h3>
            </div>

            {/* Description de l'étape active */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 w-full text-xs font-mono text-[#cdc3d4]/70 space-y-2.5 max-w-sm text-left">
              {securitySteps.map((step, idx) => {
                const isActive = idx === processingStep;
                const isPassed = idx < processingStep;
                return (
                  <div key={idx} className={`flex items-center gap-3 transition-colors ${
                    isActive ? 'text-[#17deca]' : isPassed ? 'text-zinc-500' : 'text-zinc-700'
                  }`}>
                    {isPassed ? (
                      <CheckCircle2 size={12} className="text-[#17deca]" />
                    ) : isActive ? (
                      <RefreshCw size={12} className="animate-spin text-[#17deca]" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 shrink-0"></div>
                    )}
                    <span className="truncate">{step}</span>
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] text-zinc-500 font-mono italic max-w-xs uppercase leading-relaxed">
              Ne fermez pas cette fenêtre et n'interrompez pas la connexion cryptographique du réseau.
            </p>

          </div>
        )}

        {/* Écran 3 : Succès du Paiement (Inspiré par le Panel 6 de Stitch) */}
        {paymentSuccess && (
          <main className="flex-grow flex items-center justify-center py-6 w-full max-w-[1000px] mx-auto z-10 animate-in fade-in duration-300">
            <div className="glass-panel rounded-2xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden relative shadow-[0_0_50px_rgba(23,222,202,0.15)]">
              
              {/* Decorative accent line */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#17deca] to-[#bb86fc] z-20"></div>
              
              {/* Left Side: Order Summary */}
              <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between bg-black/10">
                <div>
                  <h2 className="font-mono text-base font-bold text-[#bb86fc] mb-6 flex items-center gap-3 uppercase tracking-wider border-b border-white/5 pb-3">
                    <FileText size={18} />
                    Récépissé de Commande
                  </h2>
                  <div className="space-y-4 max-h-[220px] overflow-y-auto">
                    {/* Item list */}
                    {rawItems.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 text-xs font-sans">
                        <div className="flex-grow">
                          <h3 className="font-bold text-zinc-100">{item.name}</h3>
                          <p className="font-mono text-[10px] text-[#cdc3d4]/50 mt-0.5">Quantité : {item.qty || 1}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono text-[#bb86fc] font-bold">{(item.price * (item.qty || 1)).toLocaleString()} €</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-white/5 my-6"></div>
                  
                  {/* Totals */}
                  <div className="space-y-2.5 font-mono text-xs text-[#cdc3d4]/70">
                    <div className="flex justify-between">
                      <span>Sous-Total</span>
                      <span className="text-white">{subtotal.toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transit & Logistique</span>
                      <span className="text-white">{shippingFee.toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes & Douanes (TVA 20%)</span>
                      <span className="text-white">{taxAmount.toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between font-bold text-base pt-3.5 border-t border-white/5 text-[#17deca] mt-1.5">
                      <span>Montant Total Réglé</span>
                      <span className="filter drop-shadow-[0_0_8px_rgba(23,222,202,0.15)]">{totalAmount.toLocaleString()} €</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 space-y-2.5">
                  <span className="font-mono text-[9px] text-[#cdc3d4]/40 uppercase tracking-widest block">Mode de paiement utilisé</span>
                  <div className="flex gap-3 font-mono">
                    <div className="flex items-center gap-2 bg-[#131313] px-3.5 py-2.5 rounded-lg border border-white/10 text-xs">
                      {paymentMethod === 'card' ? (
                        <>
                          <CreditCard size={14} className="text-[#bb86fc]" />
                          <span className="text-zinc-200">CARTE BANCAIRE (•••• {cardNumber.slice(-4) || '4242'})</span>
                        </>
                      ) : paymentMethod === 'crypto' ? (
                        <>
                          <Wallet size={14} className="text-[#17deca]" />
                          <span className="text-zinc-200">CRYPTO SÉQUESTRE COCHÉ</span>
                        </>
                      ) : (
                        <>
                          <Landmark size={14} className="text-[#ffb2bc]" />
                          <span className="text-zinc-200">VIREMENT DE COMPTE SÉQUESTRE</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Success State */}
              <div className="p-8 md:p-10 flex flex-col items-center justify-center text-center relative bg-[#1c1b1b]/35">
                
                {/* Background decorative stripes */}
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(23,222,202,0.1)_10px,rgba(23,222,202,0.1)_11px)]"></div>
                
                <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
                  {/* Neon pulsing glow ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-[#17deca]/30 animate-ping duration-1000"></div>
                  <div className="absolute inset-2 rounded-full bg-[#17deca]/15 border border-[#17deca]/40 flex items-center justify-center shadow-[0_0_30px_rgba(23,222,202,0.3)]">
                    {/* Icon */}
                    <CheckCircle2 size={56} className="text-[#17deca] filter drop-shadow-[0_0_10px_#17deca]" />
                  </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase text-[#17deca] mb-2 drop-shadow-[0_0_15px_rgba(23,222,202,0.3)]">
                  PAIEMENT CONFIRMÉ !
                </h1>
                
                <p className="font-mono text-[9px] text-[#cdc3d4]/40 uppercase tracking-widest mb-4">NUMÉRO TRANSACTION : TXN-8821-APPROVED</p>
                
                <p className="text-xs text-[#cdc3d4]/70 mb-8 max-w-xs leading-relaxed">
                  Votre transaction cryptographique a été validée avec succès sur le réseau bloqué Nova Guard. Votre reçu ainsi que le contrat d'achat ont été envoyés dans votre coffre crypté.
                </p>

                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <button 
                    onClick={() => window.print()}
                    className="w-full bg-[#bb86fc] text-black font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl hover:bg-[#cba2ff] transition-all cursor-pointer active:scale-95 shadow-[0_0_15px_rgba(187,134,252,0.25)] flex items-center justify-center gap-2 border-none font-mono"
                  >
                    <Printer size={14} />
                    Imprimer le reçu
                  </button>
                  <button 
                    onClick={() => onNavigate('home')}
                    className="w-full bg-transparent text-[#17deca] border border-[#17deca] font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl hover:bg-[#17deca]/10 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 font-mono shadow-[inset_0_0_10px_rgba(23,222,202,0.05),0_0_10px_rgba(23,222,202,0.1)]"
                  >
                    Retourner au Catalogue
                  </button>
                </div>

              </div>

            </div>
          </main>
        )}

      </main>

    </div>
  );
}

export default Checkout;
