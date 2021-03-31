const Brand = require('../../models/Brand');
const Model = require('../../models/Model');
const { Op } = require("sequelize");

module.exports = {
    index: async (req, res) => {
        const models = await Model.findAll({ include:['brand'] });

        return res.json(models);
    },
    
    create: async (req, res) => { 
        const { brand, name, engine_size, kilowhatts } = req.body;

        if ([name, engine_size, kilowhatts].includes(undefined)) {
            return res.status(404).send({ error: "Error processing your request" });
        }

        Brand.findOne({where: { name: brand }}).then(async brand => {
            if (brand === null) return res.status(404).send({ error: "Brand not found" });
            else {
                await Model.findOrCreate({
                    where: {[Op.and]: [{ name }, { engine_size }]},
                    defaults: {
                        brand_id: brand.id,
                        name,
                        engine_size,
                        kilowhatts
                    }
                }).then(model => {
                    return res.json(model);
                });
            }
        });
    },
    
    update: async (req, res) => {
        const { brand } = req.body;

        const model = await Model.findByPk(req.params.id);

        if (!model) return res.status(404).send({ error: "Model not found" });

        if (brand) {
            await Brand.findOne({where: { name: brand }}).then(async brand => {
                if (brand === null) {
                    return res.status(404).send({ error: "Brand not found" });
                }
                else {
                    req.body.brand_id = brand.id;
                }
            });
        }
        else {
            model.update(req.body).then(model => {
                return res.json(model);
            }); 
        }
    
    },

    destroy: async (req, res) => {
        const model = await Model.findByPk(req.params.id);

        if (!model) return res.status(404).send({ error: "Model not found" });

        model.destroy();

        return res.json(model);
    }
}