var keystone = require('keystone'),
	async = require('async'),
    helpers =  require("../../helpers");

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// Init locals
	locals.section = 'blog';
	locals.filters = {
		category: req.params.category
	};
	locals.data = {
		posts: [],
		categories: []
	};
	
	// Load all categories
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
    view.on('init', function(next) {
        helpers.getMenu('',function(err,result){
            locals.data.menu = result;
            next(err);
        });
    });

    // Load latest
    view.on('init', function(next) {
        var q = keystone.list('Post').model.find().where('state', 'published').sort('-publishedDate').limit('5');
        q.exec(function(err, results) {
            locals.data.latest = results;
            next(err);
        });
    });

	// Load the posts
	view.on('init', function(next) {

		var q = keystone.list('Post').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10
			})
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('author categories');

		if (locals.data.category) {
			q.where('categories').in([locals.data.category]);
		}

		q.exec(function(err, results) {
			locals.data.posts = results;
			next(err);
		});

	});

    view.on('init', function(next){
//        {
//            "2013-05-30": {"number": 5, "badgeClass": "background-turquoise", "url": "http://w3widgets.com/responsive-slider"},
//            "2013-05-26": {"number": 1, "badgeClass": "background-turquoise", "url": "http://w3widgets.com"},
//            "2013-05-03": {"number": 1, "badgeClass": "background-pomegranate"},
//            "2013-05-12": {}}

        var currDate = new Date();
        //get first day of current month
        console.log(currDate.getUTCFullYear() + ": " + currDate.getUTCMonth() + ": "  + currDate.getUTCDate());
        var start = new Date(currDate.getUTCFullYear(),currDate.getUTCMonth()+1,currDate.getUTCDate());
        var end = start;
        end.setMonth(end.getMonth() + 1);
        console.log(end.toLocaleDateString());
        var q = keystone.list('Post').model.find({publishedDate: {$gte: start, $lt: end}}).where('state', 'published').sort('-publishedDate');
            q.exec(function(err, results) {
                var monthPosts = results;
                locals.data.calendar = results;
                next(err);
            });
    })

	// Render the view
	view.render('blog');
	
}
