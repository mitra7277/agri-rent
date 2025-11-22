// src/context/NotificationContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";

const NotificationContext = createContext();

let idCounter = 1;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("notifications");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((payload) => {
    const now = new Date();
    setNotifications((prev) => [
      {
        id: idCounter++,
        title: payload.title || "Notification",
        message: payload.message || "",
        time: now.toLocaleTimeString(),
        read: false,
      },
      ...prev,
    ]);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleOpen = () => {
    setIsOpen((o) => !o);
    if (!isOpen) {
      // dropdown open hone par sab read
      markAllRead();
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isOpen,
        toggleOpen,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
