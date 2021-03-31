const ChatLine = require('../models/ChatLine');

module.exports = async io => {
    //http://localhost:3000/chat.html?user=2&room=0
    io.on('connection', socket => {
        const room = socket.handshake.query.chatId;
        const user = socket.handshake.query.userId;
        
        socket.join(room);//ver se funciona
        io.to(room).emit('userJoined', user);//frontend, meter user novo online
        
        console.log(`[chat] User [${user}] joined chat [${room}]`);
    
        socket.on('message', message => {
            console.log(`[chat] Message: ${message}`);
            ChatLine.create({
                chat_id: room,
                account_id: user,
                message,
                creation_date: Date.now()
            });
            
            const data = {};
            data.text = message;
            data.user = user;
            data.time = Date.now();
            io.to(room).emit('message', data);
        });
    
        socket.on('disconnect', async () => {
            io.to(room).emit('userLeft', user);
    
            console.log(`[chat] User [${user}] joined chat [${room}]`);
        });
    });
};