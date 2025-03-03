const getOnlineUsers = require('../util/onlineUsers');
const socketMiddleware = require('./socketIo');

function onlineUsers(req, res, next) {
  const onlineUsers = getOnlineUsers(req.user.id, true);

  // Emit the updated online users list immediately
  const io = socketMiddleware.getIO();
  io.emit('online-users', { data: onlineUsers, message: 'online-users' });

  next();
}

module.exports = onlineUsers;
