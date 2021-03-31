const Region = require('../../models/Region');
const City = require('../../models/City');

module.exports = {
    index: async (req, res) => {
        const cities = await City.findAll({ include:['region'] });

        return res.json(cities);
    },
    
    create: async (req, res) => { 
        const { region, name } = req.body;

        if (!name) return res.status(404).send({ error: "Name not found" });

        Region.findOne({where: { name: region }}).then(async region => {
            if (region === null) return res.status(404).send({ error: "Region not found" });
            else {
                await City.findOrCreate({
                    where: {name},
                    defaults: {
                        region_id: region.id,
                        name
                    }
                }).then(city => {
                    return res.json(city);
                });
            }
        });
    },
    
    update: async (req, res) => {
        const { region } = req.body;

        const city = await City.findByPk(req.params.id);

        if (!city) return res.status(404).send({ error: "City not found" });

        if (region) {
            await Region.findOne({where: { name: region }}).then(async region => {
                if (region === null) return res.status(404).send({ error: "Region not found" });
                else req.body.region_id = region.id;
            });
        }
        else{
            city.update(req.body).then(city => {
                return res.json(city);
            }); 
        }  
    },

    destroy: async (req, res) => {
        const city = await City.findByPk(req.params.id);

        if (!city) return res.status(404).send({ error: "City not found" });

        city.destroy();

        return res.json(city);
    }
}