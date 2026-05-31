import React, { useState, useEffect } from 'react';
import { Database, AlertTriangle, RefreshCw, Settings, Sliders, Tag, Calendar, Gauge, Check } from 'lucide-react';
import { getJDMImage } from '../../utils/jdmImages';

export default function ProductList() {
  // Available pre-configured API URLs for MAMP
  const apiOptions = [
    { label: 'MAMP standard (Port 80)', value: 'http://localhost/Projet_Piscine/backend' },
    { label: 'MAMP alternatif (Port 8888)', value: 'http://localhost:8888/Projet_Piscine/backend' },
    { label: 'MAMP local (Port 8080)', value: 'http://localhost:8080/Projet_Piscine/backend' }
  ];

  // Load saved API URL or use default (standard MAMP)
  const [apiUrl, setApiUrl] = useState(() => {
    return localStorage.getItem('mn_api_url') || apiOptions[0].value;
  });

  const [customUrl, setCustomUrl] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProducts = async (targetUrl) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${targetUrl}/api/products/index.php`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success') {
        setProducts(data.data || []);
      } else {
        throw new Error(data.message || 'Erreur lors du décodage des produits');
      }
    } catch (err) {
      console.error(err);
      setError({
        message: err.message,
        url: `${targetUrl}/api/products/index.php`
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch when api url changes
  useEffect(() => {
    fetchProducts(apiUrl);
  }, [apiUrl]);

  const handleSelectUrl = (url) => {
    setApiUrl(url);
    localStorage.setItem('mn_api_url', url);
  };

  const handleCustomUrlSubmit = (e) => {
    e.preventDefault();
    if (customUrl.trim()) {
      let formattedUrl = customUrl.trim();
      if (formattedUrl.endsWith('/')) {
        formattedUrl = formattedUrl.slice(0, -1);
      }
      setApiUrl(formattedUrl);
      localStorage.setItem('mn_api_url', formattedUrl);
      setShowConfig(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchProducts(apiUrl);
  };

  // Helper for rendering sale type badges
  const getSaleTypeBadge = (saleType) => {
    switch (saleType) {
      case 'auction':
        return (
          <span className="px-2.5 py-1 rounded bg-driftgold/10 text-driftgold text-xs font-mono font-bold border border-driftgold/20 uppercase tracking-wider">
            Enchères
          </span>
        );
      case 'negotiation':
        return (
          <span className="px-2.5 py-1 rounded bg-redline/10 text-redline text-xs font-mono font-bold border border-redline/25 uppercase tracking-wider">
            Négociation
          </span>
        );
      case 'direct':
        return (
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20 uppercase tracking-wider">
            Vente Directe
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded bg-carbon-800 text-carbon-300 text-xs font-mono border border-carbon-750 uppercase tracking-wider">
            {saleType}
          </span>
        );
    }
  };

  return (
    <div className="w-full mt-12">
      {/* Header bar of the section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-carbon-700/50 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="text-redline" size={22} />
            <h2 className="text-2xl font-extrabold tracking-tight text-white uppercase font-mono">
              Live Database Showcase
            </h2>
          </div>
          <p className="text-xs text-carbon-300 mt-1 font-mono">
            Source active : <code className="text-zinc-200 bg-carbon-900 px-1.5 py-0.5 rounded border border-carbon-700">{apiUrl}/api/products/</code>
          </p>
        </div>

        <div className="flex items-center space-x-2 self-stretch sm:self-auto">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-mono border transition ${
              showConfig 
                ? 'bg-redline/10 text-redline border-redline/30' 
                : 'bg-carbon-900 text-carbon-300 border-carbon-700 hover:border-carbon-300 hover:text-white'
            }`}
          >
            <Settings size={14} className={showConfig ? 'animate-spin' : ''} />
            <span>Config API</span>
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            className="flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-mono bg-carbon-800 hover:bg-carbon-700 text-white border border-carbon-700 hover:border-carbon-300 transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Rafraîchir</span>
          </button>
        </div>
      </div>

      {/* Connection Config Panel */}
      {showConfig && (
        <div className="mb-8 p-5 rounded-2xl glass-panel animate-fadeIn">
          <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-driftgold mb-4 flex items-center gap-2">
            <Sliders size={16} /> Paramètres de Connexion (MAMP local)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-carbon-300 mb-3">
                Sélectionnez l'URL correspondant à la configuration de votre serveur Apache MAMP :
              </p>
              <div className="space-y-2">
                {apiOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectUrl(opt.value)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl border text-xs font-mono transition flex justify-between items-center ${
                      apiUrl === opt.value
                        ? 'bg-redline/5 border-redline/40 text-white'
                        : 'bg-carbon-950/40 border-carbon-700 text-zinc-400 hover:border-carbon-300 hover:text-white'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {apiUrl === opt.value && <Check size={14} className="text-redline" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-carbon-300 mb-3">
                Ou spécifiez une URL personnalisée si vous utilisez un autre port :
              </p>
              <form onSubmit={handleCustomUrlSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="http://localhost:8888/Projet_Piscine/backend"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="flex-grow bg-carbon-950 border border-carbon-700 focus:border-redline/60 focus:outline-none rounded-xl px-4 py-2 text-xs font-mono text-white transition placeholder-carbon-700"
                />
                <button
                  type="submit"
                  className="bg-redline hover:bg-redline-hover text-white text-xs font-mono font-bold px-4 py-2 rounded-xl transition"
                >
                  Appliquer
                </button>
              </form>
              <div className="mt-4 p-3 rounded-lg bg-carbon-950/60 border border-carbon-800 text-[11px] text-zinc-400 leading-relaxed font-mono">
                <span className="text-driftgold font-bold block mb-1">Comment démarrer ?</span>
                1. Lancez vos serveurs dans l'application MAMP.<br />
                2. Importez le fichier SQL <code className="text-zinc-200 bg-carbon-900 px-1 py-0.2 rounded">database/init.sql</code> dans phpMyAdmin.<br />
                3. Configurez les accès dans <code className="text-zinc-200 bg-carbon-900 px-1 py-0.2 rounded">backend/config/database.php</code>.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content grid (Loading / Error / Success) */}
      {loading ? (
        /* Loading Skeletons */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-panel rounded-2xl overflow-hidden border border-carbon-700/40 p-4 space-y-4 animate-pulse">
              <div className="h-48 bg-carbon-900 rounded-xl w-full"></div>
              <div className="h-4 bg-carbon-900 rounded w-1/3"></div>
              <div className="h-6 bg-carbon-900 rounded w-3/4"></div>
              <div className="space-y-2 pt-2">
                <div className="h-3 bg-carbon-900 rounded w-full"></div>
                <div className="h-3 bg-carbon-900 rounded w-5/6"></div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 bg-carbon-900 rounded w-1/4"></div>
                <div className="h-8 bg-carbon-900 rounded-xl w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error Alert Box */
        <div className="p-6 rounded-2xl border border-redline/25 bg-redline/5 flex flex-col items-center text-center max-w-2xl mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-redline/10 flex items-center justify-center text-redline mb-4 border border-redline/20">
            <AlertTriangle size={24} />
          </div>
          <h4 className="text-lg font-bold text-white mb-2">Impossible de contacter l'API SQL</h4>
          <p className="text-sm text-zinc-400 mb-4 leading-relaxed font-mono">
            Une erreur s'est produite lors de la connexion à l'endpoint :<br />
            <code className="text-redline break-all bg-carbon-950 px-2 py-1 rounded block mt-2 text-xs border border-carbon-800">
              {error.url}
            </code>
          </p>
          
          <div className="text-left w-full bg-carbon-950 p-4 rounded-xl border border-carbon-800 text-xs text-zinc-300 font-mono space-y-2 mb-6">
            <span className="text-driftgold font-bold block">Solutions recommandées :</span>
            <p>• Vérifiez que <strong>MAMP</strong> est bien démarré (Apache et MySQL verts).</p>
            <p>• Assurez-vous que le projet est bien placé dans le dossier <code className="text-zinc-100 bg-carbon-900 px-1 py-0.5 rounded">htdocs/Projet_Piscine</code> de MAMP.</p>
            <p>• Essayez un autre port en ouvrant le panneau <strong>Config API</strong> ci-dessus.</p>
            <p>• Détail de l'erreur : <code className="text-red-400">{error.message}</code></p>
          </div>
          
          <button
            onClick={handleRefresh}
            className="bg-redline hover:bg-redline-hover text-white text-xs font-mono font-bold px-6 py-2.5 rounded-xl transition flex items-center gap-2"
          >
            <RefreshCw size={14} /> Réessayer la connexion
          </button>
        </div>
      ) : products.length === 0 ? (
        /* Empty Database State */
        <div className="text-center py-16 bg-carbon-900/50 rounded-2xl border border-carbon-700/30">
          <Database size={40} className="mx-auto text-carbon-700 mb-3" />
          <h4 className="text-lg font-bold text-white mb-1">Aucun produit disponible</h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            La base de données est connectée mais la table `products` semble vide ou ne contient aucun produit au statut 'available'.
          </p>
        </div>
      ) : (
        /* Real SQL Product Grid Showcase */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group relative bg-carbon-900 border border-carbon-800 hover:border-carbon-700/80 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-carbon-950"
            >
              {/* Product Image section */}
              <div className="relative h-48 sm:h-52 bg-carbon-950 overflow-hidden">
                {product.image_url ? (
                  <img 
                    src={getJDMImage(product.model, product.brand, product.image_url)} 
                    alt={`${product.brand} ${product.model}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-carbon-800 text-carbon-700">
                    <Tag size={32} />
                    <span className="text-xs mt-1 font-mono">No Image</span>
                  </div>
                )}
                
                {/* Sale type badge pinned at top right */}
                <div className="absolute top-3 right-3 z-10">
                  {getSaleTypeBadge(product.sale_type)}
                </div>

                {/* Overlay indicating product type (e.g. vehicle vs part) */}
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-0.5 rounded bg-carbon-950/80 backdrop-blur-sm text-[10px] font-mono text-zinc-300 border border-carbon-700 uppercase tracking-widest">
                    {product.product_type === 'vehicle' ? '🚗 Véhicule' : '⚙️ Pièce'}
                  </span>
                </div>
              </div>

              {/* Product Content Card */}
              <div className="p-5 flex flex-col justify-between h-[210px]">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] text-driftgold font-mono font-bold uppercase tracking-widest">
                      {product.brand}
                    </span>
                    <span className="text-[11px] text-zinc-400 bg-carbon-800 px-2 py-0.5 rounded font-mono border border-carbon-700/50">
                      {product.category_name}
                    </span>
                  </div>
                  
                  <h3 className="font-extrabold text-white text-lg group-hover:text-redline transition leading-snug line-clamp-1">
                    {product.title}
                  </h3>
                  
                  <p className="text-xs text-carbon-300 line-clamp-2 mt-2 leading-relaxed h-8">
                    {product.description}
                  </p>
                </div>

                <div className="border-t border-carbon-800/80 pt-4 flex flex-col justify-end space-y-3">
                  {/* Car metrics (Year and Mileage) */}
                  <div className="flex items-center text-[11px] font-mono text-zinc-400 gap-4">
                    {product.year && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-zinc-500" />
                        {product.year}
                      </span>
                    )}
                    {product.mileage !== null && (
                      <span className="flex items-center gap-1">
                        <Gauge size={12} className="text-zinc-500" />
                        {product.mileage ? `${product.mileage.toLocaleString()} km` : 'Neuf'}
                      </span>
                    )}
                  </div>

                  {/* Pricing and Action */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-carbon-300 block uppercase font-mono tracking-wider">Prix conseillé</span>
                      <span className="text-xl font-black text-white font-mono">
                        {parseFloat(product.price).toLocaleString('fr-FR')} €
                      </span>
                    </div>
                    
                    <button className="px-3.5 py-1.5 rounded-lg bg-carbon-800 group-hover:bg-redline group-hover:text-white border border-carbon-700 group-hover:border-redline text-xs font-mono text-zinc-300 font-bold transition-all duration-200">
                      Consulter →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
