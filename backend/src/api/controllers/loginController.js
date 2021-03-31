const Account = require('../../models/Account');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    check: async (req, res) => {
        const { email, password } = req.body;

        if ([email, password].includes(undefined)) return res.status(404).send({ error: "Account not found" });
        
        Account.findOne({ where: { email }}).then(user => {
            if (user) {
                bcrypt.compare(password, user.password, function(err, result) {
                    if (result) {
                        const token = jwt.sign({ id: this.id }, "@Portaventura12");

                        return res.json({ user, token });
                    }
                    else return res.status(404).send({ error: "Account not found" });
                });
            }
            else return res.status(404).send({ error: "Account not found" });
        });
    }
}