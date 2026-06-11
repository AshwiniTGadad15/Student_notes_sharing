import { Link } from 'react-router-dom';
import { FiMenu, FiLogOut, FiBell } from 'react-icons/fi';
import { useAuthStore } from '../stores/authStore';
import { useState } from 'react';

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <nav className="border-b border-slate-800/90 bg-slate-950/95 shadow-lg shadow-slate-950/20 sticky top-0 z-40 backdrop-blur-xl">
      <div className="container flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-4">
          <button onClick={onMenuToggle} className="rounded-2xl bg-slate-900/80 p-2 text-slate-200 transition hover:bg-slate-800">
            <FiMenu size={24} />
          </button>
          <Link to="/" className="text-xl font-bold tracking-tight text-white">
            <span className="text-sky-400">Rostar</span> Hub
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative rounded-2xl border border-slate-800/90 bg-slate-900/80 p-2 text-slate-200 transition hover:border-sky-400">
            <FiBell size={20} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500 shadow-lg shadow-rose-500/30"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 rounded-2xl border border-slate-800/90 bg-slate-900/80 px-4 py-2 text-slate-100 transition hover:border-sky-400"
            >
              <img
                src={user?.profileImage || 'https://via.placeholder.com/32'}
                alt="Profile"
                className="h-9 w-9 rounded-full object-cover"
              />
              <span className="hidden sm:inline font-medium">{user?.firstName || 'Student'}</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-3xl border border-slate-800/90 bg-slate-950/95 shadow-2xl shadow-slate-950/40 py-2 backdrop-blur-xl">
                <Link
                  to="/profile"
                  onClick={() => setShowDropdown(false)}
                  className="block px-4 py-3 text-sm text-slate-100 transition hover:bg-slate-900"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-rose-300 transition hover:bg-slate-900"
                >
                  <FiLogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
