'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Like,{
        foreignKey: "postId", 
        sourceKey: "postId"
      })
      // define association here
    }
  }
  Post.init({
    postId:{
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    nickname: DataTypes.STRING,
    content: DataTypes.STRING,
    url: DataTypes.STRING,
    like:  {
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};