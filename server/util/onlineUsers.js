const onlineUsers = [];

function getOnlineUsers(userId, isLogin) {
  if (!isLogin) {
    const index = onlineUsers.findIndex((user) => user.userId === userId);
    if (index !== -1) {
      onlineUsers.splice(index, 1);
    }
    return [...onlineUsers];
  }

  if (!onlineUsers.some((user) => user.userId === userId) && userId !== null) {
    onlineUsers.push({
      userId,
      lastSeen: Date.now(),
    });
  } else {
    // Update lastSeen for existing user
    const user = onlineUsers.find((u) => u.userId === userId);
    if (user) {
      user.lastSeen = Date.now();
    }
  }

  // Clean up disconnected users after some time
  const cleanupStaleUsers = () => {
    const now = Date.now();
    // const staleThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds
    const staleThreshold = 30 * 60 * 1000; // 30 minutes in milliseconds

    for (let i = onlineUsers.length - 1; i >= 0; i--) {
      if (now - onlineUsers[i].lastSeen > staleThreshold) {
        onlineUsers.splice(i, 1);
      }
    }
  };

  cleanupStaleUsers();
  return [...onlineUsers];
}

module.exports = getOnlineUsers;
