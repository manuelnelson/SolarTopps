var keystone = require('keystone'),
    async = require('async'),
    helpers =  require("../../helpers");

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;
    locals.data ={};
    console.log(req.user);
    locals.data.user = req.user;
    // Set locals
    locals.section = 'profile';

    // Render the view
    view.render('profile');

}
