const { sequelize, company } = require("../../../models");
exports.updateCompany = async (req, res) => {
  try {
    const { User } = req;
    if (User.user_type === "user") throw new Error("Not found");
    const { company_id } = req.body;

    if (!company_id) throw new Error("Please Provide a company id");
    const set_case = [];

    if (req.body.company_name)
      set_case.push(`company_name = '${req.body.company_name}'`);

    if (req.body.company_description)
      set_case.push(`company_description = '${req.body.company_description}'`);

    if (req.body.company_size)
      set_case.push(`company_size = '${req.body.company_size}'`);

    if (req.body.country_code)
      set_case.push(`country_code = ${req.body.country_code}`);

    if (req.body.phone) set_case.push(`phone = ${req.body.phone}`);

    if (req.body.address1) set_case.push(`address1 = '${req.body.address1}'`);

    if (req.body.address2) set_case.push(`address2 = '${req.body.address2}'`);

    if (req.body.established_year)
      set_case.push(`established_year = ${req.body.established_year}`);

    if (req.body.company_proof_type)
      set_case.push(`company_proof_type = '${req.body.company_proof_type}'`);
    if (req.body.company_links) {
      let jsonEdu = JSON.stringify(req.body.company_links);
      set_case.push(`company_links = '${jsonEdu}'`);
    }

    const query = `
            UPDATE companies 
            SET  ${set_case.length ? set_case.join(",") : ""}
            WHERE company_id = '${req.body.company_id}'
            RETURNING *;
            `;
    const [updateCompanyData] = await sequelize.query(query);

    if (!updateCompanyData.length) throw new Error("Data not updated");
    else res.json({ success: true, message: "Data updated successfully" });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
