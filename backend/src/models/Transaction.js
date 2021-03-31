const { Model, DataTypes } = require('sequelize');

class Transaction extends Model {
    static init(sequelize) {
        super.init({
            status: DataTypes.STRING(255),
            price: DataTypes.REAL,
            creation_date: DataTypes.DATE
        }, { 
            sequelize,
            timestamps: false,
            tableName: 'transaction'
         });
    };

    static associate(models){
        this.belongsTo(models.Account, { foreignKey: 'account_id' , as: 'user' });
        this.belongsTo(models.PaymentMethod, { foreignKey: 'payment_method_id' , as: 'paymentMethod' });
        this.belongsTo(models.Coupon, { foreignKey: 'coupon_id' , as: 'coupon' });
    }
};

module.exports = Transaction;