
import React, { useState, useEffect } from 'react';
import { mockDb } from '../services/mockDb';
import { geminiService } from '../services/geminiService';
import { SoapProduct, User } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, 
  LineChart, Line 
} from 'recharts';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [products, setProducts] = useState<SoapProduct[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Form State
  const [newSoap, setNewSoap] = useState({
    name: '',
    description: '',
    category: 'Tabiiy',
    price: 0,
    stock: 0,
    imageUrl: 'https://picsum.photos/seed/new/400/400'
  });

  useEffect(() => {
    refreshData();
    setCurrentUser(mockDb.getCurrentUser());
  }, []);

  const refreshData = () => {
    setProducts(mockDb.getProducts());
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    mockDb.addProduct(newSoap);
    setNewSoap({ name: '', description: '', category: 'Tabiiy', price: 0, stock: 0, imageUrl: 'https://picsum.photos/seed/new/400/400' });
    setIsModalOpen(false);
    refreshData();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Haqiqatan ham bu mahsulotni o\'chirmoqchimisiz?')) {
      mockDb.deleteProduct(id);
      refreshData();
    }
  };

  const generateAIdescription = async () => {
    if (!newSoap.name) return alert("Avval nomini kiriting!");
    setIsGenerating(true);
    const desc = await geminiService.generateSoapDescription(newSoap.name, newSoap.category);
    setNewSoap(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const salesData = products.map(p => ({
    name: p.name.split(' ')[0],
    stock: p.stock,
    price: p.price / 1000
  }));

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-400 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-lg">S</div>
            <span className="text-xl font-bold text-white">Simosh Admin</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-600/10 text-indigo-400 rounded-xl font-medium text-left">
            <span>📊</span> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition rounded-xl text-left">
            <span>🧼</span> Mahsulotlar
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition rounded-xl text-left">
            <span>📦</span> Buyurtmalar
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition rounded-xl text-left">
            <span>👤</span> Mijozlar
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="px-4 py-3 mb-2 flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
               {currentUser?.firstName[0]}{currentUser?.lastName[0]}
             </div>
             <div className="overflow-hidden">
               <p className="text-white text-xs font-bold truncate">{currentUser?.firstName} {currentUser?.lastName}</p>
               <p className="text-slate-500 text-[10px] truncate">{currentUser?.email}</p>
             </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 hover:text-red-400 transition rounded-xl text-left"
          >
            <span>🚪</span> Chiqish
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b px-8 py-6 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Salom, {currentUser?.firstName || 'Admin'}! 👋
            </h1>
            <p className="text-sm text-slate-500 font-medium">Barcha ma'lumotlar MongoDB: simosh_db dan o'qilmoqda.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center gap-2"
          >
            <span>+</span> Yangi mahsulot
          </button>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Umumiy Mahsulotlar</p>
              <h3 className="text-3xl font-bold text-slate-900">{products.length}</h3>
              <p className="text-emerald-500 text-xs mt-2 font-bold">↑ 12% o'sish</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Ombordagi Zahira</p>
              <h3 className="text-3xl font-bold text-slate-900">{products.reduce((acc, p) => acc + p.stock, 0)}</h3>
              <p className="text-slate-400 text-xs mt-2">Barcha sovunlar soni</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">O'rtacha Narx</p>
              <h3 className="text-3xl font-bold text-slate-900">
                {products.length ? Math.round(products.reduce((acc, p) => acc + p.price, 0) / products.length).toLocaleString() : 0}
              </h3>
              <p className="text-slate-400 text-xs mt-2">So'm / dona</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">MongoDB Status</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-600 font-bold uppercase text-xs">Connected</span>
              </div>
              <p className="text-slate-400 text-xs mt-1">v6.0.4 - Localhost</p>
            </div>
          </div>

          {/* Charts (Same as before) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-80">
              <h4 className="text-lg font-bold text-slate-800 mb-6">Ombor Holati (Stock)</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="stock" radius={[6, 6, 0, 0]} barSize={40}>
                    {salesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#818cf8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-80">
              <h4 className="text-lg font-bold text-slate-800 mb-6">Narx Dinamikasi (k so'm)</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                  <Line type="monotone" dataKey="price" stroke="#4f46e5" strokeWidth={4} dot={{r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50">
              <h4 className="font-bold text-slate-800">Mahsulotlar Ro'yxati</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/50 text-slate-500 text-left text-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-8 py-4 font-semibold">Mahsulot</th>
                    <th className="px-8 py-4 font-semibold">Turkum</th>
                    <th className="px-8 py-4 font-semibold">Narx</th>
                    <th className="px-8 py-4 font-semibold">Soni</th>
                    <th className="px-8 py-4 font-semibold text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <img src={product.imageUrl} className="w-12 h-12 rounded-xl object-cover bg-slate-100" />
                          <div>
                            <p className="font-bold text-slate-800">{product.name}</p>
                            <p className="text-xs text-slate-400 truncate max-w-xs">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase">{product.category}</span>
                      </td>
                      <td className="px-8 py-4 font-bold text-slate-700">{product.price.toLocaleString()} so'm</td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${product.stock < 15 ? 'bg-orange-400' : 'bg-emerald-400'}`}></span>
                          <span className="font-medium text-slate-600">{product.stock} dona</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition">✏️</button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add Product Modal (Same as before) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="px-8 py-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Yangi mahsulot qo'shish</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAddProduct} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Mahsulot nomi</label>
                    <input
                      type="text"
                      required
                      value={newSoap.name}
                      onChange={(e) => setNewSoap({ ...newSoap, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition"
                      placeholder="Lavanda Dream"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Turkum</label>
                    <select
                      value={newSoap.category}
                      onChange={(e) => setNewSoap({ ...newSoap, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition"
                    >
                      <option>Tabiiy</option>
                      <option>Tinchlantiruvchi</option>
                      <option>Tetiklashtiruvchi</option>
                      <option>Oziqlantiruvchi</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Narxi (so'm)</label>
                    <input
                      type="number"
                      required
                      value={newSoap.price}
                      onChange={(e) => setNewSoap({ ...newSoap, price: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Soni (ombor)</label>
                    <input
                      type="number"
                      required
                      value={newSoap.stock}
                      onChange={(e) => setNewSoap({ ...newSoap, stock: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-700">Tavsif</label>
                  <button 
                    type="button"
                    onClick={generateAIdescription}
                    disabled={isGenerating}
                    className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition disabled:opacity-50"
                  >
                    {isGenerating ? 'AI yozmoqda...' : '✨ AI yordamida yaratish'}
                  </button>
                </div>
                <textarea
                  required
                  rows={4}
                  value={newSoap.description}
                  onChange={(e) => setNewSoap({ ...newSoap, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition"
                  placeholder="Mahsulot haqida batafsil ma'lumot..."
                />
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-8 py-3 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
