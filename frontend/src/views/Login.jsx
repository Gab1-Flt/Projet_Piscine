import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, Shield, Sparkles, User, Users } from 'lucide-react';
import { mockUsers, testCredentials } from '../data/mockData';

const readStoredList = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (e) {
    return [];
  }
};

const roleConfig = {
  utilisateur: {
    label: 'Compte',
    icon: User,
    color: 'primary',
    defaultEmail: 'driver@mercatonova.com',
    defaultPassword: 'nova1234',
  },
  admin: {
    label: 'Admin',
    icon: Shield,
    color: 'secondary',
    defaultEmail: 'admin@mercatonova.com',
    defaultPassword: 'admin123',
  },
  directeur: {
    label: 'Directeur',
    icon: Users,
    color: 'tertiary',
    defaultEmail: 'directeur@mercatonova.com',
    defaultPassword: 'boss123',
  },
};

function Login({ onLogin, onBack }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState('utilisateur');
  const [email, setEmail] = useState(roleConfig.utilisateur.defaultEmail);
  const [password, setPassword] = useState(roleConfig.utilisateur.defaultPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRoleChange = (selectedRole) => {
    const config = roleConfig[selectedRole];
    setRole(selectedRole);
    setError('');
    if (!isRegistering) {
      setEmail(config.defaultEmail);
      setPassword(config.defaultPassword);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      if (password !== confirmPassword) {
        setError('Les deux cles doivent etre identiques.');
        return;
      }

      alert("Inscription reussie (simulation). Le compte est cree cote maquette, l'ecriture MySQL viendra avec l'API PHP.");
      setIsRegistering(false);
      setPassword(roleConfig[role].defaultPassword);
      return;
    }

    const deletedEmails = readStoredList('mn_deleted_emails');
    const bannedEmails = readStoredList('mn_banned_emails');
    const account = mockUsers.find((candidate) => candidate.email === email && candidate.password === password);

    if (!account) {
      setError('Identifiants invalides pour cette maquette.');
      return;
    }

    if (account.role !== role) {
      setError('Le role selectionne ne correspond pas a ce compte.');
      return;
    }

    if (deletedEmails.includes(account.email)) {
      setError('Ce compte a ete supprime de la base de donnees simulee.');
      return;
    }

    if (account.status === 'banned' || bannedEmails.includes(account.email)) {
      setError('Compte banni : connexion refusee et retour au catalogue invite.');
      return;
    }

    const { password: _, ...safeAccount } = account;
    onLogin(safeAccount);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#e5e2e1] flex flex-col justify-between font-sans relative overflow-hidden selection:bg-primary selection:text-[#460283]">
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD9xSbF6527-FBAfTaA77glLnF4kOMFit4fHRUSQtDazvqz7Lx0D-VIReMEKv0egNk5Lz40PhqS4oTutfbpriqYBfPaP6hJ1gCeJduWHRVRnMOEWchE5fnUpNrMwEhzLz965P9uM-8XSm3YqRMUBtwE-ZFueMowk3YLv0DfmW00f2lQ4u803kw9RaKg0--4LdNdVsHqsqgzTBMRw8pBpsuLBsUJ4AnX9DT8hIa7n9dfrSkek3AwuYZKWeaumhVlOTEg5mJVMEFEgRRn')" }}></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent z-0"></div>
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none z-0"></div>

      <header className="relative w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center z-10">
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
          type="button"
          onClick={onBack}
          className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#cdc3d4] hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} />
          Retour catalogue
        </button>
      </header>

      <main className="flex-grow flex items-center justify-center relative z-10 px-4 py-8">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-[12px] border border-white/10 rounded-2xl p-8 md:p-10 shadow-[0_0_40px_rgba(0,0,0,0.6)] relative">
          <span className="absolute top-3 left-3 w-1 h-1 rounded-full bg-[#bb86fc] animate-pulse"></span>
          <span className="absolute top-3 right-3 w-1 h-1 rounded-full bg-[#17deca] animate-pulse"></span>

          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-1.5 bg-[#bb86fc]/10 text-[#bb86fc] px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase mb-3 border border-[#bb86fc]/20">
              <Sparkles size={11} />
              <span>{isRegistering ? 'Creation de compte' : 'Acces securise'}</span>
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter text-[#dab9ff] font-headline-lg uppercase">
              MERCATO <span className="text-[#ffb2bc]">NOVA</span>
            </h1>
            <p className="text-xs text-[#cdc3d4]/70 mt-2 font-mono">
              Connecte-toi pour acheter, vendre, enchérir ou moderer selon ton role.
            </p>
          </div>

          <div className="p-1 bg-[#1c1b1b] border border-white/5 rounded-xl grid grid-cols-3 gap-1 mb-6 font-mono text-[10px] uppercase font-bold">
            {Object.entries(roleConfig).map(([roleId, config]) => {
              const RoleIcon = config.icon;
              const active = role === roleId;
              const activeClass = config.color === 'secondary'
                ? 'bg-secondary text-[#400013] shadow-[0_0_10px_rgba(255,178,188,0.25)]'
                : config.color === 'tertiary'
                  ? 'bg-tertiary text-[#003b35] shadow-[0_0_10px_rgba(23,222,202,0.22)]'
                  : 'bg-primary text-[#460283] shadow-[0_0_10px_rgba(187,134,252,0.25)]';

              return (
                <button
                  key={roleId}
                  type="button"
                  onClick={() => handleRoleChange(roleId)}
                  className={`py-2.5 rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer transition-all ${active ? activeClass : 'text-[#cdc3d4]/70 hover:text-[#e5e2e1]'}`}
                >
                  <RoleIcon size={12} />
                  <span>{config.label}</span>
                </button>
              );
            })}
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs font-mono text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegistering && (
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-[#cdc3d4]/50 uppercase tracking-widest font-mono" htmlFor="username">
                  Nom de pilote / pseudo
                </label>
                <div className="relative rounded-lg border border-white/10 input-glow bg-[#1c1b1b] transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-600">
                    <User size={16} />
                  </div>
                  <input
                    required
                    id="username"
                    type="text"
                    className="w-full bg-transparent border-none py-3.5 pl-11 pr-4 text-xs font-mono text-white focus:outline-none focus:ring-0 placeholder-zinc-700"
                    placeholder="Ex: takumi_86"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-[#cdc3d4]/50 uppercase tracking-widest font-mono" htmlFor="email">
                Adresse email
              </label>
              <div className="relative rounded-lg border border-white/10 input-glow bg-[#1c1b1b] transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-600">
                  <Mail size={16} />
                </div>
                <input
                  required
                  id="email"
                  type="email"
                  className="w-full bg-transparent border-none py-3.5 pl-11 pr-4 text-xs font-mono text-white focus:outline-none focus:ring-0 placeholder-zinc-700"
                  placeholder="driver@mercatonova.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-[#cdc3d4]/50 uppercase tracking-widest font-mono" htmlFor="password">
                Mot de passe
              </label>
              <div className="relative rounded-lg border border-white/10 input-glow bg-[#1c1b1b] transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-600">
                  <Lock size={16} />
                </div>
                <input
                  required
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full bg-transparent border-none py-3.5 pl-11 pr-11 text-xs font-mono text-white focus:outline-none focus:ring-0 placeholder-zinc-700"
                  placeholder="mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  title={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {isRegistering && (
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-[#cdc3d4]/50 uppercase tracking-widest font-mono" htmlFor="confirmPassword">
                  Confirmer le mot de passe
                </label>
                <div className="relative rounded-lg border border-white/10 input-glow bg-[#1c1b1b] transition-all">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-600">
                    <Lock size={16} />
                  </div>
                  <input
                    required
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full bg-transparent border-none py-3.5 pl-11 pr-11 text-xs font-mono text-white focus:outline-none focus:ring-0 placeholder-zinc-700"
                    placeholder="mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                    title={showConfirmPassword ? 'Masquer' : 'Afficher'}
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary text-[#460283] hover:bg-primary/90 font-bold text-xs py-4 rounded-lg uppercase tracking-wider cursor-pointer active:scale-[0.98] transition-all flex items-center justify-center space-x-2 mt-8 shadow-[0_0_20px_rgba(187,134,252,0.2)]"
            >
              <span>{isRegistering ? 'Creer le compte' : 'Se connecter'}</span>
              <ArrowRight size={14} />
            </button>

            <div className="rounded-lg border border-white/10 bg-[#1c1b1b]/70 p-3 text-[10px] font-mono text-[#cdc3d4]/70 space-y-1.5">
              <div className="font-bold uppercase text-[#cdc3d4]">Identifiants de test</div>
              {testCredentials.map((credential) => (
                <div key={`${credential.email}-${credential.label}`} className="flex justify-between gap-3">
                  <span>{credential.label}</span>
                  <span className="text-right text-[#bb86fc]">{credential.email} / {credential.password}</span>
                </div>
              ))}
            </div>

            <div className="text-center mt-6 pt-1">
              <p className="text-[9px] font-bold text-[#cdc3d4]/40 font-mono uppercase tracking-widest">
                {isRegistering ? 'Deja un compte ?' : 'Pas encore de compte ?'}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                    setPassword(isRegistering ? roleConfig[role].defaultPassword : '');
                  }}
                  className="text-primary hover:underline ml-1 font-bold bg-transparent border-none cursor-pointer focus:outline-none"
                >
                  {isRegistering ? 'Se connecter' : "S'inscrire"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </main>

      <footer className="relative w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center text-[10px] text-[#cdc3d4]/30 font-mono z-10">
        <p>2026 Mercato Nova. Projet ECE ING2.</p>
        <div className="flex items-center space-x-1">
          <Shield size={12} />
          <span>Acces securise par role</span>
        </div>
      </footer>
    </div>
  );
}

export default Login;
