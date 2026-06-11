import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    branch: 'OTHER',
    semester: '1',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      await register(formData);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl rounded-[36px] border border-slate-800/80 bg-slate-950/95 p-8 shadow-2xl shadow-sky-500/10"
      >
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Create your account</p>
          <h1 className="mt-4 text-4xl font-bold text-white">Join Rostar Notes Hub</h1>
          <p className="mt-3 text-slate-400">Build your profile, upload notes, and join the smartest study community.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 md:col-span-2">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-300">First Name</label>
                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-950/90 px-4 py-3">
                  <FiUser className="text-sky-400" />
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input-field bg-transparent focus:ring-0"
                    placeholder="John"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-300">Last Name</label>
                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-950/90 px-4 py-3">
                  <FiUser className="text-sky-400" />
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input-field bg-transparent focus:ring-0"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-950/90 px-4 py-3">
              <FiMail className="text-sky-400" />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field bg-transparent focus:ring-0"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label htmlFor="university" className="block text-sm font-medium text-slate-300">University</label>
            <input
              id="university"
              type="text"
              name="university"
              value={formData.university}
              onChange={handleChange}
              className="input-field"
              placeholder="Your University"
            />
          </div>

          <div className="space-y-4">
            <label htmlFor="branch" className="block text-sm font-medium text-slate-300">Branch</label>
            <select
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="input-field"
            >
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>

          <div className="space-y-4">
            <label htmlFor="semester" className="block text-sm font-medium text-slate-300">Semester</label>
            <select
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="input-field"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">Password</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-950/90 px-4 py-3">
              <FiLock className="text-sky-400" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field bg-transparent focus:ring-0"
                placeholder="Choose a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-100"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">Confirm Password</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-950/90 px-4 py-3">
              <FiLock className="text-sky-400" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field bg-transparent focus:ring-0"
                placeholder="Repeat your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-slate-400 hover:text-slate-100"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-slate-400 md:col-span-2">
          <p>
            Already registered?{' '}
            <Link to="/login" className="text-sky-300 underline-offset-4 hover:text-sky-200 hover:underline">
              Sign in instead
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
