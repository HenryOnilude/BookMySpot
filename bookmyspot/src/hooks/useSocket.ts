import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

export function useSocket() {
  const socket = useRef<Socket>();

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000');
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  return socket.current;
}
