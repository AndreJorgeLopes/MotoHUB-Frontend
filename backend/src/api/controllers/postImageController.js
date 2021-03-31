const multerConfig = require("../../../config/multer");
const PostImage = require('../../models/PostImage');
const multer  = require('multer');

const fs = require('fs');
const upload = multer(multerConfig).single('image');

module.exports = {
    index: async (req, res) => {
        const postImages = await PostImage.findAll({
            where: {post_id: req.params.id},
            include:['post'] 
        });

        return res.json(postImages);
    },

    create: async (req, res) => { 
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).send({ error: err.message });
            };
            
            PostImage.create({
                post_id: req.params.id,
                image: req.file.filename
            }).then(postImage => {
                return res.json(postImage);
            });
        });
    },

    destroy: async (req, res) => {
        const postImage = await PostImage.findByPk(req.params.id);

        if (!postImage) return res.status(404).send({ error: "Post image not found" });
        postImage.destroy();

        fs.unlink(`./public/uploads/${postImage.image}`,(err) => {
            if(err) return console.log(err);

            return res.json(postImage);
       }); 
    }
}