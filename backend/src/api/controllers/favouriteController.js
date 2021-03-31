const Favourite = require('../../models/Favourite');
const { Op } = require("sequelize");

module.exports = {
    index: async (req, res) => {
        const favourites = await Favourite.findAll({ 
            where: { account_id: req.params.id },
            include:['user', 'post'] 
        });

        return res.json(favourites);
    },

    show: async (req, res) => {
        const favourite = await Favourite.findOne({ 
            where: {[Op.and]: [
                { account_id: req.params.accountId },
                { post_id: req.params.postId }
            ]},
            include:['user', 'post'] 
        });

        return res.json(favourite);
    },
    
    create: async (req, res) => {           
        await Favourite.findOrCreate({
            where: {[Op.and]: [
                { account_id: req.params.accountId },
                { post_id: req.params.postId }
            ]},
            defaults: { 
                account_id: req.params.accountId,
                post_id: req.params.postId 
            }
        }).then(favourite => {
            return res.json(favourite);
        });
    },

    destroy: async (req, res) => {
        const favourite = await Favourite.findOne({
            where: {[Op.and]: [
                { account_id: req.params.accountId },
                { post_id: req.params.postId }
            ]
        }});

        if (!favourite) return res.status(404).send({ error: "Favourite not found" });

        favourite.destroy();

        return res.json(favourite);
    }
}