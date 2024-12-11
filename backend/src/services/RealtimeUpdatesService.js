let io = null;

class RealtimeUpdatesService {
  static init(server) {
    const { Server } = require('socket.io');
    io = new Server(server, {
      cors: { origin: "*" }
    });
  }

  static expenseAdded(groupId, expense) {
    if (io) {
      io.to(`group_${groupId}`).emit('expense:added', expense);
    }
  }

  static joinGroupRoom(socket, groupId) {
    socket.join(`group_${groupId}`);
  }
}

module.exports = RealtimeUpdatesService;