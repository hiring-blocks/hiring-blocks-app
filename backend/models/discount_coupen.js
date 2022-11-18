'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class discount_coupen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  discount_coupen.init({
    discount_coupon_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    course_id: {
      type: DataTypes.UUID,
    },
    coupon_name: DataTypes.STRING,
    flat: DataTypes.STRING,
    course_name: DataTypes.STRING,
  }, {
    sequelize,
    tableName: "discount_coupon",
    modelName: 'discount_coupon',
  });
  return discount_coupen;
};