import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create a single socket instance that can be reused
export const socket = io(import.meta.env.VITE_LOCAL_BASE_URL, {
  withCredentials: true,
});

export function socketIo(eventName, callback) {
  // Remove any existing listeners for this event to prevent duplicates
  socket.off(eventName);

  // Add the new listener
  socket.on(eventName, ({ data, message }) => {
    if (callback) {
      callback({ data, message });
    }
  });
}

// Optional: Add a cleanup function
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
  }
}

// GET ONLINE USERS TRU SOCKET IO
export function useGetSocketData(eventName) {
  const [socketData, setSocketData] = useState({ data: null, message: null });

  useEffect(() => {
    // Ensure socket is connected
    if (!socket.connected) {
      socket.connect();
    }

    socket.on(eventName, ({ data, message }) => {
      setSocketData({ data, message });
    });

    // Cleanup on component unmount
    return () => {
      socket.off(eventName);
    };
  }, [eventName]);

  return socketData;
}
