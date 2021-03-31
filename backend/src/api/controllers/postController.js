const disablePostJob = require('../../jobs/disablePost');
const Account = require('../../models/Account');
const Brand = require('../../models/Brand');
const Model = require('../../models/Model');
const Post = require('../../models/Post');
const City = require('../../models/City');
const Region = require('../../models/Region');
const { Op } = require("sequelize");

module.exports = {
    index: async (req, res) => {
        const posts = await Post.findAll({ 
            include:[
                {
                    model: Account,
                    as: 'user',
                    include: {
                        model: City,
                        as: 'city',
                        include: {
                            model: Region,
                            as: 'region',
                            include: 'country'
                        }
                    }
                },
                {
                    model: Model,
                    as: 'model',
                    include: 'brand'
                },
                'postImages'
            ] 
        });

        return res.json(posts);
    },

    show: async (req, res) => {
        const post = await Post.findByPk(req.params.id, { 
            include:[
                {
                    model: Account,
                    as: 'user',
                    include: {
                        model: City,
                        as: 'city',
                        include: {
                            model: Region,
                            as: 'region',
                            include: 'country'
                        }
                    }
                },
                {
                    model: Model,
                    as: 'model',
                    include: 'brand'
                },
                'postImages'
            ]
        });
        if (!post) return res.status(404).send({ error: "Post not found" });
        
        return res.json(post);
    },
    
    create: async (req, res) => { 
        const { brand, model, engine_size, odometer, price, registration_date,
            description, is_featured, is_price_negotiable } = req.body;
            
        if ([brand, model, engine_size, odometer, price, registration_date, description, is_featured, is_price_negotiable].includes(undefined)) {
            return res.status(404).send({ error: "Error processing your request" });
        }
        
        const {id: brand_id} = await Brand.findOne({where: {name: brand}});
        const modelInstance = await Model.findOne({where: {[Op.and]: [{brand_id}, { name: model }, { engine_size }]}});

        if (!modelInstance) return res.status(404).send({ error: "Model not found" });
        const model_id = modelInstance.id;
        
        Post.create({
            account_id: req.params.id,
            model_id,
            odometer,
            price,
            registration_date,
            creation_date: Date.now(),
            last_renewed_on: null,
            description, 
            is_active: true,
            is_featured,
            is_price_negotiable
        }).then(post => {
            disablePostJob(post, 'task');
   
            return res.json(post);
        });
    },
    
    update: async (req, res) => {
        const { description, price, is_active, is_featured, is_price_negotiable } = req.body;
        var last_renewed_on = null;
        
        const post = await Post.findByPk(req.params.id);
        if (!post.is_active && is_active) last_renewed_on = Date.now();
        else last_renewed_on = post.last_renewed_on;

        post.update({
            last_renewed_on,
            description, 
            price,
            is_active,
            is_featured,
            is_price_negotiable
        }).then(post => {
            if (post.last_renewed_on != last_renewed_on) {
                disablePostJob(post, 'task');
            }
   
            return res.json(post);
        }); 
    },

    destroy: async (req, res) => {
        const post = await Post.findByPk(req.params.id);

        if (!post) return res.status(404).send({ error: "Post not found" });
        
        post.destroy();

        return res.json(post);
    }
}