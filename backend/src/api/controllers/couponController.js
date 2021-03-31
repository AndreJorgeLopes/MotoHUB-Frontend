const Coupon = require('../../models/Coupon');

module.exports = {
    index: async (req, res) => {
        const coupons = await Coupon.findAll();

        return res.json(coupons);
    },

    show: async (req, res) => {
        const coupon = await Coupon.findOne({where: { code: req.params.code }});

        return res.json(coupon);
    },
    
    create: async (req, res) => { 
        const { discount, remaining_uses, expires_at } = req.body;
        const code = req.params.code;
            
        if ([code, discount, remaining_uses, expires_at].includes(undefined)) {
            return res.status(404).send({ error: "Error processing your request" });
        }
        
        await Coupon.findOrCreate({ where: { code }, defaults: {
            code,
            discount,
            remaining_uses,
            expires_at: Date.parse(expires_at)
        }}).then(coupon => {
            return res.json(coupon);
        });
    },
    
    update: async (req, res) => {
        const { expires_at } = req.body;

        if (expires_at) req.body.expires_at = Date.parse(expires_at);
        
        const coupon = await Coupon.findOne({where: { code: req.params.code }});

        coupon.update(req.body).then(coupon => {
            return res.json(coupon);
        }); 
    },

    destroy: async (req, res) => {
        const coupon = await Coupon.findOne({where: { code: req.params.code }});

        if (!coupon) return res.status(404).send({ error: "Coupon not found" });

        coupon.destroy();

        return res.json(coupon);
    }
}