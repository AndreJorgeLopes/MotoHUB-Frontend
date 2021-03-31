const { Model, DataTypes } = require('sequelize');

class PostImage extends Model {
    static init(sequelize) {
        super.init({
            image: DataTypes.STRING()
        }, { 
            sequelize,
            timestamps: false,
            tableName: 'post_image'
         });
    };
    static associate(models){
        this.belongsTo(models.Post, { foreignKey: 'post_id' , as: 'post' });
   }
};

module.exports = PostImage;