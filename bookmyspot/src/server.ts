import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { initializeSocket } from './lib/socket';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = initializeSocket(server);

  // Handle socket events
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Handle spot availability updates
    socket.on('updateSpotAvailability', async (data) => {
      socket.broadcast.emit(`spot:${data.spotId}:availability`, data);
    });

    // Handle booking updates
    socket.on('bookingUpdate', async (data) => {
      io.emit(`booking:${data.bookingId}:status`, data);
    });
  });

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});
