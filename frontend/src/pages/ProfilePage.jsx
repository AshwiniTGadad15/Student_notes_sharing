import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import { FiMail, FiUser, FiBook } from 'react-icons/fi';

export default function ProfilePage() {
  const { user, getProfile, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    university: '',
    branch: '',
    semester: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        university: user.university || '',
        branch: user.branch || 'OTHER',
        semester: user.semester || '1',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
      getProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update profile');
    }
  };

  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[32px] border border-slate-800/80 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/20">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-slate-800/80 flex items-center justify-center text-sky-300 text-2xl">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-white">{user?.firstName} {user?.lastName}</h1>
              <p className="text-slate-400">{user?.role?.toUpperCase() || 'STUDENT'} account</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-900/90 p-5">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Email</p>
              <p className="mt-2 text-slate-200">{user?.email}</p>
            </div>
            <div className="rounded-3xl bg-slate-900/90 p-5">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">University</p>
              <p className="mt-2 text-slate-200">{user?.university || 'Not set'}</p>
            </div>
            <div className="rounded-3xl bg-slate-900/90 p-5">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Branch</p>
              <p className="mt-2 text-slate-200">{user?.branch || 'OTHER'}</p>
            </div>
            <div className="rounded-3xl bg-slate-900/90 p-5">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Semester</p>
              <p className="mt-2 text-slate-200">{user?.semester || '1'}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-800/80 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/20">
          <h2 className="text-2xl font-semibold text-white">Update profile</h2>
          <p className="mt-2 text-slate-400">Edit your details and save changes to keep your account current.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300">First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300">University</label>
                <input
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Branch</label>
                <select
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
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Semester</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="input-field"
              >
                {Array.from({ length: 8 }, (_, index) => index + 1).map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>

            <button className="btn-primary w-full">Save changes</button>
          </form>
        </section>
      </div>
    </div>
  );
}
