let io;

const initNotification = (socketIoInstance) => {
  io = socketIoInstance;
  
  io.on('connection', (socket) => {
    console.log('📱 New Client Connected to Notification Protocol:', socket.id);
    
    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`👤 User ${userId} joined their notification channel.`);
    });
    
    socket.on('disconnect', () => {
      console.log('📱 Client Disconnected from Notification Protocol');
    });
  });
};

const sendNotification = (userId, title, message, type = 'info', data = {}) => {
  if (io) {
    const notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      data,
      created_at: new Date().toISOString()
    };
    
    // Send to specific user room
    io.to(`user_${userId}`).emit('notification', notification);
    console.log(`🔔 Notification sent to user_${userId}: ${title}`);
    
    return true;
  }
  return false;
};

module.exports = { initNotification, sendNotification };
