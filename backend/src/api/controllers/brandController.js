const Brand = require('../../models/Brand');

module.exports = {
    index: async (req, res) => {
        const brands = await Brand.findAll();

        return res.json(brands);
    },
    
    create: async (req, res) => { 
        const { name } = req.body;

        if (!name) return res.status(404).send({ error: "Name not found" });
        
        await Brand.findOrCreate({
            where: {name}
        }).then(brand => {
            return res.json(brand);
        });
    },
    
    update: async (req, res) => {
        const { name } = req.body;

        if (!name) return res.status(404).send({ error: "Name not found" });
        
        const brand = await Brand.findByPk(req.params.id);

        brand.update({ name }).then(brand => {
            return res.json(brand);
        }); 
    },

    destroy: async (req, res) => {
        const brand = await Brand.findByPk(req.params.id);

        if (!brand) return res.status(404).send({ error: "Brand not found" });
        
        brand.destroy();

        return res.json(brand);
    }
}