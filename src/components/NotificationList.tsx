import React from 'react';
import { Notification, NotificationType } from '../hooks/useNotification';
import './NotificationList.css';

interface NotificationListProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const getNotificationIcon = (type: NotificationType): string => {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '⚠';
    case 'info':
      return 'ℹ';
    default:
      return 'ℹ';
  }
};

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onRemove,
}) => {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification--${notification.type}`}
        >
          <div className="notification-icon">
            {getNotificationIcon(notification.type)}
          </div>
          <div className="notification-content">
            <div className="notification-title">
              {notification.title}
            </div>
            {notification.message && (
              <div className="notification-message">
                {notification.message}
              </div>
            )}
          </div>
          <button
            className="notification-close"
            onClick={() => onRemove(notification.id)}
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
