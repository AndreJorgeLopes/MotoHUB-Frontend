const { Model, DataTypes } = require('sequelize');

class Post extends Model {
    static init(sequelize) {
        super.init({
            odometer: DataTypes.INTEGER,
            price: DataTypes.REAL,
            registration_date: DataTypes.DATE,
            creation_date: DataTypes.DATE,
            last_renewed_on: DataTypes.DATE,
            description: DataTypes.STRING(900),
            is_active: DataTypes.BOOLEAN,
            is_featured: DataTypes.BOOLEAN,
            is_price_negotiable: DataTypes.BOOLEAN
        }, { 
            sequelize,
            timestamps: false,
            tableName: 'post'
         });
    };

    static associate(models){
        this.belongsTo(models.Account, { foreignKey: 'account_id' , as: 'user' });
        this.belongsTo(models.Model, { foreignKey: 'model_id' , as: 'model' });
        this.hasMany(models.Favourite, { foreignKey: 'post_id' , as: 'favourites' });
        this.hasMany(models.PostImage, { foreignKey: 'post_id' , as: 'postImages' });
    }
};

module.exports = Post;