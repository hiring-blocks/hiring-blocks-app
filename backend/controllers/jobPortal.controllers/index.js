const { getAllBookmarks } = require("./bookmark.controllers/getBookmark");
const { createBookmark } = require("./bookmark.controllers/createBookmark");
const { deleteBookmarks } = require("./bookmark.controllers/deleteBookmark");

// company controller
const { createCompany } = require("./company.controllers/createCompany");
const { getCompany } = require("./company.controllers/getCompany");
const { deleteCompany } = require("./company.controllers/deleteCompany");
const { updateCompany } = require("./company.controllers/updateCompany");
const { verifyCompany } = require("./company.controllers/verifyCompany");
const {
  companyVerification,
} = require("./company.controllers/updateCompanyVerification");
const { getAllCompanies } = require("./company.controllers/getAllCompany");
const {
  getSpecificCompanies,
} = require("./company.controllers/getSpecificCompany");
const { updateLogo } = require("./company.controllers/changecompanylogo");
// Posted Jobs controller

const { postJob } = require("./posted_jobs.controllers/postJob");
const {
  getPostedJobs,
  getTotalJobs,
  getRecentJobs,
  getRecentJobsForCandidates,
} = require("./posted_jobs.controllers/getPostedJobs");
const {
  getPostedJobAuth,
} = require("./posted_jobs.controllers/getPostedJobsAuth");
const {
  getPostedJobsByUser,
} = require("./posted_jobs.controllers/jobPostedByUser");
const { removeJob } = require("./posted_jobs.controllers/deleteJob");
const { updateJob } = require("./posted_jobs.controllers/updateJob");
const {
  searchJobs,
  searchCompany,
} = require("./posted_jobs.controllers/searchJob");

const {
  getJobs,
  getUsers,
  getCompanies,
  getFilledJobs,
  recentApplicantsCompanies,
} = require("./posted_jobs.controllers/getStats");

const { getUserJobStats } = require("./posted_jobs.controllers/userStats");

const {
  getRecommendedJobs,
} = require("./posted_jobs.controllers/jobRecommendation");

const { filterSearch } = require("./posted_jobs.controllers/searchFilter");

const { getCompanyStats } = require("./company.controllers/company_stats");

// Apply job

const { applyJob } = require("./applied_jobs.controllers/applyJob");
const {
  getAppliedJobs,
  getAppliedJobsById,
} = require("./applied_jobs.controllers/getAppliedJob");
const {
  filterJob,
  getSpecificJob,
} = require("./applied_jobs.controllers/getJob.js");
const { uploadResume } = require("./applied_jobs.controllers/uploadResume.js");
const {
  getAppliedCandidates,
  updateJobStatus,
  getJobsOrInternship,
  getJobsAppliedCount,
  getJobsOnStatus,
} = require("./applied_jobs.controllers/updateStatus");

// message handlers
const { getMessages } = require("./message.controller.js/getMessage");
const { addMessage } = require("./message.controller.js/setMessage");
const { getHistory } = require("./message.controller.js/getHistory");
const {
  getCompanyHistory,
} = require("./message.controller.js/getMessageCompany");

// download resume
const { downloadFile } = require("./download_resume/download_resume");

module.exports = {
  getAllBookmarks,
  getMessages,
  addMessage,
  getSpecificJob,
  getJobs,
  getUsers,
  getCompanies,
  getFilledJobs,
  downloadFile,
  filterJob,
  getAppliedCandidates,
  getCompanyHistory,
  getJobsAppliedCount,
  updateLogo,
  updateJobStatus,
  createBookmark,
  getJobsOnStatus,
  createCompany,
  updateCompany,
  uploadResume,
  getAllCompanies,
  getPostedJobAuth,
  getSpecificCompanies,
  deleteBookmarks,
  searchJobs,
  filterSearch,
  getRecentJobsForCandidates,
  getRecommendedJobs,
  getJobsOrInternship,
  searchCompany,
  getCompanyStats,
  getHistory,
  deleteCompany,
  getAppliedJobs,
  getRecentJobs,
  getAppliedJobsById,
  getTotalJobs,
  getPostedJobs,
  getUserJobStats,
  recentApplicantsCompanies,
  applyJob,
  companyVerification,
  verifyCompany,
  getCompany,
  getPostedJobsByUser,
  postJob,
  updateJob,
  removeJob,
};
