const Country = require('../../models/Country');
const Region = require('../../models/Region');

module.exports = {
    index: async (req, res) => {
        const regions = await Region.findAll({ include:['country'] });

        return res.json(regions);
    },
    
    create: async (req, res) => { 
        const { country, name } = req.body;

        if (!name) return res.status(404).send({ error: "Name not found" });

        Country.findOne({where: { name: country }}).then(async country => {
            if (country === null) return res.status(404).send({ error: "Country not found" });
            else {
                await Region.findOrCreate({
                    where: { name },
                    defaults: {
                        country_id: country.id,
                        name
                    }
                }).then(region => {
                    return res.json(region);
                });
            }
        });
    },
    
    update: async (req, res) => {
        const { country } = req.body;

        const region = await Region.findByPk(req.params.id);

        if (!region) return res.status(404).send({ error: "Region not found" });

        if (country) {
            await Country.findOne({where: { name: country }}).then(async country => {
                if (country === null) {
                    return res.status(404).send({ error: "Country not found" });
                }
                else {
                    req.body.country_id = country.id;
                }
            });
        }
        else{
            region.update(req.body).then(region => {
                return res.json(region);
            }); 
        }
       
    },

    destroy: async (req, res) => {
        const region = await Region.findByPk(req.params.id);

        if (!region) return res.status(404).send({ error: "Region not found" });

        region.destroy();

        return res.json(region);
    }
}