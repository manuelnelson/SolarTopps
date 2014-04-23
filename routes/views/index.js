var keystone = require('keystone')
    _ = require('underscore');

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

    // Render the view
	view.render('index');
	
}
