const { order_courses } = require("../models");
exports.checkIfOrderpurchased = async (whereObject) => {
  return order_courses.findOne({
    where: whereObject,
  });
};
