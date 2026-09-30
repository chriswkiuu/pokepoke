import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  BookOpen, 
  Search, 
  Trash2, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  Zap, 
  Shield, 
  Heart, 
  Swords, 
  Info, 
  RotateCcw,
  Tag,
  User,
  Compass,
  SlidersHorizontal,
  Flame,
  Droplets,
  Leaf,
  Loader2,
  Sparkle
} from 'lucide-[#1E2A44]';
import { 
  // Custom Lucide react icons fallback check
  Sparkles as SparklesIcon,
  BookOpen as BookOpenIcon,
  Search as SearchIcon,
  Trash2 as TrashIcon,
  Filter as FilterIcon,
  CheckCircle as CheckIcon,
  X as XIcon,
  ChevronRight as ChevronRightIcon,
  User as UserIcon,
  Tag as TagIcon,
  Info as InfoIcon,
  Loader2 as SpinnerIcon
} from 'lucide-react';

// Full Portuguese translations for Pokémon types
const TYPE_TRANSLATIONS = {
  normal: 'Normal', fire: 'Fogo', water: 'Água', electric: 'Elétrico',
  grass: 'Planta', ice: 'Gelo', fighting: 'Lutador', poison: 'Veneno',
  ground: 'Terra', flying: 'Voador', psychic: 'Psíquico', bug: 'Inseto',
  rock: 'Pedra', ghost: 'Fantasma', dragon: 'Dragão', dark: 'Sombrio',
  steel: 'Aço', fairy: 'Fada'
};

