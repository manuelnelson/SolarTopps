var keystone = require('keystone'),
	async = require('async');

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
			locals.data.post = result;
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
			locals.data.posts = results;
			next(err);
		});

	});
    var menu;
    view.on('init', function(next) {
        var q = keystone.list('MenuTab').model.where({
            state: 'published'
        });

        q.exec(function(err, result) {
            menu = result;
            next(err);
        });
    });
    view.on('init', function(next) {

    });
	// Render the view
	view.render('post');
	
}
