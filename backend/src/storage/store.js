import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { supabaseStorage } from './supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', '..', 'data');
const filePath = path.join(dataDir, 'app-data.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify({ users: [], notes: [], categories: [], bookmarks: [], downloads: [], ratings: [], notifications: [] }, null, 2));
}

const readStore = async () => {
  try {
    const data = await supabaseStorage.read();
    return data;
  } catch (error) {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  }
};

const writeStore = async (data) => {
  try {
    await supabaseStorage.write(data);
  } catch (error) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
};

const createId = () => crypto.randomUUID();

export const storage = {
  async getUsers() {
    return (await readStore()).users;
  },
  async getUserByEmail(email) {
    return (await readStore()).users.find((user) => user.email === email) || null;
  },
  async getUserById(id) {
    return (await readStore()).users.find((user) => user.id === id) || null;
  },
  async saveUser(user) {
    const data = await readStore();
    const normalized = { ...user, id: user.id || createId(), createdAt: user.createdAt || new Date().toISOString() };
    data.users = data.users.filter((item) => item.id !== normalized.id);
    data.users.push(normalized);
    await writeStore(data);
    return normalized;
  },
  async updateUser(id, updates) {
    const data = await readStore();
    const index = data.users.findIndex((user) => user.id === id);
    if (index === -1) return null;
    data.users[index] = { ...data.users[index], ...updates, updatedAt: new Date().toISOString() };
    await writeStore(data);
    return data.users[index];
  },
  async deleteUser(id) {
    const data = await readStore();
    data.users = data.users.filter((user) => user.id !== id);
    data.notes = data.notes.filter((note) => note.uploadedBy !== id);
    data.bookmarks = data.bookmarks.filter((bookmark) => bookmark.userId !== id);
    data.downloads = data.downloads.filter((download) => download.userId !== id);
    data.ratings = data.ratings.filter((rating) => rating.userId !== id);
    data.notifications = data.notifications.filter((notification) => notification.userId !== id);
    await writeStore(data);
    return true;
  },
  async getNotes() {
    return (await readStore()).notes;
  },
  async getNoteById(id) {
    return (await readStore()).notes.find((note) => note.id === id) || null;
  },
  async saveNote(note) {
    const data = await readStore();
    const normalized = { ...note, id: note.id || createId(), createdAt: note.createdAt || new Date().toISOString() };
    data.notes = data.notes.filter((item) => item.id !== normalized.id);
    data.notes.push(normalized);
    await writeStore(data);
    return normalized;
  },
  async updateNote(id, updates) {
    const data = await readStore();
    const index = data.notes.findIndex((note) => note.id === id);
    if (index === -1) return null;
    data.notes[index] = { ...data.notes[index], ...updates, updatedAt: new Date().toISOString() };
    await writeStore(data);
    return data.notes[index];
  },
  async deleteNote(id) {
    const data = await readStore();
    data.notes = data.notes.filter((note) => note.id !== id);
    data.bookmarks = data.bookmarks.filter((bookmark) => bookmark.noteId !== id);
    data.downloads = data.downloads.filter((download) => download.noteId !== id);
    data.ratings = data.ratings.filter((rating) => rating.noteId !== id);
    data.notifications = data.notifications.filter((notification) => notification.relatedNote !== id);
    await writeStore(data);
    return true;
  },
  async getCategories() {
    return (await readStore()).categories;
  },
  async saveCategory(category) {
    const data = await readStore();
    const normalized = { ...category, id: category.id || createId(), createdAt: category.createdAt || new Date().toISOString() };
    data.categories = data.categories.filter((item) => item.id !== normalized.id);
    data.categories.push(normalized);
    await writeStore(data);
    return normalized;
  },
  async updateCategory(id, updates) {
    const data = await readStore();
    const index = data.categories.findIndex((item) => item.id === id);
    if (index === -1) return null;
    data.categories[index] = { ...data.categories[index], ...updates, updatedAt: new Date().toISOString() };
    await writeStore(data);
    return data.categories[index];
  },
  async deleteCategory(id) {
    const data = await readStore();
    data.categories = data.categories.filter((item) => item.id !== id);
    await writeStore(data);
    return true;
  },
  async saveBookmark(bookmark) {
    const data = await readStore();
    const normalized = { ...bookmark, id: bookmark.id || createId(), createdAt: bookmark.createdAt || new Date().toISOString() };
    data.bookmarks = data.bookmarks.filter((item) => !(item.noteId === normalized.noteId && item.userId === normalized.userId));
    data.bookmarks.push(normalized);
    await writeStore(data);
    return normalized;
  },
  async removeBookmark(noteId, userId) {
    const data = await readStore();
    data.bookmarks = data.bookmarks.filter((item) => !(item.noteId === noteId && item.userId === userId));
    await writeStore(data);
    return true;
  },
  async getBookmark(noteId, userId) {
    return (await readStore()).bookmarks.find((bookmark) => bookmark.noteId === noteId && bookmark.userId === userId) || null;
  },
  async saveDownload(download) {
    const data = await readStore();
    const normalized = { ...download, id: download.id || createId(), downloadedAt: download.downloadedAt || new Date().toISOString() };
    data.downloads = data.downloads.filter((item) => !(item.noteId === normalized.noteId && item.userId === normalized.userId));
    data.downloads.push(normalized);
    await writeStore(data);
    return normalized;
  },
  async saveRating(rating) {
    const data = await readStore();
    const normalized = { ...rating, id: rating.id || createId(), createdAt: rating.createdAt || new Date().toISOString() };
    data.ratings = data.ratings.filter((item) => !(item.noteId === normalized.noteId && item.userId === normalized.userId));
    data.ratings.push(normalized);
    await writeStore(data);
    return normalized;
  },
  async getRatings(noteId) {
    return (await readStore()).ratings.filter((rating) => rating.noteId === noteId);
  },
  async saveNotification(notification) {
    const data = await readStore();
    const normalized = { ...notification, id: notification.id || createId(), createdAt: notification.createdAt || new Date().toISOString() };
    data.notifications = data.notifications.filter((item) => item.id !== normalized.id);
    data.notifications.push(normalized);
    await writeStore(data);
    return normalized;
  },
  async getNotifications(userId) {
    return (await readStore()).notifications.filter((notification) => notification.userId === userId);
  },
  async updateNotification(id, updates) {
    const data = await readStore();
    const index = data.notifications.findIndex((notification) => notification.id === id);
    if (index === -1) return null;
    data.notifications[index] = { ...data.notifications[index], ...updates, updatedAt: new Date().toISOString() };
    await writeStore(data);
    return data.notifications[index];
  },
  async deleteNotification(id) {
    const data = await readStore();
    data.notifications = data.notifications.filter((notification) => notification.id !== id);
    await writeStore(data);
    return true;
  },
};
