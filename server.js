const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const players = {};

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A player connected: ' + socket.id);

  players[socket.id] = { x: 0, y: 0, name: 'Unnamed' };

  socket.emit('init', players);

  socket.on('setName', (name) => {
    if (players[socket.id]) {
      players[socket.id].name = name || 'Unnamed';
      io.emit('update', players);
    }
  });

  socket.on('move', (direction) => {
    const player = players[socket.id];
    if (player) {
      switch (direction) {
        case 'up':
          player.y -= 1;
          break;
        case 'left':
          player.x -= 1;
          break;
        case 'down':
          player.y += 1;
          break;
        case 'right':
          player.x += 1;
          break;
      }
      io.emit('update', players);
    }
  });

  socket.on('disconnect', () => {
    console.log('A player disconnected: ' + socket.id);
    delete players[socket.id];
    io.emit('update', players);
  });
});

const PORT = 1413;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
