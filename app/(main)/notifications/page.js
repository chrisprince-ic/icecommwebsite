'use client';

import { useState, useEffect } from 'react';
import { auth } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Notifications() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        router.push('/login');
        return;
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      const notificationsKey = `notifications_${user.uid}`;
      let userNotifications = JSON.parse(localStorage.getItem(notificationsKey) || '[]');
      
      // If no notifications exist, create some sample notifications
      if (userNotifications.length === 0) {
        userNotifications = [
          {
            id: 1,
            title: 'Welcome to IceComm!',
            message: 'Thank you for joining our community. Start exploring our amazing products.',
            type: 'welcome',
            read: false,
            timestamp: new Date().toISOString(),
            icon: '🎉'
          },
          {
            id: 2,
            title: 'New Product Alert',
            message: 'Check out our latest collection of premium electronics.',
            type: 'product',
            read: false,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            icon: '📱'
          },
          {
            id: 3,
            title: 'Special Offer',
            message: 'Get 20% off on your first purchase. Use code: WELCOME20',
            type: 'offer',
            read: false,
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            icon: '💰'
          },
          {
            id: 4,
            title: 'Order Update',
            message: 'Your order #12345 has been shipped and is on its way.',
            type: 'order',
            read: true,
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            icon: '📦'
          },
          {
            id: 5,
            title: 'Price Drop Alert',
            message: 'The price of your wishlist item has dropped by 15%.',
            type: 'price',
            read: true,
            timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            icon: '📉'
          }
        ];
        localStorage.setItem(notificationsKey, JSON.stringify(userNotifications));
      }
      
      setNotifications(userNotifications);
    }
  }, [user]);

  const markAsRead = (notificationId) => {
    if (user && typeof window !== 'undefined') {
      const notificationsKey = `notifications_${user.uid}`;
      const updatedNotifications = notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      );
      
      localStorage.setItem(notificationsKey, JSON.stringify(updatedNotifications));
      setNotifications(updatedNotifications);
      
      // Trigger notifications update event
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));
    }
  };

  const markAllAsRead = () => {
    if (user && typeof window !== 'undefined') {
      const notificationsKey = `notifications_${user.uid}`;
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      
      localStorage.setItem(notificationsKey, JSON.stringify(updatedNotifications));
      setNotifications(updatedNotifications);
      
      // Trigger notifications update event
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));
    }
  };

  const deleteNotification = (notificationId) => {
    if (user && typeof window !== 'undefined') {
      const notificationsKey = `notifications_${user.uid}`;
      const updatedNotifications = notifications.filter(notification => notification.id !== notificationId);
      
      localStorage.setItem(notificationsKey, JSON.stringify(updatedNotifications));
      setNotifications(updatedNotifications);
      
      // Trigger notifications update event
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'welcome':
        return '🎉';
      case 'product':
        return '📱';
      case 'offer':
        return '💰';
      case 'order':
        return '📦';
      case 'price':
        return '📉';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'welcome':
        return 'bg-gradient-to-r from-blue-500 to-purple-500';
      case 'product':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'offer':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'order':
        return 'bg-gradient-to-r from-indigo-500 to-blue-500';
      case 'price':
        return 'bg-gradient-to-r from-red-500 to-pink-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-2">
                {unreadCount > 0 
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : 'All caught up! No new notifications'
                }
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications yet</h3>
              <p className="text-gray-600 mb-6">We&apos;ll notify you about important updates, offers, and more.</p>
              <Link
                href="/categories"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-sm border-l-4 ${
                  notification.read ? 'border-gray-200' : 'border-blue-500'
                } p-6 transition-all duration-300 hover:shadow-md`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 ${getNotificationColor(notification.type)} rounded-full flex items-center justify-center text-white text-xl`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-lg font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                    </div>
                    <p className={`mt-2 ${notification.read ? 'text-gray-600' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-4 mt-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
