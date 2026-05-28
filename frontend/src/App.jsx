import React, { useEffect, useState } from 'react';
import Login from './views/Login';
import Home from './views/Home';
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
  const [showLogin, setShowLogin] = useState(false);

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

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setShowLogin(false);
    try {
      localStorage.setItem('mn_session_active', 'true');
      localStorage.setItem('mn_session_email', userData.email);
      localStorage.setItem('mn_session_role', userData.role);
    } catch (e) {
      console.error('Erreur de sauvegarde de la session locale :', e);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
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
          <span className="tracking-widest uppercase animate-pulse">Initialisation du reseau...</span>
        </div>
      </div>
    );
  }

  return showLogin && !isLoggedIn ? (
    <Login onLogin={handleLogin} onBack={() => setShowLogin(false)} />
  ) : (
    <Home
      user={isLoggedIn ? user : null}
      onLogout={handleLogout}
      onLoginRequest={() => setShowLogin(true)}
    />
  );
}

export default App;
