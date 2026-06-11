import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { useNotesStore } from '../stores/notesStore';
import featureIllustration from '../assets/feature-illustration.svg';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { notes, searchLoading, searchNotes } = useNotesStore();

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;

    try {
      await searchNotes(query.trim());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container py-8">
      <div className="rounded-[32px] border border-slate-800/80 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white">Search Notes</h1>
            <p className="mt-3 text-slate-400 max-w-2xl">Search by title, subject, or author to find the best study materials.</p>
          </div>
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/90 px-5 py-4 flex items-center gap-3 text-slate-300">
            <FiSearch className="h-5 w-5 text-sky-300" />
            <span>Search hub</span>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[32px] border border-slate-800/80 bg-white/95 p-4 shadow-2xl shadow-slate-950/20">
          <img
            src={featureIllustration}
            alt="Smart study search illustration"
            className="w-full object-contain"
          />
        </div>

        <form onSubmit={handleSearch} className="mt-10 flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by subject, title, or author"
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary inline-flex items-center justify-center gap-2">
            <FiSearch /> Search
          </button>
        </form>

        <div className="mt-10 grid gap-4">
          {searchLoading ? (
            <div className="rounded-[28px] border border-slate-800/80 bg-slate-900/90 p-10 text-center text-slate-400">Searching notes...</div>
          ) : notes.length === 0 ? (
            <div className="rounded-[28px] border border-slate-800/80 bg-slate-900/90 p-10 text-center text-slate-400">Start a search to display notes here.</div>
          ) : (
            notes.map((note) => (
              <div key={note._id} className="rounded-[28px] border border-slate-800/80 bg-slate-900/90 p-6 shadow-inner">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{note.title}</h2>
                    <p className="mt-2 text-slate-400">{note.subject} • {note.branch} • Semester {note.semester}</p>
                  </div>
                  <Link to={`/note/${note._id}`} className="btn-outline">View Details</Link>
                </div>
                <p className="mt-4 text-slate-400">{note.description || 'No description available.'}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
