const { Server } = require('socket.io');
const { createServer } = require('http');
require('dotenv').config();
const { PORT = 3000 } = process.env;
const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const initialGameState = {
  playerSongText: [],
  comparedResult: [
    'notCompared',
    'notCompared',
    'notCompared',
    'notCompared',
    'notCompared',
    'notCompared',
  ],
  isPlayerWon: false,
  isResultCompared: false,
  itemInfo: { idx: null, isItemOpen: false },
};

io.on('connection', socket => {
  const rooms = io.of('/').adapter.rooms;
  let pass = (Date.now() + '').substring(9);

  socket.on('create', data => {
    socket.join(pass);
    socket.emit('room-pass', pass);
    rooms.get(pass).add({
      firstPlayerName: data.playerName,
      secondPlayerName: null,
      song: {},
      gameState: initialGameState,
    });
  });

  socket.on('join', data => {
    if (!rooms.has(data.password)) {
      return;
    }
    socket.join(data.password);
    [...rooms.get(data.password)][1].secondPlayerName = data.playerName;
    io.to(data.password).emit('get-data', [...rooms.get(data.password)][1]);

    io.to(data.password).emit('start-game', { start: true });

    pass = data.password;
  });

  socket.on('set-song', ({ song }) => {
    [...rooms.get(pass)][1].song = song;

    io.to(pass).emit('get-song', [...rooms.get(pass)][1].song);
  });

  socket.on('set-playerSongText', ({ playerSongText }) => {
    [...rooms.get(pass)][1].gameState.playerSongText = playerSongText;

    io.to(pass).emit(
      'get-playerSongText',
      [...rooms.get(pass)][1].gameState.playerSongText
    );
  });

  socket.on('set-comparedResult', ({ comparedResult }) => {
    [...rooms.get(pass)][1].gameState.comparedResult = comparedResult;

    io.to(pass).emit(
      'get-comparedResult',
      [...rooms.get(pass)][1].gameState.comparedResult
    );
  });

  socket.on('set-isPlayerWon', ({ isPlayerWon }) => {
    [...rooms.get(pass)][1].gameState.isPlayerWon = isPlayerWon;

    io.to(pass).emit(
      'get-isPlayerWon',
      [...rooms.get(pass)][1].gameState.isPlayerWon
    );
  });

  socket.on('set-isResultCompared', ({ isResultCompared }) => {
    [...rooms.get(pass)][1].gameState.isResultCompared = isResultCompared;

    io.to(pass).emit(
      'get-isResultCompared',
      [...rooms.get(pass)][1].gameState.isResultCompared
    );
  });
  socket.on('set-isItemOpen', data => {
    // [...rooms.get(pass)][1].gameState.isResultCompared = isResultCompared;

    io.to(pass).emit('get-isItemOpen', data);
  });

  socket.on('set-isUserAddWord', data => {
    // [...rooms.get(pass)][1].gameState.isResultCompared = isResultCompared;

    io.to(pass).emit('get-isUserAddWord', data);
  });

  socket.on('set-itemText', data => {
    // [...rooms.get(pass)][1].gameState.isResultCompared = isResultCompared;

    io.to(pass).emit('get-itemText', data);
  });

  socket.on('set-gameProcess', data => {
    // [...rooms.get(pass)][1].gameState.isResultCompared = isResultCompared;

    io.to(pass).emit('get-gameProcess', data);
  });

  socket.on('set-changePlayer', data => {
    // [...rooms.get(pass)][1].gameState.isResultCompared = isResultCompared;

    // io.to(pass).emit('get-changePlayer', data);
    socket.to(pass).emit('get-changePlayer', data);
  });

  socket.on('set-changeScore', data => {
    // [...rooms.get(pass)][1].gameState.isResultCompared = isResultCompared;
    // io.to(pass).emit('get-changeScore', data);
    socket.to(pass).emit('get-changeScore', data);
  });
});

httpServer.listen(PORT);
