const router = require("express").Router();
const { Auth } = require("../middleware/authentication");
const path = require("path");
const {
  createCompany,
  getCompany,
  getAllCompanies,
  getSpecificCompanies,
  deleteCompany,
  updateCompany,
  applyJob,
  filterJob,
  getHistory,
  uploadResume,
  getJobs,
  getAppliedJobsById,
  getUsers,
  getCompanies,
  getFilledJobs,
  recentApplicantsCompanies,
  getCompanyHistory,
  getPostedJobsByUser,
  getPostedJobAuth,
  removeJob,
  updateJob,
  searchJobs,
  searchCompany,
  getCompanyStats,
  filterSearch,
  getMessages,
  addMessage,
  getRecentJobsForCandidates,
  updateLogo,
  verifyCompany,
  getAppliedCandidates,
  updateJobStatus,
  getJobsOnStatus,
  getRecentJobs,
  getRecommendedJobs,
  getPostedJobs,
  createBookmark,
  deleteBookmarks,
  getAllBookmarks,
  getTotalJobs,
  getAppliedJobs,
  getJobsAppliedCount,
  getSpecificJob,
  getJobsOrInternship,
  companyVerification,
  downloadFile,
  getUserJobStats,
  postJob,
} = require("../controllers/jobPortal.controllers");

// contact controller

const {
  createContactInDB,
  getContactFromDb,
  deleteContactFromDb,
} = require("../controllers/contact");

// subscriber controller

const { Subscriber, getSubscriberFromDb } = require("../controllers/subscribe");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 17 * 1024 * 1024 },
// });
// bookmarks routes
router.get("/bookmark", Auth, getAllBookmarks);
router.delete("/bookmark", Auth, deleteBookmarks);
router.post("/bookmark", Auth, createBookmark);

// company routes

router.post("/company", upload.single("logo"), createCompany);
router.get("/company", Auth, getCompany);
router.get("/all-company", getAllCompanies);
router.get("/specificCompany", getSpecificCompanies);
router.delete("/company", Auth, deleteCompany);
router.put("/company", upload.single("logo"), Auth, updateCompany);
router.post("/upload-resume", upload.single("resume"), Auth, uploadResume);
router.put("/verify-company", companyVerification);
router.get("/search-company", searchCompany);
router.put("/updatelogo", upload.single("logo"), updateLogo);

// Jobs routes

router.post("/job", Auth, postJob);
router.get("/job", Auth, getPostedJobs);
router.get("/postedjob", Auth, getPostedJobsByUser);
router.get("/postedJobsAuth", Auth, getPostedJobAuth);
router.delete("/job", Auth, removeJob);
router.put("/job", Auth, updateJob);
router.get("/total_jobs", getTotalJobs);
router.get("/recent_jobs", getRecentJobs);
router.get("/recent_job", Auth, getRecentJobsForCandidates);
router.get("/search-job", searchJobs);
router.get("/userJobStats", Auth, getUserJobStats);
router.get("/getRecommendations", Auth, getRecommendedJobs);
router.get("/filterJobs", filterSearch);
router.get("/getJobsOnStatus", Auth, getJobsOnStatus);
router.get("/getJobsOrInternship", Auth, getJobsOrInternship);
router.get("/getJobAppliedCount", Auth, getJobsAppliedCount);
// Apply jobs route

router.post("/apply-job", Auth, applyJob);
router.get("/apply-job", Auth, getAppliedJobs);
router.get("/applied-job", Auth, getAppliedJobsById);
router.get("/apply-job/filter", Auth, filterJob);
router.get("/apply-job/getSpecificJob", Auth, getSpecificJob);
router.put("/apply-job/updateJobStatus", Auth, updateJobStatus);
router.get("/apply-job/getAppliedCandidates", Auth, getAppliedCandidates);

// message routes

router.post("/message", Auth, getMessages);
router.post("/addMessage", Auth, addMessage);
router.get("/history", Auth, getHistory);
router.get("/user/history", Auth, getCompanyHistory);

// contact routes

router.post("/contact", createContactInDB);
router.get("/contact", getContactFromDb);
router.delete("/contact", deleteContactFromDb);

// subscriber routes

router.post("/subscriber", Subscriber);
router.get("/subscriber", getSubscriberFromDb);

//stats routes

router.get("/totalJobs", getJobs);
router.get("/totalCompanies", getCompanies);
router.get("/totalUsers", getUsers);
router.get("/filledJobs", getFilledJobs);
router.get("/recentApplicant", Auth, recentApplicantsCompanies);
router.get("/company/stats", Auth, getCompanyStats);
// download resume

router.get("/download-resume", downloadFile);

module.exports = router;
