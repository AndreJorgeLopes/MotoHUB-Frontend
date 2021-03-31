const express = require('express');
const consign = require('consign');
const auth = require('../middlewares/auth');

var app = {};

const routes = express.Router();

consign({ verbose: false }).include('src/api/controllers').into(app);
const controllers = app.src.api.controllers;

routes.get('/', (req, res) => {
    return res.json("api is working");
});

routes.route('/accounts')
    .get(auth, controllers.accountController.index)
    .put(controllers.accountController.create);
routes.route('/account/:id')
    .get(controllers.accountController.show)
    .post(auth, controllers.accountController.update)
    .delete(auth, controllers.accountController.destroy)//admin
    .put(controllers.accountController.createAvatar);

routes.route('/posts')
    .get(controllers.postController.index);
routes.route('/account/:id/posts')
    .put(auth, controllers.postController.create);
routes.route('/post/:id')
    .get(controllers.postController.show)
    .post(auth, controllers.postController.update)
    .delete(auth, controllers.postController.destroy);

routes.route('/post/:id/images')
    .get(controllers.postImageController.index)
    .put(auth, controllers.postImageController.create);
routes.route('/image/:id')
    .delete(auth, controllers.postImageController.destroy);

routes.route('/account/:id/favourites')
    .get(controllers.favouriteController.index);
routes.route('/account/:accountId/favourite/:postId')
    .get(controllers.favouriteController.show)
    .put(auth, controllers.favouriteController.create)
    .delete(auth, controllers.favouriteController.destroy);

routes.route('/brands')
    .get(controllers.brandController.index)
    .put(auth, controllers.brandController.create);//admin
routes.route('/brand/:id')
    .post(auth, controllers.brandController.update)//admin
    .delete(auth, controllers.brandController.destroy);//admin

routes.route('/cities')
    .get(controllers.cityController.index)
    .put(auth, controllers.cityController.create);//admin
routes.route('/city/:id')
    .post(auth, controllers.cityController.update)//admin
    .delete(auth, controllers.cityController.destroy);//admin

routes.route('/regions')
    .get(controllers.regionController.index)
    .put(auth, controllers.regionController.create);//admin
routes.route('/region/:id')
    .post(auth, controllers.regionController.update)//admin
    .delete(auth, controllers.regionController.destroy);//admin

routes.route('/models')
    .get(controllers.modelController.index)
    .put(auth, controllers.modelController.create);//admin
routes.route('/model/:id')
    .post(auth, controllers.modelController.update)//admin
    .delete(auth, controllers.modelController.destroy);//admin

routes.route('/countries')
    .get(controllers.countryController.index)
    .put(auth, controllers.countryController.create);//admin
routes.route('/country/:id')
    .post(auth, controllers.countryController.update)//admin
    .delete(auth, controllers.countryController.destroy);//admin

routes.route('/coupons')
    .get(auth, controllers.couponController.index);//admin
routes.route('/coupon/:code')
    .get(auth, controllers.couponController.show)
    .put(auth, controllers.couponController.create)
    .post(auth, controllers.couponController.update)//admin
    .delete(auth, controllers.couponController.destroy);//admin
    
routes.route('/paymentMethods')
    .get(controllers.paymentMethodController.index)
    .put(auth, controllers.paymentMethodController.create);//admin
routes.route('/paymentMethod/:id')
    .post(auth, controllers.paymentMethodController.update)//admin
    .delete(auth, controllers.paymentMethodController.destroy);//admin

routes.route('/account/:id/transactions')
    .get(auth, controllers.transactionController.index)
    .put(auth, controllers.transactionController.create);
routes.route('/transaction/:id')
    .get(auth, controllers.transactionController.show)//admin se não for do user
    .post(auth, controllers.transactionController.update)//admin
    .delete(auth, controllers.transactionController.destroy);//admin

routes.route('/account/:id/chats')
    .get(auth, controllers.chatController.index);
routes.route('/chats')
    .put(auth, controllers.chatController.create);
routes.route('/chat/:id')
    .get(auth, controllers.chatController.show)//admin se não for do user
    .delete(auth, controllers.chatController.destroy);//admin

routes.route('/account/:id/favouriteSearches')
    .get(auth, controllers.favouriteSearchController.index)
    .put(auth, controllers.favouriteSearchController.create);
routes.route('/favouriteSearch/:id')
    .delete(auth, controllers.favouriteSearchController.destroy);

routes.post('/login', controllers.loginController.check);

module.exports = routes;