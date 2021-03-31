const { Model, DataTypes } = require('sequelize');

class Brand extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING(50)
        }, { 
            sequelize,
            timestamps: false,
            tableName: 'brand'
         });
    };

    static associate(models){
        this.hasMany(models.Model, { foreignKey: 'brand_id' , as: 'models' });
        this.hasMany(models.FavouriteSearch, { foreignKey: 'brand_id' , as: 'favouriteSearches' });
    }
};

module.exports = Brand;