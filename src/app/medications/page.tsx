'use client';

import { useState, useMemo } from 'react';
import { useMedications } from '@/context/MedicationContext';

const PAGE_SIZE = 20;

export default function MedicationsPage() {
  const { medications, addMedication, updateMedication, deleteMedication } = useMedications();
  const [newMedName, setNewMedName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [addError, setAddError] = useState('');
  const [editError, setEditError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? medications.filter(m => m.name.toLowerCase().includes(q)) : medications;
  }, [medications, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (v: string) => {
    setSearch(v);
    setCurrentPage(1);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newMedName.trim();
    if (!trimmed) return;
    // duplicate check (case-insensitive)
    const isDuplicate = medications.some(m => m.name.toLowerCase() === trimmed.toLowerCase());
    if (isDuplicate) {
      setAddError(`"${trimmed}" มีในรายการอยู่แล้ว`);
      return;
    }
    setIsAdding(true);
    try {
      await addMedication({ name: trimmed });
      setNewMedName('');
      setAddError('');
    } catch (err) {
      console.error('Failed to add medication:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditSave = async (id: string) => {
    const trimmed = editName.trim();
    if (!trimmed) return;
    // duplicate check — ignore self
    const isDuplicate = medications.some(m => m.id !== id && m.name.toLowerCase() === trimmed.toLowerCase());
    if (isDuplicate) {
      setEditError(`"${trimmed}" มีในรายการอยู่แล้ว`);
      return;
    }
    setIsSaving(true);
    try {
      await updateMedication(id, { name: trimmed });
      setEditingId(null);
      setEditName('');
      setEditError('');
    } catch (err) {
      console.error('Failed to update medication:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('ลบยานี้ออกจากรายการ?')) {
      try {
        await deleteMedication(id);
      } catch (err) {
        console.error('Failed to delete medication:', err);
      }
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Info */}
      <div className="mb-4 flex justify-end">
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
          ยอดรวมทั้งหมด: {medications.length} รายการ
        </span>
      </div>

      {/* Add + Search bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6 flex flex-col md:flex-row gap-4">
        <form onSubmit={handleAdd} className="flex gap-3 flex-1">
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <input
              type="text"
              placeholder="เพิ่มชื่อยาใหม่..."
              className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-xl focus:ring-2 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400 ${
                addError
                  ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400'
                  : 'border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500'
              }`}
              value={newMedName}
              onChange={(e) => { setNewMedName(e.target.value); setAddError(''); }}
            />
            {addError && (
              <p className="absolute left-0 -bottom-5 text-xs font-semibold text-red-500 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {addError}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={!newMedName.trim() || isAdding}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center min-w-[100px]"
          >
            {isAdding ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'เพิ่มยา'
            )}
          </button>
        </form>
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="ค้นหายา..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">{search ? 'ไม่พบยาที่ค้นหา' : 'ยังไม่มีรายการยา'}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
            {paginated.map((med) =>
              editingId === med.id ? (
                <div key={med.id} className="col-span-2 sm:col-span-3 flex flex-col gap-2 bg-white border border-emerald-300 rounded-xl p-3 shadow-sm">
                  <div className="flex gap-2 items-center">
                    <input
                      autoFocus
                      type="text"
                      className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 transition-all ${
                        editError
                          ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400'
                          : 'border-emerald-300 focus:ring-emerald-500/20 focus:border-emerald-500'
                      }`}
                      value={editName}
                      onChange={(e) => { setEditName(e.target.value); setEditError(''); }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave(med.id);
                        if (e.key === 'Escape') { setEditingId(null); setEditError(''); }
                      }}
                    />
                    <button onClick={() => handleEditSave(med.id)} disabled={!editName.trim() || isSaving} className="px-3 py-1.5 text-xs bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 font-semibold transition-colors disabled:opacity-50 flex items-center justify-center min-w-[50px]">
                      {isSaving ? (
                        <svg className="animate-spin h-3.5 w-3.5 text-emerald-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        'Save'
                      )}
                    </button>
                    <button onClick={() => { setEditingId(null); setEditError(''); }} disabled={isSaving} className="px-3 py-1.5 text-xs bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-semibold transition-colors disabled:opacity-50">Cancel</button>
                  </div>
                  {editError && (
                    <p className="text-xs font-semibold text-red-500 flex items-center gap-1 pl-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      {editError}
                    </p>
                  )}
                </div>
              ) : (
                <div
                  key={med.id}
                  className="group relative flex items-center justify-between gap-2 bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-sm rounded-xl px-4 py-3 transition-all cursor-default"
                >
                  <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-700 transition-colors leading-tight truncate">{med.name}</span>
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditingId(med.id); setEditName(med.name); }}
                      className="p-1 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors"
                      title="แก้ไข"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(med.id)}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      title="ลบ"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-3">
              <p className="text-xs text-slate-500 font-medium">
                แสดง {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} จาก {filtered.length} รายการ
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ← ก่อนหน้า
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${
                      page === currentPage
                        ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                        : 'text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ถัดไป →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
