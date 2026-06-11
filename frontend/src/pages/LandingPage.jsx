import { Link } from 'react-router-dom';
import { FiArrowRight, FiBook, FiUsers, FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';
import featureIllustration from '../assets/feature-illustration.svg';

export default function LandingPage() {
  const stats = [
    { label: 'Active Students', value: '12K+' },
    { label: 'Shared Notes', value: '58K+' },
    { label: 'Fast Downloads', value: '220K+' },
  ];

  const features = [
    {
      icon: FiBook,
      title: 'Quick Uploads',
      description: 'Upload notes instantly with a fast, secure workflow.',
    },
    {
      icon: FiDownload,
      title: 'Smart Search',
      description: 'Find notes by course, author, and subject in seconds.',
    },
    {
      icon: FiUsers,
      title: 'Study Network',
      description: 'Collaborate with classmates and share resources safely.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-4">
          <Link to="/" className="text-2xl font-bold tracking-tight text-white">
            <span className="text-sky-400">Rostar</span> Notes Hub
          </Link>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/login"
              className="rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-400 hover:text-white"
            >
              Login
            </Link>
            <Link to="/register" className="btn-primary">
              Create account
            </Link>
          </div>
        </div>
      </nav>

      <main className="container py-20">
        <section className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex rounded-full bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-300"
            >
              High-impact notes, built for serious learners
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="section-title mt-8 max-w-3xl text-5xl leading-tight"
            >
              A stronger note-sharing experience with sleek study workflows.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="section-subtitle mt-6 text-lg leading-8"
            >
              Share notes, search content, and manage your study materials with a modern dashboard designed for a polished campus community.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Link to="/register" className="btn-primary">
                Start sharing now
                <FiArrowRight className="ml-2" />
              </Link>
              <Link to="/login" className="btn-secondary">
                Login to dashboard
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Study smart</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Simplify note discovery</h2>
              </div>
              <div className="rounded-full bg-slate-900/90 px-4 py-3 text-sm text-sky-300">
                2024 Edition
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              {features.map((feature, index) => (
                <div key={feature.title} className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-5 transition hover:border-sky-500/40">
                  <div className="flex items-center gap-3 text-sky-400">
                    <feature.icon className="h-6 w-6" />
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  </div>
                  <p className="mt-3 text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 overflow-hidden rounded-[32px] border border-slate-800/80 bg-white/90 shadow-2xl shadow-slate-950/20">
              <img
                src={featureIllustration}
                alt="Modern study notes feature illustration"
                className="w-full object-contain"
              />
            </div>
          </motion.div>
        </section>

        <section className="mt-20 grid gap-6 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="card"
            >
              <p className="text-sm uppercase tracking-[0.25em] text-sky-300">{stat.label}</p>
              <p className="mt-4 text-4xl font-semibold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </section>
      </main>

      <section className="bg-slate-900/95 border-t border-slate-800/90 py-16">
        <div className="container grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-4xl font-bold text-white">Take your study routine to the next level.</h2>
            <p className="mt-4 text-slate-400 leading-8">Use Rostar Notes Hub for a polished, secure way to share lecture notes, exam prep, and project guides with your classmates.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-6">
              <p className="text-sm text-sky-300">Professional layout</p>
              <p className="mt-3 text-slate-300">A modern interface with consistent black and blue accents.</p>
            </div>
            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-6">
              <p className="text-sm text-sky-300">Secure authentication</p>
              <p className="mt-3 text-slate-300">Login, register, and access your dashboard with confidence.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800/90 py-10 text-center text-slate-500">
        <p>&copy; 2024 Rostar Notes Hub. Built for focused study communities.</p>
      </footer>
    </div>
  );
}
