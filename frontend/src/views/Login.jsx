import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Zap, Shield, User, Sparkles, Eye, EyeOff } from 'lucide-react';

function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState('utilisateur'); // 'utilisateur' ou 'admin'
  const [email, setEmail] = useState('driver@mercatonova.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);

  // États pour l'inscription
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Met à jour les credentials de test quand le rôle change (seulement en mode connexion)
  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    if (!isRegistering) {
      if (selectedRole === 'admin') {
        setEmail('admin@mercatonova.com');
      } else {
        setEmail('driver@mercatonova.com');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      // Inscription simulée sans logique réelle
      alert("Inscription réussie (Simulation). Bienvenue au Syndicat ! Vous pouvez maintenant vous connecter.");
      setIsRegistering(false);
    } else {
      // Connecte instantanément sans requête API pour cette étape
      onLogin({ email, role });
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#e5e2e1] flex flex-col justify-between font-sans relative overflow-hidden selection:bg-primary selection:text-[#460283]">
      
      {/* Tokyo Skyline Neon Radial Gradients */}
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD9xSbF6527-FBAfTaA77glLnF4kOMFit4fHRUSQtDazvqz7Lx0D-VIReMEKv0egNk5Lz40PhqS4oTutfbpriqYBfPaP6hJ1gCeJduWHRVRnMOEWchE5fnUpNrMwEhzLz965P9uM-8XSm3YqRMUBtwE-ZFueMowk3YLv0DfmW00f2lQ4u803kw9RaKg0--4LdNdVsHqsqgzTBMRw8pBpsuLBsUJ4AnX9DT8hIa7n9dfrSkek3AwuYZKWeaumhVlOTEg5mJVMEFEgRRn')" }}></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent z-0"></div>
      
      {/* Ambient glowing vectors */}
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none z-0"></div>

      {/* Spacing Header */}
      <header className="relative w-full max-w-7xl mx-auto px-6 py-8 flex justify-center md:justify-start z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded bg-[#bb86fc] flex items-center justify-center font-black tracking-tighter text-[#460283] italic text-lg shadow-[0_0_12px_rgba(187,134,252,0.4)]">
            MN
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-wider text-[#dab9ff] italic uppercase">MERCATO <span className="text-[#ffb2bc]">NOVA</span></span>
            <p className="text-[9px] text-[#cdc3d4]/50 font-mono tracking-widest -mt-1 uppercase">Tokyo Underground</p>
          </div>
        </div>
      </header>

      {/* Main Login Form Container */}
      <main className="flex-grow flex items-center justify-center relative z-10 px-4 py-8">
        
        {/* Glassmorphism Card */}
        <div className="w-full max-w-md bg-white/5 backdrop-blur-[12px] border border-white/10 rounded-2xl p-8 md:p-10 shadow-[0_0_40px_rgba(0,0,0,0.6)] relative">
          
          {/* Decorative Corner LEDs */}
          <span className="absolute top-3 left-3 w-1 h-1 rounded-full bg-[#bb86fc] animate-pulse"></span>
          <span className="absolute top-3 right-3 w-1 h-1 rounded-full bg-[#17deca] animate-pulse"></span>
          
          {/* Header Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-1.5 bg-[#bb86fc]/10 text-[#bb86fc] px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase mb-3 border border-[#bb86fc]/20">
              <Sparkles size={11} />
              <span>{isRegistering ? 'Syndicate Registration' : 'Syndicate Secure Access'}</span>
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter text-[#dab9ff] font-headline-lg uppercase">
              MERCATO <span className="text-[#ffb2bc]">NOVA</span>
            </h1>
            <p className="text-xs text-[#cdc3d4]/70 mt-2 font-mono">
              {isRegistering 
                ? 'Rejoignez le syndicat et configurez votre clé d\'accès cryptée.'
                : 'Bienvenue dans le garage. Connectez-vous pour accéder au réseau underground.'}
            </p>
          </div>

          {/* Interactive Role Selector Segment Toggle */}
          <div className="p-1 bg-[#1c1b1b] border border-white/5 rounded-xl flex gap-1 mb-6 font-mono text-[10px] uppercase font-bold">
            <button
              type="button"
              onClick={() => handleRoleChange('utilisateur')}
              className={`flex-1 py-2.5 rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer transition-all ${
                role === 'utilisateur'
                  ? 'bg-primary text-[#460283] shadow-[0_0_10px_rgba(187,134,252,0.25)]'
                  : 'text-[#cdc3d4]/70 hover:text-[#e5e2e1]'
              }`}
            >
              <User size={12} />
              <span>Pilote / Vendeur</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`flex-1 py-2.5 rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer transition-all ${
                role === 'admin'
                  ? 'bg-secondary text-[#400013] shadow-[0_0_10px_rgba(255,178,188,0.25)]'
                  : 'text-[#cdc3d4]/70 hover:text-[#e5e2e1]'
              }`}
            >
              <Shield size={12} />
              <span>Administrateur</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {isRegistering && (
              /* Pseudo Input */
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-[#cdc3d4]/50 uppercase tracking-widest font-mono" htmlFor="username">
                  Nom de Pilote / Pseudo
                </label>
                <div className="relative rounded-lg border border-white/10 input-glow bg-[#1c1b1b] transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-600">
                    <User size={16} />
                  </div>
                  <input 
                    required
                    id="username" 
                    name="username"
                    type="text"
                    className="w-full bg-transparent border-none py-3.5 pl-11 pr-4 text-xs font-mono text-white focus:outline-none focus:ring-0 placeholder-zinc-700"
                    placeholder="Ex: takumi_86"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-[#cdc3d4]/50 uppercase tracking-widest font-mono" htmlFor="email">
                Adresse Email du Pilote
              </label>
              <div className="relative rounded-lg border border-white/10 input-glow bg-[#1c1b1b] transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-600">
                  <Mail size={16} />
                </div>
                <input 
                  required
                  id="email" 
                  name="email"
                  type="email"
                  className="w-full bg-transparent border-none py-3.5 pl-11 pr-4 text-xs font-mono text-white focus:outline-none focus:ring-0 placeholder-zinc-700"
                  placeholder="driver@mercatonova.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-[#cdc3d4]/50 uppercase tracking-widest font-mono" htmlFor="password">
                Clé d'Accès Cryptée
              </label>
              <div className="relative rounded-lg border border-white/10 input-glow bg-[#1c1b1b] transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-600">
                  <Lock size={16} />
                </div>
                <input 
                  required
                  id="password" 
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full bg-transparent border-none py-3.5 pl-11 pr-11 text-xs font-mono text-white focus:outline-none focus:ring-0 placeholder-zinc-700"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  title={showPassword ? "Masquer" : "Afficher"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {isRegistering && (
              /* Confirm Password Input */
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-[#cdc3d4]/50 uppercase tracking-widest font-mono" htmlFor="confirmPassword">
                  Confirmer la Clé d'Accès
                </label>
                <div className="relative rounded-lg border border-white/10 input-glow bg-[#1c1b1b] transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-600">
                    <Lock size={16} />
                  </div>
                  <input 
                    required
                    id="confirmPassword" 
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full bg-transparent border-none py-3.5 pl-11 pr-11 text-xs font-mono text-white focus:outline-none focus:ring-0 placeholder-zinc-700"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                    title={showConfirmPassword ? "Masquer" : "Afficher"}
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              className={`w-full font-bold text-xs py-4 rounded-lg uppercase tracking-wider cursor-pointer active:scale-[0.98] transition-all flex items-center justify-center space-x-2 mt-8 shadow-[0_0_20px_rgba(0,0,0,0.5)] ${
                role === 'admin'
                  ? 'bg-secondary text-[#400013] hover:bg-secondary/90 shadow-secondary/15'
                  : 'bg-primary text-[#460283] hover:bg-primary/90 shadow-primary/15'
              }`}
            >
              <span>{isRegistering ? 'Rejoindre le syndicat' : 'Entrer dans le garage'}</span>
              <ArrowRight size={14} />
            </button>

            {/* Switch Mode Toggle (Join / Log in) */}
            <div className="text-center mt-6 pt-1">
              {isRegistering ? (
                <p className="text-[9px] font-bold text-[#cdc3d4]/40 font-mono uppercase tracking-widest">
                  Déjà un compte ? 
                  <button 
                    type="button" 
                    onClick={() => { setIsRegistering(false); setPassword('••••••••'); }} 
                    className="text-primary hover:underline ml-1 font-bold bg-transparent border-none cursor-pointer focus:outline-none"
                  >
                    Se connecter
                  </button>
                </p>
              ) : (
                <p className="text-[9px] font-bold text-[#cdc3d4]/40 font-mono uppercase tracking-widest">
                  Pas encore de compte ? 
                  <button 
                    type="button" 
                    onClick={() => { setIsRegistering(true); setPassword(''); }} 
                    className="text-primary hover:underline ml-1 font-bold bg-transparent border-none cursor-pointer focus:outline-none"
                  >
                    S'inscrire
                  </button>
                </p>
              )}
            </div>

          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center text-[10px] text-[#cdc3d4]/30 font-mono z-10">
        <p>© 2026 Mercato Nova. Projet ECE ING2.</p>
        <div className="flex items-center space-x-1">
          <Shield size={12} />
          <span>Accès Sécurisé par Entiercement</span>
        </div>
      </footer>

    </div>
  );
}

export default Login;
