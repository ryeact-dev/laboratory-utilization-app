let io;

const socketIo = {
  init: (socketIo) => {
    io = socketIo;

    io.on('connection', (socket) => {
      socket.on('disconnect', () => {
        // console.log('user disconnected');
      });
    });
  },

  // Get io instance to use anywhere
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized');
    }
    return io;
  },
};

module.exports = socketIo;
