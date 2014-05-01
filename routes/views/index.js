var keystone = require('keystone')
    _ = require('underscore'),
    helpers = require('helpers');

exports = module.exports = function(req, res) {
	
	var locals = res.locals,
		view = new keystone.View(req, res);
	
	// Set locals
	locals.section = 'home';
    locals.data = {
        posts: []
    };
    // Load the current post
    view.on('init', function(next) {

        var q = keystone.list('HomeThumbnail').model.where({
            active: 'true'
        }).sort('order').limit('3');

        q.exec(function(err, result) {
            locals.data.thumbnails = result;
            next(err);
        });
    });
    view.on('init', function(next) {
        var q = keystone.list('Home').model.find({}).limit('1');
        q.exec(function(err, result) {
            var home = result[0];
            locals.data.home = home;
            if(result){
                locals.data.seo = {
                    description: home.seoDescription,
                    keywords: home.seoKeywords,
                    title: 'Home',
                    date: home.publishedDate,
                    type: 'Home'
                };
            }
            next(err);
        });
    });

    view.on('init', function(next) {
        helpers.getMenu('',function(err,result){
            locals.data.menu = result;
            next(err);
        });
    });
    // Render the view
	view.render('index');
	
}
