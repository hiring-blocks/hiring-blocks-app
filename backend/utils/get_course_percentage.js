const { user_course_percentage } = require("../models");

exports.get_course_percentage = async (courseData, watchtimeData, user_id) => {
  // console.log(user_id)
  // console.log(watchtimeData)
  courseData.percentage_watched = 0;
  courseData.topics.forEach((single_topic) => {
    single_topic.percentage_watched = 0;
    single_topic.sub_topics.forEach((single_sub_topic) => {
      single_sub_topic.percentage_watched = 0;
      single_sub_topic.chapters.forEach((chapter_details) => {
       
        for (i in watchtimeData) {
          // console.log(watchtimeData[i].chapter_id)
          // console.log(chapter_details.chapter_id)
          if (watchtimeData[i].chapter_id === chapter_details.chapter_id) {
            chapter_details.percentage_watched =
              watchtimeData[i].percentage_watched;
              // console.log(watchtimeData[i])
              // console.log("dxv")
              // console.log(chapter_details.percentage_watched);
          }
          
        }
        if (chapter_details.percentage_watched === undefined) {
          chapter_details.percentage_watched = 0;
        }
        // console.log(chapter_details.percentage_watched)
        single_sub_topic.percentage_watched += chapter_details.percentage_watched
          ? Number(chapter_details.percentage_watched)
          : 0;
      });
     
      single_sub_topic.percentage_watched /= single_sub_topic.chapters.length;
      single_sub_topic.percentage_watched = single_sub_topic.percentage_watched.toFixed(
        2
      );
      single_topic.percentage_watched += Number(
        single_sub_topic.percentage_watched
      );
    });
    single_topic.percentage_watched /= single_topic.sub_topics.length;
    courseData.percentage_watched += Number(single_topic.percentage_watched);
  });
  courseData.percentage_watched /= courseData.topics.length;
  courseData.percentage_watched = courseData.percentage_watched.toFixed(2);
  const result = await user_course_percentage.findOne({
    where: {
      course_id: courseData.course_id,
      user_id:user_id
    },
  });
  // console.log(result)
  // console.log(courseData.percentage_watched)
  if (result) {
    result.percentage_watched = courseData.percentage_watched;
    result.save();
  } else {
    await user_course_percentage.create({
      course_id: courseData.course_id,
      user_id: user_id,
      percentage_watched: courseData.percentage_watched,
    });
  }
  return courseData;
};
