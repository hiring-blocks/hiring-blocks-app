"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  company.init(
    {
      company_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      company_name: DataTypes.STRING,
      company_description: DataTypes.STRING,
      company_size: DataTypes.STRING,
      phone: DataTypes.STRING,
      country_code: DataTypes.INTEGER,
      established_year: DataTypes.INTEGER,
      company_logo: DataTypes.STRING,
      company_proof: DataTypes.STRING,
      company_proof_type: DataTypes.STRING,
      verify_status: DataTypes.STRING,
      address1: DataTypes.STRING,
      company_links: {
        type: DataTypes.JSONB,
      },
      address2: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "company",
    }
  );
  return company;
};