// Color palettes for badges and elements
const TYPE_COLORS = {
  'Normal': { bg: 'bg-gray-400', text: 'text-white', border: 'border-gray-500', hex: '#9CA3AF' },
  'Fogo': { bg: 'bg-red-500', text: 'text-white', border: 'border-red-600', hex: '#EF4444' },
  'Água': { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-600', hex: '#3B82F6' },
  'Elétrico': { bg: 'bg-amber-400', text: 'text-gray-900', border: 'border-amber-500', hex: '#F59E0B' },
  'Planta': { bg: 'bg-emerald-500', text: 'text-white', border: 'border-emerald-600', hex: '#10B981' },
  'Gelo': { bg: 'bg-cyan-400', text: 'text-gray-900', border: 'border-cyan-500', hex: '#06B6D4' },
  'Lutador': { bg: 'bg-red-700', text: 'text-white', border: 'border-red-800', hex: '#B91C1C' },
  'Veneno': { bg: 'bg-purple-600', text: 'text-white', border: 'border-purple-700', hex: '#9333EA' },
  'Terra': { bg: 'bg-amber-700', text: 'text-white', border: 'border-amber-800', hex: '#B45309' },
  'Voador': { bg: 'bg-indigo-400', text: 'text-white', border: 'border-indigo-500', hex: '#818CF8' },
  'Psíquico': { bg: 'bg-pink-500', text: 'text-white', border: 'border-pink-600', hex: '#EC4899' },
  'Inseto': { bg: 'bg-lime-500', text: 'text-white', border: 'border-lime-600', hex: '#84CC16' },
  'Pedra': { bg: 'bg-stone-500', text: 'text-white', border: 'border-stone-600', hex: '#78716C' },
  'Fantasma': { bg: 'bg-purple-800', text: 'text-white', border: 'border-purple-900', hex: '#6B21A8' },
  'Dragão': { bg: 'bg-indigo-700', text: 'text-white', border: 'border-indigo-800', hex: '#4338CA' },
  'Sombrio': { bg: 'bg-slate-800', text: 'text-white', border: 'border-slate-900', hex: '#1E293B' },
  'Aço': { bg: 'bg-slate-400', text: 'text-white', border: 'border-slate-500', hex: '#94A3B8' },
  'Fada': { bg: 'bg-pink-300', text: 'text-gray-900', border: 'border-pink-400', hex: '#F472B6' }
};

const ALL_TYPES = [
  'Normal', 'Fogo', 'Água', 'Elétrico', 'Planta', 'Gelo', 
  'Lutador', 'Veneno', 'Terra', 'Voador', 'Psíquico', 'Inseto', 
  'Pedra', 'Fantasma', 'Dragão', 'Sombrio', 'Aço', 'Fada'
];

// Initial starter catalog items to give the app immediate life
const DEFAULT_CATALOG = [
  {
    id: 25,
    uuid: 'pika-default-1',
    name: 'Pikachu',
    types: ['Elétrico'],
    primaryType: 'Elétrico',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    animatedSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif',
    height: 0.4,
    weight: 6.0,
    stats: { hp: 35, attack: 55, defense: 40, speed: 90 },
    capturedAt: new Date().toISOString()
  },
  {
    id: 6,
    uuid: 'char-default-2',
    name: 'Charizard',
    types: ['Fogo', 'Voador'],
    primaryType: 'Fogo',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png',
    animatedSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/6.gif',
    height: 1.7,
    weight: 90.5,
    stats: { hp: 78, attack: 84, defense: 78, speed: 100 },
    capturedAt: new Date().toISOString()
  },
  {
    id: 1,
    uuid: 'bulb-default-3',
    name: 'Bulbasaur',
    types: ['Planta', 'Veneno'],
    primaryType: 'Planta',
    sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    animatedSprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif',
    height: 0.7,
    weight: 6.9,
    stats: { hp: 45, attack: 49, defense: 49, speed: 45 },
    capturedAt: new Date().toISOString()
  }
];

const PokeballGraphic = ({ isLoading, isFound, sprite }) => (
  <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-2 select-none">
    {/* Background Glow */}
    <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${isFound ? 'bg-amber-300/60 scale-110' : 'bg-red-400/20'}`} />

    {/* Pokéball Container */}
    <div className={`w-36 h-36 rounded-full border-[6px] border-[#1E2A44] relative overflow-hidden bg-white shadow-2xl transition-all duration-300 ${isLoading ? 'animate-bounce' : ''}`}>
      {/* Top Red Half */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#FF1F3D] border-b-[6px] border-[#1E2A44] flex items-start justify-center pt-1">
        <div className="w-16 h-3 bg-white/20 rounded-full blur-[1px]"></div>
      </div>
      
      {/* Bottom White Half */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white"></div>
      
      {/* Center Black Line & Button */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white border-[6px] border-[#1E2A44] rounded-full z-20 flex items-center justify-center shadow-md">
        <div className={`w-4 h-4 rounded-full border-2 border-gray-400 transition-colors ${isLoading ? 'bg-yellow-400 animate-ping' : isFound ? 'bg-emerald-400' : 'bg-gray-200'}`}></div>
      </div>
    </div>

    {/* Pokémon Preview Pop-out Sprite */}
    {sprite && !isLoading && (
      <div className="absolute inset-0 z-30 flex items-center justify-center animate-in zoom-in-75 duration-300">
        <img 
          src={sprite} 
          alt="Preview" 
          className="w-32 h-32 object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] transition-all hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
          }}
        />
      </div>
    )}

    {/* Sparkles effect on found */}
    {isFound && !isLoading && (
      <div className="absolute -top-1 -right-1 z-40 text-amber-400 animate-pulse">
        <SparklesIcon size={28} />
      </div>
    )}
  </div>
);

const PokeballLogoIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="white" stroke="#1E2A44" strokeWidth="8"/>
    <path d="M 5 50 A 45 45 0 0 1 95 50" fill="#FF1F3D"/>
    <line x1="5" y1="50" x2="95" y2="50" stroke="#1E2A44" strokeWidth="8"/>
    <circle cx="50" cy="50" r="14" fill="white" stroke="#1E2A44" strokeWidth="8"/>
    <circle cx="50" cy="50" r="4" fill="#1E2A44"/>
  </svg>
);

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('capture'); // 'capture' | 'catalog'
  
  // Catalog Persistence State
  const [catalog, setCatalog] = useState(() => {
    try {
      const saved = localStorage.getItem('pokemon_catalog_pwa_v1');
      return saved ? JSON.parse(saved) : DEFAULT_CATALOG;
    } catch (e) {
      return DEFAULT_CATALOG;
    }
  });

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('pokemon_catalog_pwa_v1', JSON.stringify(catalog));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [catalog]);

  // Form & Search States
  const [inputName, setInputName] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Feedback Messages
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

  // Catalog Filter States
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogTypeFilter, setCatalogTypeFilter] = useState('Todos');
  const [selectedPokemonDetail, setSelectedPokemonDetail] = useState(null);

  // Debounced PokéAPI Query
  useEffect(() => {
    if (!inputName.trim()) {
      setApiResult(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingApi(true);
      const query = inputName.toLowerCase().trim().replace(/\s+/g, '-');
      
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        
        // Extract official types
        const typesList = data.types.map(t => TYPE_TRANSLATIONS[t.type.name] || t.type.name);
        const primaryType = typesList[0] || 'Normal';

        // Prefer animated sprite from Gen V, fallback to official artwork
        const animated = data.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default;
        const official = data.sprites?.other?.['official-artwork']?.front_default;
        const fallbackSprite = data.sprites?.front_default;

        const resultData = {
          id: data.id,
          name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
          types: typesList,
          primaryType: primaryType,
          sprite: official || fallbackSprite,
          animatedSprite: animated || official || fallbackSprite,
          height: data.height / 10,
          weight: data.weight / 10,
          stats: {
            hp: data.stats.find(s => s.stat.name === 'hp')?.base_stat || 50,
            attack: data.stats.find(s => s.stat.name === 'attack')?.base_stat || 50,
            defense: data.stats.find(s => s.stat.name === 'defense')?.base_stat || 50,
            speed: data.stats.find(s => s.stat.name === 'speed')?.base_stat || 50,
          }
        };

        setApiResult(resultData);
        // Auto-select type
        setSelectedType(primaryType);
      } catch (err) {
        setApiResult(null);
      } finally {
        setIsSearchingApi(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputName]);

  // Toast auto-clear
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle Catalog Submission
  const handleCatalogar = (e) => {
    e.preventDefault();
    if (!inputName.trim()) {
      setToast({ message: 'Digite o nome do Pokémon!', type: 'error' });
      return;
    }

    if (!selectedType && !apiResult) {
      setToast({ message: 'Selecione um tipo!', type: 'error' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const finalName = inputName.trim();
      const finalType = selectedType || 'Normal';

      // Build Pokemon entry
      const newEntry = {
        id: apiResult ? apiResult.id : Math.floor(Math.random() * 898) + 1000,
        uuid: `poke-${Date.now()}`,
        name: apiResult ? apiResult.name : finalName.charAt(0).toUpperCase() + finalName.slice(1),
        types: apiResult ? apiResult.types : [finalType],
        primaryType: apiResult ? apiResult.primaryType : finalType,
        sprite: apiResult ? apiResult.sprite : 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
        animatedSprite: apiResult ? apiResult.animatedSprite : null,
        height: apiResult ? apiResult.height : 0.5,
        weight: apiResult ? apiResult.weight : 10.0,
        stats: apiResult ? apiResult.stats : { hp: 50, attack: 50, defense: 50, speed: 50 },
        capturedAt: new Date().toISOString()
      };

      setCatalog(prev => [newEntry, ...prev]);
      setIsSubmitting(false);
      setInputName('');
      setSelectedType('');
      setApiResult(null);

      setToast({ message: `${newEntry.name} capturado com sucesso!`, type: 'success' });

      // Auto switch to catalog tab with smooth vibration if available
      if (navigator.vibrate) navigator.vibrate(50);
    }, 400);
  };

  const handleDelete = (uuid) => {
    setCatalog(prev => prev.filter(p => p.uuid !== uuid));
    if (selectedPokemonDetail?.uuid === uuid) {
      setSelectedPokemonDetail(null);
    }
    setToast({ message: 'Pokémon removido!', type: 'info' });
  };

  // Filter Catalog
  const filteredCatalog = catalog.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(catalogSearch.toLowerCase()) || 
                          String(p.id).includes(catalogSearch);
    const matchesType = catalogTypeFilter === 'Todos' || p.types.includes(catalogTypeFilter);
    return matchesSearch && matchesType;
  });

  return (
    <div className="w-full h-screen h-[100dvh] bg-slate-900 flex justify-center items-center font-['Poppins',sans-serif] antialiased overflow-hidden select-none">
      
      {/* Mobile Frame Container (Full screen on mobile, phone box on desktop) */}
      <div className="w-full max-w-md h-full sm:h-[92dvh] sm:rounded-[44px] bg-white flex flex-col relative overflow-hidden shadow-2xl border-0 sm:border-[8px] sm:border-slate-800">
        
        {}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex flex-col">
          {/* Sky Gradient */}
          <div className="h-[60%] bg-gradient-to-b from-sky-400 via-sky-300 to-blue-200 relative">
            {/* Animated Clouds */}
            <div className="absolute top-6 left-[-10%] opacity-70 animate-[float_18s_linear_infinite] text-white">
              <svg width="100" height="40" viewBox="0 0 100 40" fill="currentColor"><path d="M20 30 Q10 30 10 20 Q10 10 25 10 Q35 0 55 10 Q70 0 80 15 Q95 15 90 30 Z"/></svg>
            </div>
            <div className="absolute top-16 right-[-20%] opacity-50 animate-[float_25s_linear_infinite_delay-5s] text-white">
              <svg width="120" height="45" viewBox="0 0 100 40" fill="currentColor"><path d="M20 30 Q10 30 10 20 Q10 10 25 10 Q35 0 55 10 Q70 0 80 15 Q95 15 90 30 Z"/></svg>
            </div>
          </div>
          {/* Ground & Grass Hills */}
          <div className="h-[40%] bg-[#22C55E] relative">
            <div className="absolute -top-12 left-[-20%] w-[140%] h-24 bg-[#22C55E] rounded-[100%] shadow-[inset_0_8px_16px_rgba(0,0,0,0.08)]"></div>
            <div className="absolute top-4 left-[-10%] w-[80%] h-32 bg-emerald-600/30 rounded-[100%]"></div>
            <div className="absolute top-2 right-[-10%] w-[70%] h-32 bg-green-500/40 rounded-[100%]"></div>
          </div>
        </div>

        {}
        <header className="relative z-20 px-5 pt-4 pb-3 bg-white/90 backdrop-blur-md border-b border-gray-100 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <PokeballLogoIcon className="w-8 h-8 animate-[spin_12s_linear_infinite]" />
            <div>
              <h1 className="text-xl font-extrabold text-[#1E2A44] leading-none tracking-tight">
                Pokémon <span className="text-[#FF1F3D]">Catalog</span>
              </h1>
              <p className="text-[10px] text-gray-500 font-medium">Pokédex Mobile Edition</p>
            </div>
          </div>

          {/* Captured Count Badge */}
          <div className="bg-[#1E2A44] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{catalog.length}</span>
            <span className="text-gray-300 font-normal text-[10px]">capturados</span>
          </div>
        </header>

        {}
        <main className="flex-1 relative z-10 overflow-y-auto no-scrollbar p-4 pb-20">
          
          {/* Toast Notification Floating Alert */}
          {toast && (
            <div className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-[90%] px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border animate-in slide-in-from-top-4 duration-200 ${
              toast.type === 'success' ? 'bg-emerald-500 text-white border-emerald-400' :
              toast.type === 'error' ? 'bg-red-500 text-white border-red-400' :
              'bg-[#1E2A44] text-white border-slate-700'
            }`}>
              {toast.type === 'success' && <CheckIcon size={16} />}
              {toast.type === 'error' && <XIcon size={16} />}
              {toast.type === 'info' && <InfoIcon size={16} />}
              <span>{toast.message}</span>
            </div>
          )}

          {/* ================= ABA CAPTURAR ================= */}
          {activeTab === 'capture' && (
            <div className="flex flex-col h-full animate-in fade-in duration-300">
              
              {/* Pokéball Interactive Preview Box */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-lg border border-white/60 mb-4 text-center">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {isSearchingApi ? 'Buscando na PokéAPI...' : apiResult ? 'Pokémon Encontrado!' : 'Insira o nome abaixo'}
                </p>
                
                <PokeballGraphic 
                  isLoading={isSearchingApi} 
                  isFound={!!apiResult} 
                  sprite={apiResult ? (apiResult.animatedSprite || apiResult.sprite) : null} 
                />

                {apiResult && (
                  <div className="mt-1 animate-in fade-in">
                    <span className="text-xs font-extrabold text-gray-400">#{String(apiResult.id).padStart(3, '0')}</span>
                    <h3 className="text-lg font-black text-[#1E2A44] leading-tight">{apiResult.name}</h3>
                    <div className="flex justify-center gap-1.5 mt-1">
                      {apiResult.types.map(t => (
                        <span key={t} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[t]?.bg || 'bg-gray-400'} ${TYPE_COLORS[t]?.text || 'text-white'}`}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Input Container */}
              <form onSubmit={handleCatalogar} className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 flex flex-col gap-4">
                
                {/* Field: Nome do Pokémon */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1E2A44] flex items-center justify-between">
                    <span>Nome do Pokémon</span>
                    {isSearchingApi && <span className="text-[10px] text-sky-500 font-normal animate-pulse">Consultando API...</span>}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <UserIcon size={18} />
                    </div>
                    <input
                      type="text"
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      placeholder="Ex: Pikachu, Charizard, Mewtwo..."
                      className="w-full pl-10 pr-10 py-3 bg-gray-100/80 border border-transparent rounded-2xl text-sm font-semibold text-[#1E2A44] placeholder:text-gray-400 focus:bg-white focus:border-[#FF1F3D] focus:ring-2 focus:ring-red-100 outline-none transition-all"
                    />
                    {inputName && (
                      <button 
                        type="button" 
                        onClick={() => { setInputName(''); setApiResult(null); }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        <XIcon size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Field: Tipo Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1E2A44]">Tipo Primário</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <TagIcon size={18} />
                    </div>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-gray-100/80 border border-transparent rounded-2xl text-sm font-semibold text-[#1E2A44] focus:bg-white focus:border-[#FF1F3D] focus:ring-2 focus:ring-red-100 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Selecione o tipo...</option>
                      {ALL_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
                      <ChevronRightIcon size={18} className="rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Main Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 bg-[#FF1F3D] active:bg-[#d91430] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all text-sm"
                >
                  {isSubmitting ? (
                    <SpinnerIcon className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <BookOpenIcon size={20} />
                      <span>Catalogar Pokémon</span>
                      <ChevronRightIcon size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ================= ABA MEUS POKÉMON (CATÁLOGO) ================= */}
          {activeTab === 'catalog' && (
            <div className="flex flex-col gap-3 animate-in fade-in duration-300">
              
              {/* Search & Type Filter Bar */}
              <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-100 flex flex-col gap-2">
                
                {/* Search Input */}
                <div className="relative">
                  <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Buscar na coleção..."
                    className="w-full pl-9 pr-8 py-2 bg-gray-100 rounded-xl text-xs font-semibold text-[#1E2A44] outline-none focus:bg-white focus:ring-2 focus:ring-blue-400"
                  />
                  {catalogSearch && (
                    <button onClick={() => setCatalogSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <XIcon size={14} />
                    </button>
                  )}
                </div>

                {/* Type Filter Pills horizontal scroll */}
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-0.5">
                  <button
                    onClick={() => setCatalogTypeFilter('Todos')}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                      catalogTypeFilter === 'Todos' 
                        ? 'bg-[#1E2A44] text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Todos ({catalog.length})
                  </button>
                  {ALL_TYPES.map(t => {
                    const count = catalog.filter(p => p.types.includes(t)).length;
                    if (count === 0) return null;
                    return (
                      <button
                        key={t}
                        onClick={() => setCatalogTypeFilter(t)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                          catalogTypeFilter === t 
                            ? `${TYPE_COLORS[t]?.bg || 'bg-blue-500'} text-white shadow-sm` 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <span>{t}</span>
                        <span className="opacity-75 text-[9px]">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid / List of Captured Pokémon */}
              {filteredCatalog.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center mt-6 flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                    <SearchIcon size={28} />
                  </div>
                  <h3 className="font-bold text-[#1E2A44] text-base">Nenhum Pokémon encontrado</h3>
                  <p className="text-gray-500 text-xs mt-1 max-w-[200px]">
                    {catalogSearch || catalogTypeFilter !== 'Todos' 
                      ? 'Tente mudar os filtros de busca.' 
                      : 'Sua Pokédex está vazia. Vá para a aba Capturar!'}
                  </p>
                  {catalogSearch || catalogTypeFilter !== 'Todos' ? (
                    <button 
                      onClick={() => { setCatalogSearch(''); setCatalogTypeFilter('Todos'); }}
                      className="mt-4 text-xs text-[#FF1F3D] font-bold hover:underline"
                    >
                      Limpar Filtros
                    </button>
                  ) : (
                    <button 
                      onClick={() => setActiveTab('capture')}
                      className="mt-4 bg-[#FF1F3D] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md"
                    >
                      Capturar Primeiro
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredCatalog.map((pokemon) => {
                    const primaryColor = TYPE_COLORS[pokemon.primaryType] || TYPE_COLORS['Normal'];
                    return (
                      <div
                        key={pokemon.uuid}
                        onClick={() => setSelectedPokemonDetail(pokemon)}
                        className="bg-white rounded-2xl p-3 shadow-md border border-gray-100 flex flex-col relative overflow-hidden group active:scale-98 transition-all cursor-pointer"
                      >
                        {/* Top ID Badge & Delete Button */}
                        <div className="flex items-center justify-between z-10">
                          <span className="text-[10px] font-extrabold text-gray-400">
                            #{String(pokemon.id).padStart(3, '0')}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(pokemon.uuid);
                            }}
                            className="p-1 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <TrashIcon size={14} />
                          </button>
                        </div>

                        {/* Pokemon Image */}
                        <div className="w-full h-24 flex items-center justify-center my-1 relative">
                          {/* Soft Type Background Circle */}
                          <div 
                            className="absolute w-20 h-20 rounded-full opacity-15"
                            style={{ backgroundColor: primaryColor.hex }}
                          />
                          <img
                            src={pokemon.animatedSprite || pokemon.sprite}
                            alt={pokemon.name}
                            className="w-20 h-20 object-contain z-10 filter drop-shadow-md group-hover:scale-110 transition-transform duration-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = pokemon.sprite || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
                            }}
                          />
                        </div>

                        {/* Pokemon Name */}
                        <h4 className="text-sm font-extrabold text-[#1E2A44] text-center truncate">
                          {pokemon.name}
                        </h4>

                        {/* Type Badges */}
                        <div className="flex items-center justify-center gap-1 mt-1 flex-wrap">
                          {pokemon.types.map(t => (
                            <span
                              key={t}
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[t]?.bg || 'bg-gray-400'} ${TYPE_COLORS[t]?.text || 'text-white'}`}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </main>

        {}
        {selectedPokemonDetail && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-6 duration-300">
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedPokemonDetail(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200"
              >
                <XIcon size={18} />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-gray-400">
                  #{String(selectedPokemonDetail.id).padStart(3, '0')}
                </span>
                <h3 className="text-2xl font-black text-[#1E2A44]">
                  {selectedPokemonDetail.name}
                </h3>
              </div>

              {/* Artwork & Types */}
              <div className="flex flex-col items-center my-4">
                <img 
                  src={selectedPokemonDetail.sprite} 
                  alt={selectedPokemonDetail.name} 
                  className="w-36 h-36 object-contain filter drop-shadow-xl"
                />
                <div className="flex gap-2 mt-2">
                  {selectedPokemonDetail.types.map(t => (
                    <span key={t} className={`text-xs font-bold px-3 py-1 rounded-full ${TYPE_COLORS[t]?.bg} ${TYPE_COLORS[t]?.text}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats & Info Grid */}
              <div className="grid grid-cols-2 gap-2 my-4 bg-gray-50 p-3 rounded-2xl text-xs font-semibold text-gray-600">
                <div>Altura: <span className="font-bold text-[#1E2A44]">{selectedPokemonDetail.height || '0.5'}m</span></div>
                <div>Peso: <span className="font-bold text-[#1E2A44]">{selectedPokemonDetail.weight || '10'}kg</span></div>
              </div>

              {/* Base Stats Progress Bars */}
              <div className="flex flex-col gap-2">
                <div className="text-xs font-bold text-[#1E2A44]">Status Base</div>
                
                {[
                  { label: 'HP', val: selectedPokemonDetail.stats?.hp || 50, color: 'bg-emerald-500' },
                  { label: 'Ataque', val: selectedPokemonDetail.stats?.attack || 50, color: 'bg-red-500' },
                  { label: 'Defesa', val: selectedPokemonDetail.stats?.defense || 50, color: 'bg-blue-500' },
                  { label: 'Velocidade', val: selectedPokemonDetail.stats?.speed || 50, color: 'bg-amber-500' }
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2 text-[11px]">
                    <span className="w-16 font-semibold text-gray-500">{s.label}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full`} style={{ width: `${Math.min(100, (s.val / 150) * 100)}%` }} />
                    </div>
                    <span className="w-8 font-bold text-[#1E2A44] text-right">{s.val}</span>
                  </div>
                ))}
              </div>

              {/* Modal Actions */}
              <button
                onClick={() => handleDelete(selectedPokemonDetail.uuid)}
                className="w-full mt-6 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <TrashIcon size={16} />
                Soltar Pokémon (Remover da coleção)
              </button>
            </div>
          </div>
        )}

        {}
        <nav className="relative z-30 bg-white border-t border-gray-100 px-6 py-2 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          
          {/* Tab 1: Capturar */}
          <button
            onClick={() => setActiveTab('capture')}
            className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${
              activeTab === 'capture' ? 'text-[#FF1F3D]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className={`p-1.5 rounded-2xl transition-colors ${activeTab === 'capture' ? 'bg-red-50' : ''}`}>
              <PokeballLogoIcon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold">Capturar</span>
          </button>

          {/* Tab 2: Meus Pokémon */}
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex flex-col items-center gap-1 transition-all active:scale-90 ${
              activeTab === 'catalog' ? 'text-[#FF1F3D]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className={`p-1.5 rounded-2xl transition-colors ${activeTab === 'catalog' ? 'bg-red-50' : ''}`}>
              <BookOpenIcon size={22} />
            </div>
            <span className="text-[10px] font-bold">Meus Pokémon</span>
          </button>
        </nav>

      </div>
    </div>
  );
}