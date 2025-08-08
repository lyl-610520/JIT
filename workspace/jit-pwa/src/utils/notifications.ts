export async function requestNotifyPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied'
  const perm = await Notification.requestPermission()
  return perm
}

export function showLocalNotification(title: string, options?: NotificationOptions) {
  if ('serviceWorker' in navigator && 'showNotification' in ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.getRegistration().then(reg => reg?.showNotification(title, options))
  } else if ('Notification' in window) {
    new Notification(title, options)
  }
}

// Schedule using Notification Triggers API if available
export function scheduleNotificationAt(timestamp: number, title: string, options?: NotificationOptions) {
  const anyWindow = window as any
  if ('serviceWorker' in navigator && anyWindow?.Notification?.prototype?.showTrigger) {
    navigator.serviceWorker.getRegistration().then(reg => {
      const trigger = new (anyWindow as any).TimestampTrigger(timestamp)
      reg?.showNotification(title, { ...(options as any), showTrigger: trigger } as any)
    })
  }
}