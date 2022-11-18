"use strict";
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("companies", {
      company_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
      },
      company_name: {
        type: DataTypes.STRING,
      },
      company_description: {
        type: DataTypes.STRING,
      },
      company_size: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      verify_status: {
        type: DataTypes.STRING,
      },
      country_code: {
        type: DataTypes.INTEGER,
      },
      established_year: {
        type: DataTypes.INTEGER,
      },
      company_logo: {
        type: DataTypes.STRING,
      },
      company_proof: {
        type: DataTypes.STRING,
      },
      company_proof_type: {
        type: DataTypes.STRING,
      },
      address1: {
        type: DataTypes.STRING,
      },
      address2: {
        type: DataTypes.STRING,
      },
      company_links: {
        type: DataTypes.JSONB,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.CURRENT_TIMESTAMP,
      },
      updated_at: {
        allowNull: false,
        defaultValue: DataTypes.CURRENT_TIMESTAMP,
        type: DataTypes.DATE,
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("companies");
  },
};
