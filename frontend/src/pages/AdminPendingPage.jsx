import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { adminAPI } from '../services/api';

export default function AdminPendingPage() {
  const [pendingNotes, setPendingNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingNotes = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getPendingNotes();
      setPendingNotes(response.data.notes || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingNotes();
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveNote(id);
      setPendingNotes((notes) => notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      await adminAPI.rejectNote(id, { reason: 'Not appropriate' });
      setPendingNotes((notes) => notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container py-8">
      <div className="rounded-[32px] border border-slate-800/80 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Admin review</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Pending note approvals</h1>
            <p className="mt-3 text-slate-400 max-w-2xl">Review uploaded notes and approve or reject them to keep the library curated.</p>
          </div>
          <button type="button" onClick={fetchPendingNotes} className="btn-outline inline-flex items-center gap-2">
            <FiClock className="h-4 w-4" /> Refresh list
          </button>
        </div>

        <div className="mt-10 space-y-4">
          {loading ? (
            <div className="rounded-[28px] border border-slate-800/80 bg-slate-900/90 p-10 text-center text-slate-400">
              Loading pending notes...
            </div>
          ) : pendingNotes.length === 0 ? (
            <div className="rounded-[28px] border border-slate-800/80 bg-slate-900/90 p-10 text-center text-slate-400">
              No pending notes to review right now.
            </div>
          ) : (
            pendingNotes.map((note) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[28px] border border-slate-800/80 bg-slate-900/90 p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{note.uploadedBy?.firstName || 'Uploader'}</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">{note.title}</h2>
                    <p className="mt-2 text-slate-400">Submitted {new Date(note.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-sm text-amber-300">Pending</span>
                    <button
                      type="button"
                      onClick={() => handleApprove(note._id)}
                      className="btn-primary rounded-full px-5 py-2"
                    >
                      <FiCheckCircle className="mr-2 h-4 w-4" /> Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(note._id)}
                      className="btn-outline rounded-full px-5 py-2"
                    >
                      <FiXCircle className="mr-2 h-4 w-4" /> Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
