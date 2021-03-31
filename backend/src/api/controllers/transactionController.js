const PaymentMethod = require('../../models/PaymentMethod');
const Transaction = require('../../models/Transaction');
const Account = require('../../models/Account');
const Coupon = require('../../models/Coupon');

module.exports = {
    index: async (req, res) => {
        const transactions = await Transaction.findAll({ include:['user', 'model', 'transactionImages'] });

        return res.json(transactions);
    },

    show: async (req, res) => {
        const transaction = await Transaction.findByPk(req.params.id, { include:['user', 'model', 'transactionImages'] });
        if (!transaction) return res.status(404).send({ error: "Transaction not found" });
        
        return res.json(transaction);
    },
    
    create: async (req, res) => { 
        const { payment_method_id, code, status, price } = req.body;
        let coupon_id = null;
            
        if ([payment_method_id, status, price].includes(undefined)) {
            return res.status(404).send({ error: "Error processing your request" });
        }

        const account = await Account.findByPk(req.params.id);

        if (!account) return res.status(404).send({ error: "Account not found" });
 
        if (code) {
            await Coupon.findOne({where: { code }}).then(coupon => {
                if (!coupon) return res.status(404).send({ error: "Coupon not found" });
                else {
                    coupon_id = coupon.id;
                    
                    //deletar o coupon se o coupon.remaining_uses = 0
                    coupon.update({remaining_uses: coupon.remaining_uses - 1});
                    //fazer isto só quando o pagamento estiver concluido
                }
            });
        }

        PaymentMethod.findByPk(payment_method_id).then(paymentMethod => {
            if (!paymentMethod) return res.status(404).send({ error: "Payment Method not found" });
            else {
                //criar pagamento

                Transaction.create({
                    payment_method_id,
                    account_id: req.params.id,
                    coupon_id,
                    status,//ver como usar com o ayden e meter o valor default de processing
                    price,
                    creation_date: Date.now()
                }).then(transaction => { 
                    return res.json(transaction);
                });
            };
        });
        
    },
    
    update: async (req, res) => {
        const { status } = req.body;

        const transaction = await Transaction.findByPk(req.params.id);

        if (!transaction) return res.status(404).send({ error: "Transaction not found" });

        transaction.update({ status }).then(transaction => { return res.json(transaction) });
    },

    destroy: async (req, res) => {
        const transaction = await Transaction.findByPk(req.params.id);

        if (!transaction) return res.status(404).send({ error: "Transaction not found" });
        
        transaction.destroy();

        return res.json(transaction);
    }
}