import React, { useState, useEffect, useCallback } from 'react';
import { fetchGAS } from '../utils/gasClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Clock, Search, X, Trash2, UserCheck, AlertCircle, Pencil, Check, CornerDownLeft } from 'lucide-react';
import Loading from '../components/Loading';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

export default function CatatanTerlambat() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [siswa, setSiswa] = useState([]);
  const [terlambat, setTerlambat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [keterangan, setKeterangan] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const role = user?.role || 'Siswa';
  const canEdit = role === 'Wali Kelas';

  useEffect(() => {
    async function load() {
      try {
        const [s, t] = await Promise.all([
          fetchGAS('GET_ALL', { sheet: 'Master_Siswa' }),
          fetchGAS('GET_TERLAMBAT', { filter: { tanggal: format(new Date(), 'yyyy-MM-dd') } })
        ]);
        setSiswa((s.data || []).filter(st => st.Status_Aktif === 'Aktif'));
        setTerlambat(t.data || []);
      } catch (error) {
        console.error('Catatan Terlambat load error:', error);
        showToast('Gagal memuat data.', 'error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [showToast]);

  const loadTerlambat = useCallback(async (tanggal) => {
    try {
      const res = await fetchGAS('GET_TERLAMBAT', { filter: { tanggal } });
      setTerlambat(res.data || []);
    } catch (error) {
      console.error('Load terlambat error:', error);
    }
  }, []);

  const filteredSiswa = searchQuery
    ? siswa.filter(s =>
        s.Nama_Siswa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(s.NISN || '').includes(searchQuery) ||
        String(s.ID_Siswa || '').toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 10)
    : [];

  const handleSelectSiswa = (s) => {
    setSelectedSiswa(s);
    setSearchQuery(s.Nama_Siswa);
    setShowDropdown(false);
  };

  const handleClearSiswa = () => {
    setSelectedSiswa(null);
    setSearchQuery('');
    setKeterangan('');
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    loadTerlambat(newDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSiswa) {
      showToast('Pilih siswa terlebih dahulu.', 'error');
      return;
    }
    if (!canEdit) return;

    setSubmitting(true);
    try {
      await fetchGAS('CREATE_TERLAMBAT', {
        data: {
          Tanggal: date,
          ID_Siswa: selectedSiswa.ID_Siswa,
          NISN: selectedSiswa.NISN || '',
          Nama_Siswa: selectedSiswa.Nama_Siswa,
          Keterangan: keterangan,
          Dicatat_Oleh: user.email || ''
        }
      });
      showToast(`Berhasil mencatat ${selectedSiswa.Nama_Siswa} terlambat.`, 'success');
      handleClearSiswa();
      loadTerlambat(date);
    } catch (error) {
      showToast(error.message || 'Gagal menyimpan data.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!canEdit) return;
    try {
      await fetchGAS('DELETE_TERLAMBAT', { id });
      showToast('Catatan terlambat berhasil dihapus.', 'success');
      loadTerlambat(date);
    } catch (error) {
      showToast('Gagal menghapus data.', 'error');
    }
  };

  const handleEditStart = (item) => {
    setEditingId(item.ID_Terlambat);
    setEditValue(item.Keterangan || '');
  };

  const handleEditSave = async () => {
    if (!editingId) return;
    try {
      await fetchGAS('UPDATE', { sheet: 'Catatan_Terlambat', id: editingId, data: { Keterangan: editValue } });
      showToast('Keterangan berhasil diperbarui.', 'success');
      setEditingId(null);
      setEditValue('');
      loadTerlambat(date);
    } catch (error) {
      showToast('Gagal memperbarui keterangan.', 'error');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  if (loading) return <Loading message="Memuat data..." />;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100">
            <Clock className="w-3 h-3" /> Keterlambatan
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Catatan Siswa Terlambat {user?.managedClass && `- Kelas ${user.managedClass}`}
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
            {format(new Date(date), 'EEEE, dd MMMM yyyy', { locale: id })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="input-field max-w-[180px] font-bold text-slate-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Pencatatan */}
        <div className="lg:col-span-1">
          <div className="card bg-white border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">Catat Terlambat</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Form Pencatatan</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Search Siswa */}
              <div className="relative">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                  Cari Siswa
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedSiswa(null);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    placeholder="Ketik nama / NISN siswa..."
                    className="w-full pl-9 pr-10 py-2.5 text-sm font-semibold rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-200 focus:ring-0 outline-none transition-all placeholder:text-slate-300"
                  />
                  {selectedSiswa && (
                    <button
                      type="button"
                      onClick={handleClearSiswa}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {showDropdown && filteredSiswa.length > 0 && !selectedSiswa && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {filteredSiswa.map(s => (
                      <button
                        key={s.ID_Siswa}
                        type="button"
                        onMouseDown={() => handleSelectSiswa(s)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-orange-50 transition-colors border-b border-slate-50 last:border-0"
                      >
                        <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center text-[10px] font-black uppercase">
                          {s.Nama_Siswa.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{s.Nama_Siswa}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{s.ID_Siswa} | {s.NISN || '-'}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {showDropdown && searchQuery && filteredSiswa.length === 0 && !selectedSiswa && (
                  <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl p-4 text-center">
                    <p className="text-xs font-bold text-slate-400">Siswa tidak ditemukan</p>
                  </div>
                )}
              </div>

              {/* Selected Student Info */}
              {selectedSiswa && (
                <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl">
                  <p className="text-xs font-black text-orange-700">{selectedSiswa.Nama_Siswa}</p>
                  <p className="text-[9px] text-orange-500 font-bold uppercase tracking-widest mt-0.5">
                    {selectedSiswa.ID_Siswa} | {selectedSiswa.NISN || '-'}
                  </p>
                </div>
              )}

              {/* Keterangan */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                  Keterangan <span className="text-slate-300 normal-case">(opsional)</span>
                </label>
                <input
                  type="text"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  disabled={!selectedSiswa}
                  placeholder="Misal: bangun kesiangan..."
                  className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-200 focus:ring-0 outline-none transition-all placeholder:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedSiswa || submitting || !canEdit}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Clock className={`w-4 h-4 ${submitting ? 'animate-spin' : ''}`} />
                {submitting ? 'Menyimpan...' : 'Catat Terlambat'}
              </button>
            </form>
          </div>

          {/* Info Card */}
          <div className="card bg-amber-50 border border-amber-100 mt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-xs font-black text-amber-800">Pencatatan Keterlambatan</p>
                <p className="text-[10px] font-medium text-amber-700 mt-1 leading-relaxed">
                  Mencatat siswa yang datang terlambat. Satu siswa hanya dapat dicatat maksimal 1 kali per hari.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Daftar Terlambat */}
        <div className="lg:col-span-2">
          <div className="card bg-white border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-50 text-slate-600 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">Daftar Terlambat</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {terlambat.length} siswa tercatat
                  </p>
                </div>
              </div>
              <div className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black">
                {format(new Date(date), 'dd MMM yyyy', { locale: id })}
              </div>
            </div>

            {terlambat.length === 0 ? (
              <EmptyState
                title="Tidak Ada Catatan"
                description="Belum ada siswa yang dicatat terlambat pada tanggal ini."
                icon={UserCheck}
              />
            ) : (
              <div className="table-container">
                <table className="modern-table min-w-[500px] md:min-w-full">
                  <thead>
                    <tr>
                      <th className="w-12 text-center">No</th>
                      <th>Nama Siswa</th>
                      <th className="w-40">Keterangan</th>
                      <th className="w-36">Waktu Dicatat</th>
                      {canEdit && <th className="w-16 text-center">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {terlambat.map((item, idx) => (
                      <tr key={item.ID_Terlambat} className="group transition-colors">
                        <td className="text-center font-bold text-slate-300 group-hover:text-orange-600 transition-colors">{idx + 1}</td>
                        <td>
                          <p className="font-black text-slate-800 tracking-tight">{item.Nama_Siswa}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.ID_Siswa} | {item.NISN || '-'}</p>
                        </td>
                        <td>
                          {editingId === item.ID_Terlambat ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleEditSave}
                                onKeyDown={handleEditKeyDown}
                                autoFocus
                                className="w-full px-2 py-1 text-sm font-semibold rounded-lg bg-white border border-orange-200 focus:ring-2 focus:ring-orange-500/20 outline-none"
                              />
                              <button
                                onClick={handleEditSave}
                                className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                                title="Simpan"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={handleEditCancel}
                                className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg transition-all"
                                title="Batal"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm font-semibold text-slate-600">
                              {item.Keterangan || <span className="text-slate-300 italic">-</span>}
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="text-[11px] font-bold text-slate-500">
                            {item.Created_At ? item.Created_At.split(' ')[1] || item.Created_At : '-'}
                          </span>
                        </td>
                        {canEdit && (
                          <td className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleEditStart(item)}
                                className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                title="Edit keterangan"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.ID_Terlambat)}
                                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                title="Hapus catatan"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
