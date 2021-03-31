const { Model, DataTypes } = require('sequelize');

class FavouriteSearch extends Model {
    static init(sequelize) {
        super.init({
            odometer: DataTypes.INTEGER,
            price: DataTypes.REAL
        }, { 
            sequelize,
            timestamps: false,
            tableName: 'favourite_search'
         });
    };

    static associate(models){
        this.belongsTo(models.Account, { foreignKey: 'account_id' , as: 'user' });
        this.belongsTo(models.Model, { foreignKey: 'account_id' , as: 'model' });
        this.belongsTo(models.City, { foreignKey: 'city_id' , as: 'city' });
        this.belongsTo(models.Region, { foreignKey: 'region_id' , as: 'region' });
        this.belongsTo(models.Country, { foreignKey: 'country_id' , as: 'country' });
    }
};

module.exports = FavouriteSearch;