const Coupon = require('../models/Coupon');
const crypto = require("crypto");

module.exports = async () => {
    const existingCoupons = await Coupon.findAll({ attributes: ['code'] });
    var code = crypto.randomBytes(5).toString('hex');
    var verify = existingCoupons.findIndex(coupon => coupon.code == code);

    while (verify != -1){
        code = crypto.randomBytes(5).toString('hex');
        verify = existingCoupons.findIndex(coupon => coupon.code == code);
    }

    return code;
};