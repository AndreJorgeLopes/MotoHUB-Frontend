const { Model } = require('sequelize');

class Favourite extends Model {
    static init(sequelize) {
        super.init({}, { 
            sequelize,
            timestamps: false,
            tableName: 'favourite'
         });
    };

    static associate(models){
        this.belongsTo(models.Account, { foreignKey: 'account_id' , as: 'user' });
        this.belongsTo(models.Post, { foreignKey: 'post_id' , as: 'post' });
    }
};

module.exports = Favourite;