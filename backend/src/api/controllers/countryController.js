const Country = require('../../models/Country');

module.exports = {
    index: async (req, res) => {
        const countries = await Country.findAll();

        return res.json(countries);
    },
    
    create: async (req, res) => { 
        const { name } = req.body;

        if (!name) return res.status(404).send({ error: "Name not found" });
        
        await Country.findOrCreate({
            where: {name}
        }).then(country => {
            return res.json(country);
        });
    },
    
    update: async (req, res) => {
        const { name } = req.body;

        if (!name) return res.status(404).send({ error: "Name not found" });
        
        const country = await Country.findByPk(req.params.id);

        country.update({ name }).then(country => {
            return res.json(country);
        }); 
    },

    destroy: async (req, res) => {
        const country = await Country.findByPk(req.params.id);

        if (!country) return res.status(404).send({ error: "Country not found" });
        
        country.destroy();

        return res.json(country);
    }
}