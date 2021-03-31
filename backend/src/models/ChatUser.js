const { Model, DataTypes } = require('sequelize');

class ChatUser extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
              }
        }, { 
            sequelize,
            tableName: 'chat_user'
         });
    };

    static associate(models){
        this.belongsTo(models.ChatLine, { foreignKey: 'chat_user_id' , as: 'chatLine' });
    }
};

module.exports = ChatUser;