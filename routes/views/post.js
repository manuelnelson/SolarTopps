var keystone = require('keystone'),
	async = require('async'),
    helpers =  require("../../helpers");

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Set locals
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post
	};
	locals.data = {
		posts: []
	};
	
	// Load the current post
	view.on('init', function(next) {

		var q = keystone.list('Post').model.findOne({
			state: 'published',
			slug: locals.filters.post
		}).populate('author categories');

		q.exec(function(err, result) {
            if(!result){
                res.status(404).render('errors/404');
                return;
            }
			locals.data.post = result;
            locals.data.seo = {
                description: result.seoDescription,
                keywords: result.seoKeywords,
                title: result.title,
                date: result.publishedDate,
                type: 'blog post'
            };
			next(err);
		});

	});

    //load categories
    view.on('init', function(next) {

        keystone.list('PostCategory').model.find().sort('name').exec(function(err, results) {

            if (err || !results.length) {
                return next(err);
            }

            locals.data.categories = results;

            // Load the counts for each category
            async.each(locals.data.categories, function(category, next) {

                keystone.list('Post').model.count().where('category').in([category.id]).exec(function(err, count) {
                    category.postCount = count;
                    next(err);
                });

            }, function(err) {
                next(err);
            });

        });

    });

	// Load other posts
	view.on('init', function(next) {
		var q = keystone.list('Post').model.find().where('state', 'published').sort('-publishedDate').limit('5');
		q.exec(function(err, results) {
			locals.data.latest = results;
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
	view.render('post');
	
}
