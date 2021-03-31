const FavouriteSearch = require('../../models/FavouriteSearch');

module.exports = {
    index: async (req, res) => {
        const favouriteSearches = await FavouriteSearch.findAll({where: {account_id: req.params.id}});

        return res.json(favouriteSearches);
    },
    
    create: async (req, res) => { 
        const { city_id, region_id,  country_id, brand_id, model_id, odometer, price } = req.body;
        const account_id = req.params.id;
            
        if (![city_id, region_id,  country_id, brand_id, model_id, odometer, price].some(item => item != undefined)) {
            return res.status(404).send({ error: "Error processing your request" });
        }
        
        await FavouriteSearch.create({
            account_id,
            city_id,
            region_id,
            country_id,
            model_id,
            brand_id,
            model_id,
            odometer,
            price
        }).then(favouriteSearch => {
            return res.json(favouriteSearch);
        });
    },

    destroy: async (req, res) => {
        const favouriteSearch = await FavouriteSearch.findByPk(req.params.id);

        if (!favouriteSearch) {
            return res.status(404).send({ error: "Favourite search not found" });
        }
        favouriteSearch.destroy();

        return res.json(favouriteSearch);
    }
}