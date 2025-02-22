const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const chatBox = document.getElementById('chatBox');
const chatInput = document.getElementById('chatInput');
const nameInput = document.getElementById('nameInput');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const socket = io();

let players = {}; 

function drawPlayers() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const id in players) {
    const player = players[id];
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x * 50 + canvas.width / 2, player.y * 50 + canvas.height / 2, 50, 50);

    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(player.name, player.x * 50 + canvas.width / 2 + 25, player.y * 50 + canvas.height / 2 - 10);
  }
}

socket.on('init', (data) => {
  players = data;
  drawPlayers();
});

socket.on('update', (data) => {
  players = data;
  drawPlayers();
});

document.addEventListener('keydown', (e) => {
  let direction;
  switch (e.key) {
    case 'w':
      direction = 'up';
      break;
    case 'a':
      direction = 'left';
      break;
    case 's':
      direction = 'down';
      break;
    case 'd':
      direction = 'right';
      break;
    default:
      return;
  }
  socket.emit('move', direction);
});

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && chatInput.value) {
    const message = chatInput.value;
    socket.emit('chatMessage', message);
    chatInput.value = '';
  }
});

nameInput.addEventListener('change', () => {
  const name = nameInput.value.trim();
  if (name) {
    socket.emit('setName', name);
  }
});

socket.on('chatMessage', (data) => {
  const player = players[data.id] ? players[data.id].name || `Player ${data.id.slice(0, 5)}` : 'Unknown';
  const messageElement = document.createElement('div');
  messageElement.textContent = `${player}: ${data.message}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
});
