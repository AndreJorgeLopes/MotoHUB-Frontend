const sendSignupPromotions = require('../../jobs/sendSignupPromotions');
const Account = require('../../models/Account');
const Post = require('../../models/Post');
const City = require('../../models/City');
const mail = require('../../emails');
const bcrypt = require('bcrypt');

const multerConfig = require("../../../config/multer");
const multer  = require('multer');

const fs = require('fs');
const upload = multer(multerConfig).single('image');

module.exports = {
    index: async (req, res) => {
        const accounts = await Account.findAll({ include:['city'] });

        return res.json(accounts);
    },

    show: async (req, res) => {
        const account = await Account.findByPk(req.params.id, { include:['city'] });
        if (!account) return res.status(404).send({ error: "Account not found" });

        else return res.json(account);
    },

    create: async (req, res) => {
        const { city, permission_level, email, password, phone_number } = req.body;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        
        if ([permission_level, email, password, first_name, last_name].includes(undefined)) {
            return res.status(404).send({ error: "Error processing your request" });
        }
        
        else if (city) var { id: city_id }  = await City.findOne({where: { name: city }});

        await bcrypt.hash(password, 10, function(err, hash) {
            if (err) {
                return res.status(424).send({ error: "Error creating password" });
            }
            
            first_name = first_name.charAt(0).toUpperCase() + first_name.slice(1);
            last_name = last_name.charAt(0).toUpperCase() + last_name.slice(1);
            
            Account.findOrCreate({ where: { email }, defaults: {
                city_id,
                permission_level: 1,
                email,
                password: hash,
                first_name,
                last_name,
                phone_number,
                avatar: null,
                banned: false
            }}).then(user => {
                if (user[1]) {
                    sendSignupPromotions(user[0]);
                    mail(
                        email,
                        first_name,
                        'Welcome to MotoHUB',
                        'Thank you for signing up!',
                        'Welcome to <b>MotoHUB</b> society. My name is André and I’m emailing you to let you know that we appreciate your choice.'
                    );
                    return res.json(user);
                } else res.status(404).send({ error: "Account already exists" });
            });
        });
    },

    update: async (req, res) => {
        const { city, password, banned } = req.body;

        const account = await Account.findByPk(req.params.id);

        if (!account) return res.status(404).send({ error: "Account not found" });

        else if (city) {
            const { id }  = await City.findOne({where: { name: city }});

            req.body.city_id = id;

            if (id === null) return res.status(404).send({ error: "City not found" });
       }
       
       if (banned && !account.banned) {
           const posts = await Post.findAll({ where: { account_id: account.id } });
           posts.forEach(async post => {
               await post.update({
                   is_active: false,
                   is_featured: false
               });
            });
            mail(
                account.email,
                account.first_name,
                'Banned from MotoHUB',
                'Your account has been banned!',
                'Your account has been banned for <b>violating our terms</b>. If you think that this is a mistake, please contact us at our social media down below.'
            );
        }
        if (password) {     
            bcrypt.hash(password, 10, function(err, hash) {
                if (err) return res.status(424).send({ error: "Error updating password" });

                req.body.password = hash;
                account.update(req.body).then(user => { return res.json(user) });
            });
        }
        else{
            account.update(req.body).then(user => { return res.json(user) });
        }
    },

    destroy: async (req, res) => {
        const account = await Account.findByPk(req.params.id);

        if (!account) return res.status(404).send({ error: "Account not found" });
        account.destroy();

        if(account.avatar){
            fs.unlink(`./public/uploads/${account.avatar}`,(err) => {
                if(err) return console.log(err);
            }); 
        } 
        return res.json(account);
    },

    createAvatar: async (req, res) => {
        var avatar = null;
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).send({ error: err.message });
            };
            
            const account = await Account.findByPk(req.params.id);

            if (!account) {
                return res.status(404).send({ error: "Account not found" });
            }
            
            const oldAvatar = account.avatar;
            if (req.file) {
                avatar = req.file.filename;
                account.update({ avatar }).then(account => {
                    if (oldAvatar != null) {
                        fs.unlink(`./public/uploads/${oldAvatar}`,(err) => {
                            if(err) return console.log(err);
                        }); 
                    }
                    return res.json(account);
                });
            } else {
                return res.status(404).send({ error: "Error uploading image" });
            }

        });
    }}