
import React, { useState, useEffect, useRef } from 'react';
import { mockDb } from '../services/mockDb';
import { SoapProduct } from '../types';
import { translations, Language } from '../translations';

interface GuestHomeProps {
  onAdminClick: () => void;
}

const GuestHome: React.FC<GuestHomeProps> = ({ onAdminClick }) => {
  const [products, setProducts] = useState<SoapProduct[]>([]);
  const [lang, setLang] = useState<Language>('uz');
  const [logoClicks, setLogoClicks] = useState(0);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    setProducts(mockDb.getProducts());
  }, []);

  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    if (newCount === 5) {
      onAdminClick();
      setLogoClicks(0);
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        setLogoClicks(0);
      }, 1000);
    }
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
    { code: 'uz_kr', label: "Ўзбек", flag: '🇺🇿' },
    { code: 'en', label: "English", flag: '🇺🇸' },
    { code: 'ru', label: "Русский", flag: '🇷🇺' },
    { code: 'tr', label: "Türkçe", flag: '🇹🇷' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={handleLogoClick}
          >
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl italic group-active:scale-90 transition-all shadow-lg shadow-indigo-100">S</div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight hidden sm:block">Simosh</span>
          </div>

          <nav className="hidden lg:flex gap-10 text-slate-600 font-semibold uppercase text-xs tracking-widest">
            <a href="#" className="hover:text-indigo-600 transition">{t.nav_home}</a>
            <a href="#" className="hover:text-indigo-600 transition">{t.nav_catalog}</a>
            <a href="#" className="hover:text-indigo-600 transition">{t.nav_about}</a>
          </nav>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-100 hover:bg-slate-50 transition font-medium text-sm text-slate-700"
              >
                <span>{languages.find(l => l.code === lang)?.flag}</span>
                <span className="hidden sm:inline">{languages.find(l => l.code === lang)?.label}</span>
                <span className={`text-[10px] transition-transform ${isLangOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>
              
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-slate-50 transition ${lang === l.code ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-600'}`}
                    >
                      <span>{l.flag}</span>
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-600 transition shadow-lg shadow-slate-100">
              {t.buy_now}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#fdfbff] py-24 px-4">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-200 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-pink-100 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6">Handmade Quality</span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 leading-tight">
            {t.hero_title} <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
                {t.hero_subtitle}
            </span>
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            {t.hero_desc}
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <button className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 hover:scale-105 transition shadow-xl shadow-indigo-100">
              {t.hero_btn_collection}
            </button>
            <button className="bg-white border-2 border-slate-100 text-slate-800 px-10 py-4 rounded-2xl font-bold hover:border-indigo-200 transition">
              {t.hero_btn_about}
            </button>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-16">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">{t.section_products}</h2>
            <p className="text-slate-500 mt-3 text-lg">{t.section_products_desc}</p>
          </div>
          <div className="flex gap-3">
            <button className="w-12 h-12 flex items-center justify-center border-2 border-slate-100 rounded-full hover:bg-indigo-50 hover:border-indigo-100 transition">←</button>
            <button className="w-12 h-12 flex items-center justify-center border-2 border-slate-100 rounded-full hover:bg-indigo-50 hover:border-indigo-100 transition">→</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => (
            <div key={product.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-3xl transition-all duration-500 cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-1000"
                />
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-sm">
                  {product.category}
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-slate-800">{product.name}</h3>
                  <div className="text-indigo-600 font-black text-lg">{product.price.toLocaleString()} so'm</div>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">
                  {product.description}
                </p>
                <button className="w-full bg-slate-50 text-slate-900 py-4 rounded-2xl font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  {t.add_to_cart}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">S</div>
              <span className="text-2xl font-bold text-white tracking-tight">Simosh</span>
            </div>
            <p className="max-w-sm text-slate-400 leading-relaxed text-lg">
              {t.footer_desc}
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-6">{t.footer_contact}</h4>
            <div className="space-y-4">
                <p className="flex items-center gap-3">📍 Tashkent, Yunusobod</p>
                <p className="flex items-center gap-3">📞 +998 90 123 45 67</p>
                <p className="flex items-center gap-3">✉️ info@simosh.uz</p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-6">{t.footer_social}</h4>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center hover:bg-indigo-600 transition">IG</a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center hover:bg-indigo-600 transition">TG</a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center hover:bg-indigo-600 transition">FB</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-20 pt-10 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; 2024 Simosh. {t.footer_rights}</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestHome;
