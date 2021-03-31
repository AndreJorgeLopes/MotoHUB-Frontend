const { Model, DataTypes } = require('sequelize');

class City extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING(50)
        }, { 
            sequelize,
            timestamps: false,
            tableName: 'city'
         });
    };

    static associate(models){
        this.hasMany(models.Account, { foreignKey: 'city_id' , as: 'users' });
        this.belongsTo(models.Region, { foreignKey: 'region_id' , as: 'region' });
   }
};

module.exports = City;