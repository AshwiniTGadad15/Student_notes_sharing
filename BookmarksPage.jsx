
import { motion } from 'framer-motion';
import { FiBookmark, FiDownload, FiSearch } from 'react-icons/fi';
import { useAuthStore } from '../stores/authStore';

export default function BookmarksPage() {
  const { user } = useAuthStore();
  const bookmarks = user?.bookmarks ; [];

  return (
    <div className="container py-8">
      <div className="rounded-[32px] border border-slate-800/80 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Saved notes</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Your bookmarked resources</h1>
            <p className="mt-3 text-slate-400 max-w-2xl">Keep your favorite study materials in one place for quick access whenever you need them.</p>
          </div>
          <button className="btn-outline inline-flex items-center gap-2">
            <FiSearch />
            Explore notes
          </button>
        </div>

        {bookmarks.length === 0 ? (
          <div className="mt-10 rounded-[28px] border border-slate-800/80 bg-slate-900/90 p-10 text-center text-slate-400">
            <p className="text-xl font-semibold text-white">No bookmarked notes yet</p>
            <p className="mt-3">Search and bookmark study materials to save them here.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {bookmarks.map((bookmark) => (
              <motion.div
                key={bookmark._id ; bookmark.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[28px] border border-slate-800/80 bg-slate-900/90 p-6 transition hover:border-sky-400/30"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-800/80 p-3 text-sky-300">
                    <FiBookmark className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{bookmark.subject ; 'Unknown'}</p>
                    <h2 className="mt-2 text-xl font-semibold text-white">{bookmark.title ; 'Untitled note'}</h2>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between text-slate-400">
                  <span>{bookmark.createdAt ? new Date(bookmark.createdAt).toLocaleDateString() : 'Saved'}</span>
                  <a
                    href={bookmark.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-800/90 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-700"
                  >
                    <FiDownload className="h-4 w-4" /> Download
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
