const ChatLine = require('../../models/ChatLine');
const Account = require('../../models/Account');
const Chat = require('../../models/Chat');

module.exports = {
    index: async (req, res) => {
        const account = await Account.findByPk(req.params.id);
        if (!account) return res.status(404).send({ error: "Account not found" });

        const chats = await account.getChats({
            include: ['users']
        });

        return res.json(chats);
    },

    show: async (req, res) => {
        const chat = await Chat.findOne({ 
            where: { id: req.params.id },
            include: ['users', 'chatLines']
        });
        if(chat) return res.json(chat);
        else return res.status(404).send({ error: "Chat not found" });
    },
    
    create: async (req, res) => { 
        const { accounts } = req.body;
        let users = [];
            
        if (!accounts) return res.status(404).send({ error: "Accounts not found" });
        
        accounts.forEach(userId => {
            Account.findByPk(userId).then(user => {
                if (!user) return res.status(404).send({ error: `Account [${userId}] not found` });
                else users.push(user);
            });
        });
 
        Chat.create().then(chat => {
            users.forEach(async user => {
                await chat.addUser(user);
            });
   
            return res.json(chat);
        });
    },

    destroy: async (req, res) => {
        const chat = await Chat.findByPk(req.params.id);

        if (!chat) return res.status(404).send({ error: "Chat not found" });
        
        ChatLine.findAll({where: {chat_id: chat.id}}).then(async chatLines => {
            chatLines.forEach(chatLine => {
                chatLine.destroy();
            });
        });

        chat.getUsers().then(async users => {
            users.forEach(async user => {
                await user.removeChat(chat);
            });

            await chat.destroy();
        });

        return res.json(chat);
    }
}