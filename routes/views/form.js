/**
 * Created by elnel_000 on 5/2/2014.
 */
/**
 * Created by elnel_000 on 4/14/2014.
 */
var keystone = require('keystone'),
    _ = require('underscore'),
    helpers =  require("../../helpers");
exports = module.exports = function(req, res) {

    var locals = res.locals,
        view = new keystone.View(req, res);
    locals.filters = {
        form: req.params.form
    };
    locals.data = { };    // Set locals
    locals.section = 'form';
    // Load the current post
    view.on('init', function(next) {

        var q = keystone.list('Form').model.findOne({
            state: 'published',
            slug: locals.filters.form
        });

        q.exec(function(err, result) {
            locals.data.form = result;
            locals.data.seo = {
                description: result.seoDescription,
                keywords: result.seoKeywords,
                title: result.title,
                type: 'form'
            };
            next(err);
        });

    });
    view.on('init', function(next) {
        helpers.getMenu(locals.filters.form.toLowerCase(), function(err,result){
            locals.data.menu = result;
            locals.data.breadcrumbs = helpers.getBreadcrumbs(result,req.url.toLowerCase(),locals.filters.form.toLowerCase());
            locals.data.sideMenu = helpers.getActiveSubmenu(result,locals.data.breadcrumbs);
            next(err);
        });
    });


    // Render the view
    view.render('form');

}
