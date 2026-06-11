import Notification from '../models/Notification.js';

export const createNotification = async (userId, type, title, message, relatedNote = null, relatedUser = null) => {
  const notification = new Notification({
    userId,
    type,
    title,
    message,
    relatedNote,
    relatedUser,
  });

  await notification.save();
  return notification;
};

export const getUserNotifications = async (userId, limit = 20) => {
  return await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('relatedNote', 'title')
    .populate('relatedUser', 'firstName lastName profileImage');
};

export const markNotificationAsRead = async (notificationId) => {
  return await Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true }
  );
};

export const markAllNotificationsAsRead = async (userId) => {
  return await Notification.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );
};

export const deleteNotification = async (notificationId) => {
  return await Notification.findByIdAndDelete(notificationId);
};

export const getUnreadCount = async (userId) => {
  return await Notification.countDocuments({
    userId,
    isRead: false,
  });
};
