import { motion } from 'framer-motion';
import { FiBarChart2, FiClipboard, FiUsers, FiShield } from 'react-icons/fi';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '1.2K', icon: FiUsers },
    { label: 'Pending Notes', value: '24', icon: FiClipboard },
    { label: 'Active Admins', value: '3', icon: FiShield },
    { label: 'System Health', value: 'Stable', icon: FiBarChart2 },
  ];

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[32px] border border-slate-800/80 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/20"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Admin control</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Administrator Dashboard</h1>
            <p className="mt-3 text-slate-400 max-w-2xl">Monitor uploads, approve pending notes, and manage study community activity from one secure panel.</p>
          </div>
          <button className="btn-primary">Review pending items</button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-[28px] border border-slate-800/80 bg-slate-900/90 p-6">
                <div className="flex items-center gap-4 text-sky-300">
                  <div className="rounded-2xl bg-slate-800/90 p-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400">{stat.label}</p>
                </div>
                <p className="mt-6 text-3xl font-semibold text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
