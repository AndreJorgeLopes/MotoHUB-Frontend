const deleteCoupon = require('./deleteCoupon');
const Coupon = require('../models/Coupon');

module.exports = async () => {
    const coupons = await Coupon.findAll();
    
    coupons.forEach(async coupon => {
        await deleteCoupon(coupon, 'backup');
    });
};