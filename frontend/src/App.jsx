import React, { useEffect, useState } from 'react';
import Login from './views/Login';
import Home from './views/Home';
import AuctionsList from './views/AuctionsList';
import Auction from './views/Auction';
import Preparation from './views/Preparation';
import Checkout from './views/Checkout';
import Account from './views/Account';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { mockUsers } from './data/mockData';

const readStoredList = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (e) {
    return [];
  }
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Navigation réactive entre catalogue, liste des enchères, préparation, et paiement
  const [currentView, setCurrentView] = useState('home'); 
  const [activeAuctionProduct, setActiveAuctionProduct] = useState(null);
  const [popup, setPopup] = useState(null); // { title: string, message: string, onClose?: () => void }

  // État du panier d'achat synchronisé globalement
  const [cartItems, setCartItems] = useState([]);

  // Données de transaction au moment de passer à la caisse
  const [checkoutData, setCheckoutData] = useState(null);

  // Gestion du panier global
  const handleAddToCart = (product) => {
    if (!cartItems.some(item => item.id === product.id)) {
      setCartItems(prev => [...prev, product]);
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Gestionnaire de navigation enrichi avec passage de paramètres
  const handleNavigate = (view, data = null) => {
    if (data) {
      setCheckoutData(data);
    }
    setCurrentView(view);
  };

  // Charger la session persistante au démarrage
  useEffect(() => {
    try {
      const active = localStorage.getItem('mn_session_active') === 'true';
      const email = localStorage.getItem('mn_session_email');
      const role = localStorage.getItem('mn_session_role');
      const bannedEmails = readStoredList('mn_banned_emails');
      const deletedEmails = readStoredList('mn_deleted_emails');

      if (active && email && role && !bannedEmails.includes(email) && !deletedEmails.includes(email)) {
        const storedUser = mockUsers.find((account) => account.email === email);
        setUser(storedUser ? { ...storedUser, password: undefined } : { email, role });
        setIsLoggedIn(true);
      } else if (active) {
        localStorage.removeItem('mn_session_active');
        localStorage.removeItem('mn_session_email');
        localStorage.removeItem('mn_session_role');
      }
    } catch (e) {
      console.error('Erreur de lecture de la session locale :', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Gérer la connexion
  const handleLogin = (userData) => {
    const storedUser = mockUsers.find((account) => account.email === userData.email);
    const fullUser = storedUser ? { ...storedUser, password: undefined } : userData;
    setUser(fullUser);
    setIsLoggedIn(true);
    setCurrentView('home');
    try {
      localStorage.setItem('mn_session_active', 'true');
      localStorage.setItem('mn_session_email', fullUser.email);
      localStorage.setItem('mn_session_role', fullUser.role);
    } catch (e) {
      console.error('Erreur de sauvegarde de la session locale :', e);
    }
  };

  // Gérer la déconnexion
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView('home');
    setActiveAuctionProduct(null);
    setCartItems([]);
    setCheckoutData(null);
    try {
      localStorage.removeItem('mn_session_active');
      localStorage.removeItem('mn_session_email');
      localStorage.removeItem('mn_session_role');
    } catch (e) {
      console.error('Erreur de nettoyage de la session locale :', e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center font-mono text-xs text-[#cdc3d4]/50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 rounded-full border-2 border-t-primary border-white/10 animate-spin"></div>
          <span className="tracking-widest uppercase animate-pulse">Initialisation du Réseau...</span>
        </div>
      </div>
    );
  }

  // Protection des pages importantes (Enchères en cours, Enchère Live, etc.)
  const activeView = (!isLoggedIn && currentView !== 'home' && currentView !== 'login') ? 'login' : currentView;

  return (
    <>
      {activeView === 'login' ? (
        <Login onLogin={handleLogin} onBack={() => setCurrentView('home')} />
      ) : activeView === 'home' ? (
        <Home 
          user={isLoggedIn ? user : null} 
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onLogout={handleLogout} 
          onLoginRequest={() => setCurrentView('login')}
          onSelectAuction={(product) => {
            if (!isLoggedIn) {
              setPopup({
                title: "Accès Sécurisé Requis",
                message: "Connexion requise : Vous devez vous connecter pour participer à une enchère ou faire une offre.",
                onClose: () => setCurrentView('login')
              });
              return;
            }
            console.log("App: Navigating to auction view for:", product);
            setActiveAuctionProduct(product);
            setCurrentView('auction');
          }}
          onNavigate={(view, data = null) => {
            if (!isLoggedIn && view !== 'home') {
              setPopup({
                title: "Accès Sécurisé Requis",
                message: "Connexion requise : Cet espace sécurisé requiert une clé d'accès.",
                onClose: () => setCurrentView('login')
              });
              return;
            }
            handleNavigate(view, data);
          }}
        />
      ) : activeView === 'auctions_list' ? (
        <AuctionsList
          user={user}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onLogout={handleLogout}
          onSelectAuction={(product) => {
            console.log("App: Navigating to auction view for:", product);
            setActiveAuctionProduct(product);
            setCurrentView('auction');
          }}
          onNavigate={handleNavigate}
        />
      ) : currentView === 'preparation' ? (
        <Preparation
          user={user}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      ) : currentView === 'checkout' ? (
        <Checkout
          checkoutData={checkoutData}
          onClearCart={handleClearCart}
          onNavigate={handleNavigate}
        />
      ) : activeView === 'account' ? (
        <Account
          user={user}
          onUpdateUser={(updatedData) => setUser(prev => ({ ...prev, ...updatedData }))}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      ) : (
        <Auction 
          user={user} 
          product={activeAuctionProduct} 
          onBack={() => handleNavigate('auctions_list')} 
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}

      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-[#ffb2bc]/30 p-8 shadow-[0_0_50px_rgba(255,178,188,0.2)] animate-in fade-in zoom-in-95 duration-200 relative">
            <span className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-[#bb86fc] animate-pulse"></span>
            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#ffb2bc] animate-pulse"></span>
            
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#ffb2bc]/10 text-[#ffb2bc] border border-[#ffb2bc]/20 shadow-[0_0_15px_rgba(255,178,188,0.2)] flex items-center justify-center mx-auto">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-black italic tracking-tighter uppercase text-white font-headline-md">{popup.title}</h3>
              <p className="text-xs text-[#cdc3d4]/80 font-mono leading-relaxed">{popup.message}</p>
              
              <button 
                onClick={() => {
                  setPopup(null);
                  if (popup.onClose) popup.onClose();
                }}
                className="w-full mt-6 py-3 font-bold text-xs uppercase tracking-wider rounded-lg transition-all bg-[#ffb2bc] hover:brightness-110 text-[#400013]"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
