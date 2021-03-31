const getPostLastDate = require('../utils/getPostLastDate');
const disablePost = require('./disablePost');
const Post = require('../models/Post');

module.exports = async () => {
    const posts = await Post.findAll();
    
    posts.forEach(async post => {
        if (post.is_active) {
            await disablePost(post, 'backup')
        }
    });
};