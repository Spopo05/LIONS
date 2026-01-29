import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Bell, X, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state);

  // Load notifications for current user
  useEffect(() => {
    if (user && user.id) {
      const storageKey = `notifications_${user.id}`;
      const savedNotifications = localStorage.getItem(storageKey);
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
    }
  }, [user]);

  // Save user-specific notifications
  useEffect(() => {
    if (user && user.id && notifications.length > 0) {
      const storageKey = `notifications_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  // Add a new notification
  const addNotification = (title, message, type = 'info', demandId = null) => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      type,
      demandId,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Clear all notifications for current user
  const clearAllNotifications = () => {
    if (user && user.id) {
      const storageKey = `notifications_${user.id}`;
      localStorage.removeItem(storageKey);
      setNotifications([]);
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="notification-icon success" />;
      case 'warning':
        return <AlertCircle size={20} className="notification-icon warning" />;
      case 'error':
        return <XCircle size={20} className="notification-icon error" />;
      default:
        return <Clock size={20} className="notification-icon info" />;
    }
  };

  // Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-container">
      {/* Notification Bell */}
      <div className="notification-bell" onClick={() => setIsOpen(!isOpen)}>
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      {/* Notifications Panel */}
      {isOpen && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <div className="notifications-actions">
              {unreadCount > 0 && (
                <button 
                  className="btn-mark-all" 
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </button>
              )}
              {notifications.length > 0 && (
                <button 
                  className="btn-clear-all" 
                  onClick={clearAllNotifications}
                >
                  Clear all
                </button>
              )}
              <button 
                className="btn-close-panel" 
                onClick={() => setIsOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="empty-notifications">
                <Bell size={48} className="empty-icon" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-icon-container">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">
                      {formatTime(notification.timestamp)}
                    </div>
                  </div>
                  <button 
                    className="btn-delete-notification"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Export function to add notifications from other components
export const addDemandNotification = (userEmail, demandTitle, status, isAdmin = false, targetUserId = null) => {
  // Generate a unique key for each user's notifications
  const storageKey = targetUserId ? `notifications_${targetUserId}` : 'notifications_global';
  const notifications = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  let title = '';
  let message = '';
  let type = 'info';

  switch (status) {
    case 'submitted':
      title = 'New Demand Submitted';
      message = `Your demand "${demandTitle}" has been submitted successfully.`;
      type = 'info';
      break;
    
    case 'approved':
      if (isAdmin) {
        title = 'Demand Approved';
        message = `You have approved the demand "${demandTitle}" from ${userEmail}.`;
        type = 'success';
      } else {
        title = 'Demand Approved!';
        message = `Your demand "${demandTitle}" has been approved by the administrator.`;
        type = 'success';
      }
      break;
    
    case 'rejected':
      if (isAdmin) {
        title = 'Demand Rejected';
        message = `You have rejected the demand "${demandTitle}" from ${userEmail}.`;
        type = 'error';
      } else {
        title = 'Demand Rejected';
        message = `Your demand "${demandTitle}" has been rejected by the administrator.`;
        type = 'error';
      }
      break;
    
    case 'pending':
      if (isAdmin) {
        title = 'New Demand Pending';
        message = `A new demand "${demandTitle}" from ${userEmail} requires your approval.`;
        type = 'warning';
      } else {
        title = 'Demand Pending';
        message = `Your demand "${demandTitle}" is pending administrator approval.`;
        type = 'info';
      }
      break;
    
    case 'cancelled':
      title = 'Demand Cancelled';
      message = `Your demand "${demandTitle}" has been cancelled.`;
      type = 'info';
      break;
      
    default:
      title = 'Demand Update';
      message = `Your demand "${demandTitle}" has been updated. Status: ${status}`;
      type = 'info';
      break;
  }

  const newNotification = {
    id: Date.now(),
    title,
    message,
    type,
    timestamp: new Date().toISOString(),
    read: false,
    targetUserId: targetUserId || 'global'
  };

  notifications.unshift(newNotification);
  localStorage.setItem(storageKey, JSON.stringify(notifications));
  
  // Trigger storage event for other tabs
  window.dispatchEvent(new Event('storage'));
};

export default Notifications;