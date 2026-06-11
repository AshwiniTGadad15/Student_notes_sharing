import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiDownload, FiBookmark, FiStar, FiUser } from 'react-icons/fi';
import { useNotesStore } from '../stores/notesStore';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export default function NoteDetailsPage() {
  const { id } = useParams();
  const { currentNote, loading, getNoteById, bookmarkNote, downloadNote } = useNotesStore();
  const { user } = useAuthStore();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (id) {
      getNoteById(id).catch((error) => console.error(error));
    }
  }, [id, getNoteById]);

  useEffect(() => {
    setIsBookmarked(!!user?.bookmarks?.find((bookmark) => bookmark._id === currentNote?._id));
  }, [user, currentNote]);

  const handleBookmark = async () => {
    if (!currentNote) return;
    try {
      const response = await bookmarkNote(currentNote._id);
      toast.success(response.message || 'Bookmark updated');
      setIsBookmarked(response.isBookmarked);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Bookmark failed');
    }
  };

  const handleDownload = async () => {
    if (!currentNote) return;
    try {
      await downloadNote(currentNote._id);
      toast.success('Download started');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Download failed');
    }
  };

  return (
    <div className="container py-8">
      {loading || !currentNote ? (
        <div className="rounded-[32px] border border-slate-800/80 bg-slate-950/90 p-12 text-center text-slate-400 shadow-2xl shadow-slate-950/20">
          Loading note details...
        </div>
      ) : (
        <div className="rounded-[32px] border border-slate-800/80 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Note details</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">{currentNote.title}</h1>
              <p className="mt-3 text-slate-400">{currentNote.subject} • {currentNote.branch} • Semester {currentNote.semester}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={handleDownload} className="btn-primary rounded-full px-5 py-3">
                <FiDownload /> Download
              </button>
              <button onClick={handleBookmark} className="btn-outline rounded-full px-5 py-3">
                <FiBookmark /> {isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-[28px] border border-slate-800/80 bg-slate-900/90 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Uploader</p>
              <div className="mt-4 flex items-center gap-3">
                <FiUser className="h-6 w-6 text-sky-300" />
                <p className="text-white">{currentNote.uploadedBy?.firstName || 'Unknown'}</p>
              </div>
            </div>
            <div className="rounded-[28px] border border-slate-800/80 bg-slate-900/90 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Downloads</p>
              <p className="mt-4 text-3xl font-semibold text-white">{currentNote.downloadCount || 0}</p>
            </div>
            <div className="rounded-[28px] border border-slate-800/80 bg-slate-900/90 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Rating</p>
              <p className="mt-4 flex items-center gap-2 text-3xl font-semibold text-white">
                <FiStar /> {currentNote.averageRating?.toFixed(1) || '0.0'}
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-[28px] border border-slate-800/80 bg-slate-900/90 p-8">
            <h2 className="text-2xl font-semibold text-white">Description</h2>
            <p className="mt-4 text-slate-400">{currentNote.description || 'No description provided for this note.'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
