import React, { useEffect, useState } from 'react';
import Login from './views/Login';
import Home from './views/Home';
import AuctionsList from './views/AuctionsList';
import Auction from './views/Auction';
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
  
  // Navigation réactive entre catalogue, liste des enchères, et enchère live
  const [currentView, setCurrentView] = useState('home'); // 'home', 'auctions_list', 'auction', 'login'
  const [activeAuctionProduct, setActiveAuctionProduct] = useState(null);

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
          onLogout={handleLogout} 
          onLoginRequest={() => setCurrentView('login')}
          onSelectAuction={(product) => {
            if (!isLoggedIn) {
              alert("Connexion requise : Vous devez vous connecter pour participer à une enchère ou faire une offre.");
              setCurrentView('login');
              return;
            }
            console.log("App: Navigating to auction view for:", product);
            setActiveAuctionProduct(product);
            setCurrentView('auction');
          }}
          onNavigate={(view) => {
            if (!isLoggedIn && view !== 'home') {
              alert("Connexion requise : Cet espace sécurisé requiert une clé d'accès.");
              setCurrentView('login');
              return;
            }
            setCurrentView(view);
          }}
        />
      ) : activeView === 'auctions_list' ? (
        <AuctionsList
          user={user}
          onLogout={handleLogout}
          onSelectAuction={(product) => {
            console.log("App: Navigating to auction view for:", product);
            setActiveAuctionProduct(product);
            setCurrentView('auction');
          }}
          onNavigate={(view) => setCurrentView(view)}
        />
      ) : (
        <Auction 
          user={user} 
          product={activeAuctionProduct} 
          onBack={() => setCurrentView('auctions_list')} 
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

export default App;
