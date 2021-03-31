const PaymentMethod = require('../../models/PaymentMethod');

module.exports = {
    index: async (req, res) => {
        const paymentMethods = await PaymentMethod.findAll();

        return res.json(paymentMethods);
    },
    
    create: async (req, res) => { 
        const { name } = req.body;

        if (!name) {
            return res.status(404).send({ error: "Name not found" });
        }
        
        await PaymentMethod.findOrCreate({
            where: {name}
        }).then(paymentMethod => {
            return res.json(paymentMethod);
        });
    },
    
    update: async (req, res) => {
        const { name } = req.body;

        if (!name) {
            return res.status(404).send({ error: "Name not found" });
        }
        
        const paymentMethod = await PaymentMethod.findByPk(req.params.id);

        paymentMethod.update({ name }).then(paymentMethod => {
            return res.json(paymentMethod);
        }); 
    },

    destroy: async (req, res) => {
        const paymentMethod = await PaymentMethod.findByPk(req.params.id);

        if (!paymentMethod) {
            return res.status(404).send({ error: "Payment method not found" });
        }
        paymentMethod.destroy();

        return res.json(paymentMethod);
    }
}