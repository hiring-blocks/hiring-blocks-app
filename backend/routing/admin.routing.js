const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");

// ADMIN routes
router.route("/login").get(adminController.loginAdmin);
router.route("/addadmin").post(adminController.addAdmin);
router.route("/userinfo").get(adminController.userinfo);
router.route("/changepassword").post(adminController.changepassword);
router.route("/allcourses").get(adminController.allcourses);
router.route("/alltopics").get(adminController.alltopics);
router.route("/allsubtopics").get(adminController.allsubtopics);
router.route("/allchapters").get(adminController.allchapters);
router
  .route("/admin_otp_verfication")
  .get(adminController.admin_otp_verfication);
router.route("/all_orders").get(adminController.all_orders);
router.route("/all_users").get(adminController.all_users);
router.route("/single_course").get(adminController.single_course);
router.route("/add_cart_item").post(adminController.add_cart_item);
router.route("/get_cart_item").get(adminController.get_cart_item);
router.route("/del_cart_item").post(adminController.del_cart_item);
router.route("/call_otp").post(adminController.call_otp);
router
  .route("/add_discount_coupon")
  .post(adminController.enter_discount_coupon);
router
  .route("/update_discount_coupon")
  .post(adminController.update_discount_coupon);
router
  .route("/delete_discount_coupon")
  .post(adminController.delete_discount_coupon);
router
  .route("/fetch_discount_coupon")
  .get(adminController.fetch_discount_coupon);
router.route("/add_why_join").post(adminController.add_why_join);
router.route("/get_why_joins").get(adminController.get_why_joins);
router.route("/update_why_join").post(adminController.update_why_join);
router.route("/del_why_join").post(adminController.del_why_join);
router.route("/order_details").get(adminController.order_details);
router.route("/get_faq").get(adminController.getfaq);
router.route("/add_faq").post(adminController.addfaq);
router.route("/update_faq").post(adminController.updateFaq);
router.route("/delete_faq").post(adminController.deletefaq);
router.route("/get_course_sale").get(adminController.getCourseDetail);
router.route("/get_revenue_analytics").get(adminController.revenueAnalytics);
router.route("/add_topic").post(adminController.addtopic);
router.route("/update_topic").post(adminController.updatetopic);
router.route("/add_module").post(adminController.addmodule);
router.route("/update_module").post(adminController.updatemodule);
router.route("/monthly_analytics").get(adminController.monthly_analytics);
router.route("/add_chapter").post(adminController.add_chapter);
// router.route("/update_chapter").post(adminController.update_chapter);
router.route("/add_course").post(adminController.add_course);
router.route("/update_course").post(adminController.update_course);
// router.route("/loginAdminUsers").post(adminController.loginAdminUsers);

router.route("/daily_analytics").get(adminController.daily_analytics);
router.route("/weekly_analytics").get(adminController.weekly_analytics);
router.route("/custom_analytics").post(adminController.custom_analytics);

router.route("/all_admin_users").get(adminController.all_admin_users);
router.route("/update_admin_username").post(adminController.update_admin_username);

router.route("/admin_to_manager").post(adminController.admin_to_employee);
router.route("/manager_to_admin").post(adminController.employee_to_admin);
router.route("/update_admin_user").post(adminController.update_admin_user);
router.route("/delete_admin_user").post(adminController.delete_admin_user);

router.route("/get_carousel").get(adminController.get_carousel);
router.route("/update_carousel").post(adminController.update_carousel);
router.route("/delete_carousel").post(adminController.delete_carousel);

router.route("/all_course_card").get(adminController.all_course_card);


router.route("/get_faq_ques").get(adminController.get_faq_ques);
router.route("/add_faq_ques").post(adminController.add_faq_ques);

router.route("/update_user").post(adminController.update_user);
router.route("/delete_user").post(adminController.delete_user);

router.route("/all_quizes").get(adminController.all_quizes);



module.exports = router;

