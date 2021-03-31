const { Model, DataTypes } = require('sequelize');

class Account extends Model {
    static init(sequelize) {
        super.init({
            permission_level: DataTypes.INTEGER,
            email: DataTypes.STRING(255),
            password: DataTypes.STRING(72),
            first_name: DataTypes.STRING(50),
            last_name: DataTypes.STRING(50),
            phone_number: DataTypes.STRING(50),
            avatar: DataTypes.STRING(),
            banned: DataTypes.BOOLEAN
        }, { 
            sequelize,
            timestamps: false,
            tableName: 'account'
         });
    };

    static associate(models){
        this.belongsTo(models.City, { foreignKey: 'city_id' , as: 'city'});
        this.belongsToMany(models.Chat, { foreignKey: 'account_id' , through: 'chat_user', as: 'chats', timestamps: false });
        this.hasMany(models.Transaction, { foreignKey: 'account_id' , as: 'transactions' });
        this.hasMany(models.FavouriteSearch, { foreignKey: 'account_id' , as: 'favouriteSearches' });
        this.hasMany(models.Favourite, { foreignKey: 'account_id' , as: 'favourites' });
        this.hasMany(models.Post, { foreignKey: 'account_id' , as: 'posts' });
    }
};

module.exports = Account;