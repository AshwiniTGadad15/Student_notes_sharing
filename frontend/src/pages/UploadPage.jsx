import { useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useNotesStore } from '../stores/notesStore';
import featureIllustration from '../assets/feature-illustration.svg';

const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER'];

export default function UploadPage() {
  const { uploadNote, loading } = useNotesStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    university: '',
    category: '',
    branch: 'OTHER',
    semester: '1',
    tags: '',
    file: null,
  });

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title || !formData.subject || !formData.file) {
      toast.error('Please provide a title, subject, and file.');
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) data.append(key, value);
    });

    try {
      await uploadNote(data);
      toast.success('Note uploaded successfully and sent for review.');
      setFormData({
        title: '',
        description: '',
        subject: '',
        university: '',
        category: '',
        branch: 'OTHER',
        semester: '1',
        tags: '',
        file: null,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed.');
    }
  };

  return (
    <div className="container py-8">
      <div className="rounded-[32px] border border-slate-800/80 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white">Upload Notes</h1>
            <p className="mt-3 text-slate-400 max-w-2xl">Share your study resources and help others learn faster.</p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-900/90 px-5 py-4 text-slate-300">
            <FiUploadCloud className="h-5 w-5 text-sky-300" />
            <span>Upload a file</span>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-[32px] border border-slate-800/80 bg-white/95 p-4 shadow-2xl shadow-slate-950/20">
          <img
            src={featureIllustration}
            alt="AI note upload illustration"
            className="w-full object-contain"
          />
        </div>

        <form onSubmit={handleSubmit} className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Note title"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Subject</label>
            <input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="input-field"
              placeholder="Subject or course"
            />
          </div>

          <div className="space-y-4 lg:col-span-2">
            <label className="block text-sm font-medium text-slate-300">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field min-h-[140px]"
              placeholder="Short summary of the notes"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">University</label>
            <input
              name="university"
              value={formData.university}
              onChange={handleChange}
              className="input-field"
              placeholder="University name"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Category</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Lecture, Exam Notes"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Branch</label>
            <select name="branch" value={formData.branch} onChange={handleChange} className="input-field">
              {branches.map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Semester</label>
            <select name="semester" value={formData.semester} onChange={handleChange} className="input-field">
              {Array.from({ length: 8 }, (_, index) => index + 1).map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <label className="block text-sm font-medium text-slate-300">Tags</label>
            <input
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="input-field"
              placeholder="Comma-separated tags"
            />
          </div>

          <div className="space-y-4 lg:col-span-2">
            <label className="block text-sm font-medium text-slate-300">File</label>
            <input
              type="file"
              name="file"
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/90 px-4 py-3 text-slate-100"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary lg:col-span-2">
            {loading ? 'Uploading...' : 'Upload Note'}
          </button>
        </form>
      </div>
    </div>
  );
}
