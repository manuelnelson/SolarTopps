var keystone = require('keystone'),
    _ = require('underscore'),
    helpers =  require("../../helpers");
exports = module.exports = function(req, res) {
    var locals = res.locals,
        view = new keystone.View(req, res);

    locals.data = { };    // Set locals
    locals.section = 'form';
    // Load the current post
//    view.on('init', function(next) {

//        var q = keystone.list('Form').model.findOne({
//            state: 'published',
//            slug: locals.filters.form
//        });
//        q.exec(function(err, result) {
//            locals.data.form = result;
//            if(!result){
//                res.status(404).render('errors/404');
//                return;
//            }
//            locals.data.seo = {
//                description: result.seoDescription,
//                keywords: result.seoKeywords,
//                title: result.title,
//                type: 'form'
//            };
//            next(err);
//        });
//            next(err);
//
//    });
    view.on('init', function(next) {
        helpers.getMenu('maintenance', function(err,result){
            locals.data.menu = result;
//            locals.data.breadcrumbs = helpers.getBreadcrumbs(result,req.url.toLowerCase(),locals.filters.form.toLowerCase());
            next(err);
        });
    });


    // Render the view
    view.render('maintenance');

}
