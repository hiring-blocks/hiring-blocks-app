const { bookmark, posted_jobs, sequelize } = require("../../../models");

exports.getAllBookmarks = async (req, res) => {
  try {
    const { User } = req;
    if (!(User.user_type === "user" || User.user_type === null))
      throw new Error("You must be user");

    const query = `SELECT json_agg(json_build_object('job_id' ,job.job_id,'company_id',company.company_id
								 ,'job_title',job.job_title,'job_description',job.job_description,'job_status',job.job_status,'job_type',job.job_type,
                 'workplace',job.workplace,
                 'responsibilities',job.responsibilities,'no_of_opening',job.no_of_opening,
								 'job_type',job.job_type,job_location,'job.job_location','job_createdTime',job.created_at,'company_name',company.company_name,
								 'company_description',company.company_description,'company_size',company.company_size,'established_year',company.established_year,
								 'company_logo',company.company_logo,'company_address1',company.address1,'company_address2',company.address2,'bookmark_id',bkm.bookmark_id)) 
                  AS job_details FROM bookmarks bkm           
                  INNER JOIN                                                                        
                  posted_jobs job ON job.job_id=bkm.job_id
                  INNER JOIN 
                  companies company ON company.company_id=job.company_id
                  WHERE bkm.user_id='${User.user_id}';
                  `;
    let [getBookmark] = await sequelize.query(query);
    getBookmark = getBookmark[0].job_details;
    const qry2 = `SELECT job_id from applied_jobs where user_id='${User.user_id}';
    `;
    const [getApplied] = await sequelize.query(qry2);
    if (getBookmark.length) {
      for (let j = 0; j < getBookmark.length; j++) {
        getBookmark[j].isApplied = false;
      }
    }
    if (getApplied.length) {
      for (let i = 0; i < getApplied.length; i++) {
        for (let j = 0; j < getBookmark.length; j++) {
          if (getApplied[i].job_id === getBookmark[j].job_id) {
            getBookmark[j].isApplied = true;
          }
        }
      }
    }
    res.json({ success: true, getBookmark });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
