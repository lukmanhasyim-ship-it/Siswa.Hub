import React, { memo } from 'react';
import { Phone, FileText, AlertTriangle, Edit3, MapPin, Trash2, MessageCircle, Crown, XCircle } from 'lucide-react';
import { formatDateIndo } from '../utils/logic';

function StudentCard({ student, disciplineStatus, detailReason, panggilanDetail, onWaClick, onWaStudentClick, onContactClick, onReject, onEdit, onDelete, canSeeLocation }) {
  const getAvatarColor = (gender) => {
    return gender === 'P' ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700';
  };

  return (
    <div className={`group relative bg-white p-3 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${disciplineStatus ? 'border-red-200 bg-red-50/50 shadow-red-100/50' : 'border-slate-100 shadow-sm'}`}>
      {/* Name & Status Header - Top of Card */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-tight leading-4 mb-1 truncate group-hover:whitespace-normal transition-all">
            {student.Nama_Siswa}
          </h3>
          <div className="flex flex-wrap gap-1">
            {student.Status_Aktif && student.Status_Aktif !== 'Aktif' && (
              <span className={`px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase ${student.Status_Aktif === 'Keluar' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                {student.Status_Aktif}
              </span>
            )}
            {student.Jabatan && student.Jabatan !== 'Siswa' && (
              <span className="px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                <Crown className="w-2 h-2" />
                {student.Jabatan}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Left: Avatar Section */}
        <div className="relative flex-shrink-0">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-inner transition-transform group-hover:scale-105 duration-300 ${getAvatarColor(student['L/P'])}`}>
            {student.Nama_Siswa.charAt(0)}
          </div>
        </div>

        {/* Center: Detail Section */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center flex-wrap gap-1">
              <span className="text-[8px] font-black text-emerald-600 font-mono bg-emerald-50 px-1 py-0.5 rounded-md border border-emerald-100">{student.ID_Siswa || student.NIS}</span>
              <span className="text-[9px] text-slate-400 font-bold tracking-tighter">NISN: {student.NISN || '-'}</span>
            </div>
            <div className="mt-0.5">
              <p className="text-[10px] text-slate-500 font-semibold truncate leading-tight">
                <span className="text-slate-400 font-medium tracking-tight">Wali:</span> {student.Nama_Wali}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reorganized Icon Bar - Bottom Action Area */}
      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {student.Latitude && student.Longitude && (
            <a
              href={`https://www.google.com/maps?q=${student.Latitude},${student.Longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all duration-300"
              title="Buka Maps"
            >
              <MapPin className="w-3.5 h-3.5" />
            </a>
          )}
          {onContactClick && (
            <button
              onClick={() => onContactClick(student)}
              className="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-400 rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-300"
              title="Log Panggilan"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
          )}
          {onWaStudentClick && (
            <button
              onClick={() => onWaStudentClick(student)}
              className="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-400 rounded-lg hover:bg-sky-500 hover:text-white transition-all duration-300"
              title="WhatsApp Siswa"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </button>
          )}
          {onWaClick && (
            <button
              onClick={() => onWaClick(student)}
              className="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-all duration-300"
              title="WhatsApp Wali"
            >
              <Phone className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {onEdit && (
            <button
              onClick={() => onEdit(student)}
              className="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-900 hover:text-white transition-all duration-300"
              title="Edit"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(student.ID_Siswa)}
              className="w-8 h-8 flex items-center justify-center bg-rose-50 text-rose-300 rounded-lg hover:bg-rose-600 hover:text-white transition-all duration-300"
              title="Hapus"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Indicator for Alert */}
      {disciplineStatus && (
        <div className={`mt-2 pt-2 border-t ${disciplineStatus === 'Sudah Dipanggil' ? 'border-amber-100' : 'border-red-100'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[9px] font-black ${disciplineStatus === 'Sudah Dipanggil' ? 'text-amber-600' : 'text-red-600'} uppercase tracking-widest flex items-center gap-1`}>
              {disciplineStatus}
            </span>
            {disciplineStatus === 'Sudah Dipanggil' && onReject && (
              <button
                onClick={() => onReject(student)}
                className="flex items-center gap-1 px-2 py-0.5 bg-rose-50 text-rose-600 rounded-md hover:bg-rose-600 hover:text-white transition-all duration-300 text-[8px] font-black uppercase tracking-widest"
                title="Tolak Panggilan"
              >
                <XCircle className="w-3 h-3" />
                Tolak
              </button>
            )}
          </div>

          {/* Detail Pemanggilan */}
          {disciplineStatus === 'Sudah Dipanggil' && panggilanDetail && (
            <div className="mt-2 p-2 bg-amber-50/80 rounded-xl border border-amber-100 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest min-w-[52px]">Jadwal</span>
                <span className="text-[10px] font-bold text-slate-700">
                  {panggilanDetail.Tanggal_Pemanggilan
                    ? formatDateIndo(panggilanDetail.Tanggal_Pemanggilan)
                    : formatDateIndo(panggilanDetail.Tanggal)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest min-w-[52px]">Kategori</span>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                  panggilanDetail.Kategori === 'Home Visit' ? 'bg-amber-100 text-amber-700' :
                  panggilanDetail.Kategori === 'Teguran' ? 'bg-rose-100 text-rose-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {panggilanDetail.Kategori}
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest min-w-[52px] mt-0.5">Alasan</span>
                <span className="text-[9px] font-medium text-slate-600 leading-snug">{panggilanDetail.Alasan || '-'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest min-w-[52px]">Status</span>
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                  panggilanDetail.Status_Selesai === 'Pending' ? 'bg-amber-100 text-amber-700' :
                  panggilanDetail.Status_Selesai === 'Selesai' ? 'bg-emerald-100 text-emerald-700' :
                  'bg-rose-100 text-rose-700'
                }`}>
                  {panggilanDetail.Status_Selesai || 'Pending'}
                </span>
              </div>
            </div>
          )}

          {/* Detail alasan untuk Siap Panggil / Panggilan Orang Tua */}
          {disciplineStatus !== 'Sudah Dipanggil' && detailReason && (
            <div className="mt-1">
              <p className="text-[9px] text-slate-500 font-medium italic leading-tight">
                {detailReason}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(StudentCard);
