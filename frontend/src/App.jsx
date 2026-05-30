import React, { useState, useEffect } from 'react';
import Login from './views/Login';
import Home from './views/Home';
import AuctionsList from './views/AuctionsList';
import Auction from './views/Auction';
import Preparation from './views/Preparation';
import Checkout from './views/Checkout';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Navigation réactive entre catalogue, liste des enchères, préparation, et paiement
  const [currentView, setCurrentView] = useState('home'); 
  const [activeAuctionProduct, setActiveAuctionProduct] = useState(null);

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

      if (active && email && role) {
        setUser({ email, role });
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.error("Erreur de lecture de la session locale :", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Gérer la connexion
  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentView('home');
    try {
      localStorage.setItem('mn_session_active', 'true');
      localStorage.setItem('mn_session_email', userData.email);
      localStorage.setItem('mn_session_role', userData.role);
    } catch (e) {
      console.error("Erreur de sauvegarde de la session locale :", e);
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
      console.error("Erreur de nettoyage de la session locale :", e);
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

  return (
    <>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : currentView === 'home' ? (
        <Home 
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
      ) : currentView === 'auctions_list' ? (
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
      ) : (
        <Auction 
          user={user} 
          product={activeAuctionProduct} 
          onBack={() => handleNavigate('auctions_list')} 
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
}

export default App;
