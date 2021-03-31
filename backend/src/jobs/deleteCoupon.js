const Coupon = require('../models/Coupon');
const cron = require('node-cron');

module.exports = async (coupon, type) => {
    var date = coupon.expires_at;
    date = date.toJSON();

    const seconds = date.slice(17,19);
    const minutes = date.slice(14,16);
    const hours = date.slice(11,13);
    const day = date.slice(8,10);
    const month = date.slice(5,7);
    
    const job = cron.schedule(`${seconds} ${minutes} ${hours} ${day} ${month} *`, async () => {
        if (await Coupon.findByPk(coupon.id)) {      
            await coupon.destroy();
            console.log(`[task] Deleted coupon with code[${coupon.code}]`);
        };
      
        job.stop();
    });
    console.log(`[${type}] Job created to delete coupon with code[${coupon.code}]`);
};