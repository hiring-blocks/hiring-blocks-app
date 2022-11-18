'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class discount_coupon_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  discount_coupon_history.init({
    discount_coupon_history_id: {
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
    tableName: "discount_coupon_history",
    modelName: 'discount_coupon_history',
  });
  return discount_coupon_history;
};