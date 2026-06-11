import { useEffect } from 'react';
import { useNotesStore } from '../stores/notesStore';
import { motion } from 'framer-motion';
import { FiBook, FiDownload, FiStar, FiArrowRight } from 'react-icons/fi';
import featureIllustration from '../assets/feature-illustration.svg';

export default function DashboardPage() {
  const { userNotes, loading, getUserNotes } = useNotesStore();

  useEffect(() => {
    getUserNotes();
  }, []);

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 rounded-[36px] border border-slate-800/80 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/30"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Dashboard</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Your study overview</h1>
            <p className="mt-3 max-w-2xl text-slate-400">Quickly manage your notes, track activity, and keep your resources organized in one premium workspace.</p>
          </div>
          <button className="btn-outline inline-flex items-center gap-2">
            View all notes <FiArrowRight />
          </button>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr] items-center rounded-[32px] border border-slate-800/80 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/20">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300">AI-powered insights</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Study faster with smarter note workflows</h2>
            <p className="mt-4 text-slate-400">Browse your uploads, discover new material, and keep everything synced in one polished control center.</p>
          </div>
          <div className="overflow-hidden rounded-[32px] border border-slate-800/80 bg-white/95 shadow-2xl shadow-slate-950/20">
            <img
              src={featureIllustration}
              alt="AI study insights"
              className="w-full object-contain"
            />
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3 mb-10">
        {[
          { icon: FiBook, label: 'My Notes', value: userNotes.length, accent: 'from-sky-500 to-blue-600' },
          { icon: FiDownload, label: 'Downloads', value: '0', accent: 'from-indigo-500 to-sky-500' },
          { icon: FiStar, label: 'Average Rating', value: '0', accent: 'from-blue-500 to-indigo-600' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-[28px] border border-slate-800/80 bg-slate-950/90 p-6 shadow-lg shadow-slate-950/30"
            >
              <div className={`mb-6 inline-flex rounded-3xl bg-gradient-to-r ${stat.accent} p-4 text-white shadow-lg shadow-sky-500/20`}>
                <Icon className="h-7 w-7" />
              </div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">{stat.label}</p>
              <p className="mt-3 text-4xl font-semibold text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-white">Recent notes</h2>
            <p className="mt-2 text-slate-400">Quick access to the notes you uploaded most recently.</p>
          </div>
          <button className="btn-secondary">Upload new note</button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-sky-500"></div>
          </div>
        ) : userNotes.length > 0 ? (
          <div className="grid gap-4">
            {userNotes.map((note, index) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-[32px] border border-slate-800/80 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/20"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{note.title}</h3>
                    <p className="mt-2 text-slate-400">{note.subject}</p>
                  </div>
                  <span className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    note.status === 'approved' ? 'bg-emerald-500/10 text-emerald-300' :
                    note.status === 'pending' ? 'bg-amber-500/10 text-amber-300' :
                    'bg-rose-500/10 text-rose-300'
                  }`}>
                    {note.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-[32px] border border-slate-800/80 bg-slate-950/90 p-10 text-center text-slate-400 shadow-2xl shadow-slate-950/20">
            <p>No notes uploaded yet. Start by sharing your first study guide.</p>
          </div>
        )}
      </section>
    </div>
  );
}
