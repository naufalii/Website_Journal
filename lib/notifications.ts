'use client';

const NOTIFICATION_STORAGE_KEY = 'pw_notifications_enabled';

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
    } else {
      setNotificationsEnabled(false);
    }
    return permission;
  } catch (err) {
    console.error('Failed to request notification permission:', err);
    return 'denied';
  }
}

export function areNotificationsEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  if (!isNotificationSupported()) return false;
  if (Notification.permission !== 'granted') return false;
  const stored = window.localStorage.getItem(NOTIFICATION_STORAGE_KEY);
  return stored !== 'false';
}

export function setNotificationsEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(NOTIFICATION_STORAGE_KEY, enabled ? 'true' : 'false');
}

export async function sendScheduleNotification(
  title: string,
  body: string,
  tag?: string
): Promise<boolean> {
  if (!areNotificationsEnabled()) return false;

  try {
    // If Service Worker is active, use showNotification
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.showNotification) {
        await reg.showNotification(title, {
          body,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
          tag: tag || 'schedule-reminder',
        } as NotificationOptions);
        return true;
      }
    }

    // Fallback to standard web notification
    new Notification(title, {
      body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      tag: tag || 'schedule-reminder',
    });
    return true;
  } catch (err) {
    console.error('Failed to send notification:', err);
    return false;
  }
}
