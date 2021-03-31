const { Model, DataTypes } = require('sequelize');

class Country extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING(50)
        }, { 
            sequelize,
            timestamps: false,
            tableName: 'country'
         });
    };

    static associate(models){
        this.hasMany(models.Region, { foreignKey: 'country_id' , as: 'regions' });
    }
};

module.exports = Country;