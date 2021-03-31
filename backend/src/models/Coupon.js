const { Model, DataTypes } = require('sequelize');

class Coupon extends Model {
    static init(sequelize) {
        super.init({
            code: DataTypes.STRING(255),
            discount: DataTypes.REAL,
            remaining_uses: DataTypes.INTEGER,
            expires_at: DataTypes.DATE
        }, { 
            sequelize,
            timestamps: false,
            tableName: 'coupon'
         });
    };

    static associate(models){
        this.hasMany(models.Transaction, { foreignKey: 'coupon_id' , as: 'transactions' });
    }
};

module.exports = Coupon;