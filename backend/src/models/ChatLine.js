const { Model, DataTypes } = require('sequelize');

class ChatLine extends Model {
    static init(sequelize) {
        super.init({
            message: DataTypes.STRING(255),
            creation_date: DataTypes.DATE
        }, { 
            sequelize,
            timestamps: false,
            tableName: 'chat_line'
         });
    };

    static associate(models){
        this.belongsTo(models.Chat, { foreignKey: 'chat_id' , as: 'chat' });
        this.belongsTo(models.Account, { foreignKey: 'account_id' , as: 'user' });
    }
};

module.exports = ChatLine;