var keystone = require('keystone'),
	_ = require('underscore'),
	helpers =  require("../../helpers");
exports = module.exports = function(req, res) {
	var locals = res.locals,
		view = new keystone.View(req, res);

	locals.data = { };    // Set locals
	locals.section = 'form';

	view.on('init', function(next) {
		helpers.getMenu('userInformation', function(err,result){
			locals.data.menu = result;
//            locals.data.breadcrumbs = helpers.getBreadcrumbs(result,req.url.toLowerCase(),locals.filters.form.toLowerCase());
			next(err);
		});
	});


	// Render the view
	view.render('userInformation');

}
