const { Model } = require('sequelize');

class Chat extends Model {
    static init(sequelize) {
        super.init({}, { 
            sequelize,
            timestamps: false,
            tableName: 'chat'
         });
    };

    static associate(models){
        this.belongsToMany(models.Account, { foreignKey: 'chat_id' , through: 'chat_user', as: 'users', timestamps: false });
        this.hasMany(models.ChatLine, { foreignKey: 'chat_id' , as: 'chatLines' });
    }
};

module.exports = Chat;