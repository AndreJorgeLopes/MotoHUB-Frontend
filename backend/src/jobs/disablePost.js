const getPostLastDate = require('../utils/getPostLastDate');
const Post = require('../models/Post');
const cron = require('node-cron');

module.exports = async (post, type) => {
  let { seconds, minutes, hours, day, month } = getPostLastDate(post);
  month = parseInt(month) + 1;
  
  const job = cron.schedule(`${seconds} ${minutes} ${hours} ${day} ${month} *`, async () => {
    if (await Post.findByPk(post.id)) {      
      await post.update({
        is_active: false,
        is_featured: false
      });

      console.log(`[task] Disabled post with ID[${post.id}]`);
    };
  
    job.stop();
  });
  console.log(`[${type}] Job created to disable post with ID[${post.id}]`);
};