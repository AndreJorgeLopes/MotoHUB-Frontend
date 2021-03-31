const { Model: model, DataTypes } = require('sequelize');

class Model extends model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING(50),
            engine_size: DataTypes.INTEGER,
            kilowhatts: DataTypes.INTEGER
        }, { 
            sequelize,
            timestamps: false,
            tableName: 'model'
         });
    };

    static associate(models){
        this.belongsTo(models.Brand, { foreignKey: 'brand_id' , as: 'brand' });
        this.hasMany(models.FavouriteSearch, { foreignKey: 'model_id' , as: 'favouriteSearches' });
        this.hasMany(models.Post, { foreignKey: 'account_id' , as: 'posts' });
    }
};

module.exports = Model;