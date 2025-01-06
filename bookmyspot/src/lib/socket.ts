import { Server as SocketIOServer } from 'socket.io';
import { Server as NetServer } from 'http';

export function initializeSocket(server: NetServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      methods: ["GET", "POST"]
    }
  });

  return io;
}
