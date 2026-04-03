import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Lock, LogOut, Download, Search, Filter, Clock,
  CheckCircle2, ChevronDown, Calendar, User,
  Phone, MessageSquare, Tent, AlertCircle, RefreshCw,
} from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';
import type { Lead, LeadStatus } from '@/types';

// La contraseña se lee desde variable de entorno (no hardcodeada)
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? '';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'Todos'>('Todos');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) fetchLeads();
  }, [isAuthenticated]);

  async function fetchLeads() {
    try {
      setIsLoading(true);
      setError(null);
      const supabase = getSupabaseClient();
      if (!supabase) throw new Error('Supabase no configurado');

      const { data, error } = await supabase
        .from('consultas_clientes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar los leads');
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!ADMIN_PASSWORD) {
      setError('Variable VITE_ADMIN_PASSWORD no configurada en .env.local');
      return;
    }
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Contraseña incorrecta');
    }
  }

  async function handleUpdateStatus(id: string, newStatus: LeadStatus) {
    try {
      setIsUpdating(id);
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { error } = await supabase
        .from('consultas_clientes')
        .update({ estado: newStatus })
        .eq('id', id);

      if (error) throw error;
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, estado: newStatus } : l)));
    } catch (err: unknown) {
      alert('Error al actualizar: ' + (err instanceof Error ? err.message : ''));
    } finally {
      setIsUpdating(null);
    }
  }

  function exportToCSV() {
    if (!leads.length) return;
    const headers = ['Fecha', 'Nombre', 'Email', 'Teléfono', 'Modelo', 'Mensaje', 'Estado'];
    const rows = leads.map((l) => [
      new Date(l.created_at).toLocaleDateString('es-UY'),
      `"${l.nombre}"`, `"${l.email}"`, `"${l.telefono}"`,
      `"${l.modelo_carpa}"`, `"${l.mensaje.replace(/"/g, '""')}"`,
      l.estado ?? 'Pendiente',
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_tensacover_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  const filteredLeads = leads.filter((l) => {
    const matchSearch =
      l.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.telefono.includes(searchTerm);
    const matchStatus = statusFilter === 'Todos' || (l.estado ?? 'Pendiente') === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusColors: Record<string, string> = {
    Contactado: 'bg-blue-100 text-blue-700 border-blue-200',
    Cerrado: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Pendiente: 'bg-amber-100 text-amber-700 border-amber-200',
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/20 relative z-10"
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Lock className="text-primary" size={36} />
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Panel Admin</h1>
            <p className="text-slate-500 font-medium">Acceso restringido — TensaCover Uruguay</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                placeholder="••••••••••••"
                required
              />
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-red-500 text-sm font-bold bg-red-50 p-4 rounded-xl border border-red-100"
              >
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}
            <button
              type="submit"
              className="w-full py-4 bg-primary text-background-dark font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Entrar al Panel
            </button>
          </form>
          <div className="mt-10 text-center">
            <a href="/" className="text-sm font-bold text-slate-400 hover:text-primary transition-colors">
              Volver al sitio
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-background-dark">
              <Tent size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">TensaCover Admin</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Gestión de Clientes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
            >
              <Download size={18} /> Exportar CSV
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          <div className="lg:col-span-3 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm font-medium"
              />
            </div>
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'Todos')}
                className="w-full pl-14 pr-10 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none shadow-sm font-bold appearance-none cursor-pointer"
              >
                <option value="Todos">Todos los estados</option>
                <option value="Pendiente">Pendientes</option>
                <option value="Contactado">Contactados</option>
                <option value="Cerrado">Cerrados</option>
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Total Leads</p>
              <p className="text-3xl font-black text-background-dark">{filteredLeads.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <User className="text-primary" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  {['Cliente', 'Contacto', 'Modelo / Evento', 'Mensaje', 'Estado'].map((h) => (
                    <th key={h} className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <RefreshCw className="text-primary animate-spin" size={40} />
                        <p className="text-slate-400 font-bold">Cargando leads...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <p className="text-slate-400 font-bold">No se encontraron leads con estos filtros.</p>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                            {lead.nombre.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-slate-900">{lead.nombre}</p>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-1">
                              <Calendar size={12} />
                              {new Date(lead.created_at).toLocaleDateString('es-UY', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                            <Phone size={14} className="text-slate-400" /> {lead.telefono}
                          </div>
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                            <User size={14} className="text-slate-300" /> {lead.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Tent size={16} className="text-primary" />
                          </div>
                          <span className="text-sm font-black text-slate-700">{lead.modelo_carpa}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 max-w-md">
                        <div className="flex gap-3">
                          <MessageSquare size={16} className="text-slate-300 shrink-0 mt-1" />
                          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{lead.mensaje}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="relative">
                          <select
                            value={lead.estado ?? 'Pendiente'}
                            onChange={(e) => handleUpdateStatus(lead.id, e.target.value as LeadStatus)}
                            disabled={isUpdating === lead.id}
                            className={`pl-10 pr-10 py-2.5 rounded-full text-xs font-black border outline-none appearance-none cursor-pointer disabled:opacity-50 ${statusColors[lead.estado ?? 'Pendiente']}`}
                          >
                            <option value="Pendiente">Pendiente</option>
                            <option value="Contactado">Contactado</option>
                            <option value="Cerrado">Cerrado</option>
                          </select>
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            {isUpdating === lead.id ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : lead.estado === 'Cerrado' ? (
                              <CheckCircle2 size={14} />
                            ) : (
                              <Clock size={14} />
                            )}
                          </div>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" size={12} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

