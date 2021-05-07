const deleteCoupon = require('./deleteCoupon');
const Coupon = require('../models/Coupon');
const cron = require('node-cron');
const mail = require('../emails');

module.exports = async user => {
    let date = new Date;

    const seconds = date.getSeconds();
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const day = date.getDate() + 1;

    const job = cron.schedule(`${seconds} ${minutes} ${hours} ${day} * *`, async () => {
        const createRandomCode = require('../utils/createRandomCode');
        const code = await createRandomCode();

        date = new Date();
        date.setMonth(date.getMonth() + 1);

        Coupon.create({
            code,
            discount: 0.10,
            remaining_uses: 1,
            expires_at: date
        }).then(async coupon => {
            mail(
                user.email,
                user.first_name,
                'Discount at MotoHUB',
                'Show the world your motorcycle!',
                `My name is André, im the CEO of <b>MotoHUB</b> and I’m emailing you to give you a <b>10%</b> discount on your first purchase on the website this month. To use the coupon, at the checkout use the code: <b>${code}</b>`
            );
                
            await deleteCoupon(coupon, 'task');
            console.log(`[task] Sent Signup Promotions to User [${user.email}]`);
            job.stop();
        });
        
    });
    console.log(`[task] Job created to send Signup Promotions to User [${user.email}]`)
};