import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiUpload, FiBookmark, FiSettings, FiBarChart2, FiChevronRight } from 'react-icons/fi';
import { useAuthStore } from '../stores/authStore';

const menuItems = [
  { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { path: '/search', icon: FiSearch, label: 'Search Notes' },
  { path: '/upload', icon: FiUpload, label: 'Upload' },
  { path: '/bookmarks', icon: FiBookmark, label: 'Bookmarks' },
];

const adminMenuItems = [
  { path: '/admin', icon: FiBarChart2, label: 'Admin Panel' },
  { path: '/admin/pending', icon: FiSettings, label: 'Pending Notes' },
];

export default function Sidebar({ isOpen }) {
  const location = useLocation();
  const { user } = useAuthStore();

  const items = user?.role === 'admin' ? [...menuItems, ...adminMenuItems] : menuItems;

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} sticky top-16 h-screen overflow-y-auto border-r border-slate-800/80 bg-slate-950/95 shadow-2xl shadow-slate-950/20 transition-all duration-300`}>
      <div className="p-4 space-y-3">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-500/20'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Icon size={20} />
              {isOpen && <span>{item.label}</span>}
              {isOpen && isActive && <FiChevronRight className="ml-auto" />}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
