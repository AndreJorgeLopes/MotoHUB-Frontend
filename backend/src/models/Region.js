const { Model, DataTypes } = require('sequelize');

class Region extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING(50)
        }, { 
            sequelize,
            timestamps: false,
            tableName: 'region'
         });
    };

    static associate(models){
        this.belongsTo(models.Country, { foreignKey: 'country_id' , as: 'country' });
        this.hasMany(models.FavouriteSearch, { foreignKey: 'region_id' , as: 'favouriteSearches' });
        this.hasMany(models.City, { foreignKey: 'region_id' , as: 'cities' });
   }
};

module.exports = Region;