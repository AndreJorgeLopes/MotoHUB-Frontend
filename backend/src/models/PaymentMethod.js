const { Model, DataTypes } = require('sequelize');

class PaymentMethod extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING(50)
        }, { 
            sequelize,
            timestamps: false,
            tableName: 'payment_method'
         });
    };

    static associate(models){
        this.hasMany(models.Transaction, { foreignKey: 'payment_method_id' , as: 'transactions' });
    }
};

module.exports = PaymentMethod;