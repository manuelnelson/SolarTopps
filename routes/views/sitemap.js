/**
 * Created by elnel_000 on 4/14/2014.
 */
var keystone = require('keystone'),
    _ = require('underscore'),
    helpers = require("../../helpers");
exports = module.exports = function(req, res) {

    var locals = res.locals,
        view = new keystone.View(req, res);
    locals.data = { };    // Set locals
    locals.section = 'sitemap';
    // Load the current post
    view.on('init', function(next) {

        var q = keystone.list('Article').model.where({
            state: 'published'
        }).sort('title');

        q.exec(function(err, result) {
            if(!result){
                res.status(404).render('errors/404');
                return;
            }
            locals.data.articles = result;
            locals.data.seo = {
                description: "Sitemap for Solar Topps",
                keywords: "sitemap, solar, arizona",
                title: "Sitemap - Solar Topps",
                date: Date.now(),
                type: 'sitemap'
            };
            next(err);
        });

    });
    view.on('init', function(next) {
        var q = keystone.list('Post').model.where({
            state: 'published'
        }).sort('title');
        q.exec(function(err, result) {
            locals.data.posts = result;
            next(err);
        });
    });
    view.on('init', function(next) {
        var q = keystone.list('Form').model.where({
            state: 'published'
        }).sort('title');
        q.exec(function(err, result) {
            locals.data.forms = result;
            next(err);
        });
    });
    view.on('init', function(next) {
        helpers.getMenu('sitemap', function(err,result){
            locals.data.menu = result;
            next(err);
        });
    });
    // Render the view
    view.render('sitemap');
}
