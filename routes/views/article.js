/**
 * Created by elnel_000 on 4/14/2014.
 */
var keystone = require('keystone'),
    _ = require('underscore'),
    helpers = require('helpers');
exports = module.exports = function(req, res) {

    var locals = res.locals,
        view = new keystone.View(req, res);
    locals.filters = {
        article: req.params.article
    };
    locals.data = { };    // Set locals
    locals.section = 'article';
    // Load the current post
    view.on('init', function(next) {

        var q = keystone.list('Article').model.findOne({
            state: 'published',
            slug: locals.filters.article
        }).populate('author');

        q.exec(function(err, result) {
            locals.data.article = result;
            next(err);
        });

    });
    view.on('init', function(next) {
        helpers.getMenu(function(err,result){
            locals.data.menu = result;
            locals.data.breadcrumbs = helpers.getBreadcrumbs(result,req.url.toLowerCase(),locals.filters.article.toLowerCase());
            next(err);
        });
    });
//    // On POST requests, add the Enquiry item to the database
//    view.on('post', { action: 'article' }, function(next) {
//
//        var application = new Enquiry.model();
//        application.name = req.body.name;
//        application.email = req.body.email;
//        appplication.message = req.body.message;
//        application.save();
//        next();
////            updater = application.getUpdateHandler(req);
////
////        updater.process(req.body, {
////            flashErrors: true,
////            fields: 'name, email, phone, enquiryType, message',
////            errorMessage: 'There was a problem submitting your enquiry:'
////        }, function(err) {
////            if (err) {
////                locals.validationErrors = err.errors;
////            } else {
////                locals.enquirySubmitted = true;
////            }
////            next();
////        });
//
//    });

    // Render the view
    view.render('article');

}
