'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class demo_discount_coupon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  demo_discount_coupon.init({
    demo_discount_coupon_id: {
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
    tableName: "demo_discount_coupon",
    modelName: 'demo_discount_coupon',
  });
  return demo_discount_coupon;
};