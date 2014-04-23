var keystone = require('keystone'),
	async = require('async');

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
        var q = keystone.list('MenuLink').model.where({
            state: 'published'
        }).populate('menuTab');

        q.exec(function(err, result) {
            //go through menu, get menulinks for menutabs with no slug
            _.each(menu,function(item,ndx){
                if(item.slug != "")
                    item.hasSubMenu = false;
                else{
                    item.hasSubMenu = true;
                    var subMenuLinks = _.filter(result,function(link){
                        return link.menuTab.name == item.name;
                    });
                    item.subMenuLinks = _.sortBy(subMenuLinks, function(subLink){
                        return subLink.order;
                    });
                }

            });
            locals.data.menu = menu;
            next(err);
        });
    });
	
	// Load the current category filter
//	view.on('init', function(next) {
//
//		if (req.params.category) {
//			keystone.list('PostCategory').model.findOne({ key: locals.filters.category }).exec(function(err, result) {
//				locals.data.category = result;
//				next(err);
//			});
//		} else {
//			next();
//		}
//
//	});
	
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
	
	// Render the view
	view.render('blog');
	
}
