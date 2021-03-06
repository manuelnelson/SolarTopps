/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var _ = require('underscore'),
	keystone = require('keystone'),
	middleware = require('./middleware'),
	importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
    api: importRoutes('./api')
};
// Handle 404 errors
keystone.set('404', function(req, res, next) {
    res.notfound();
});

// Handle other errors
keystone.set('500', function(err, req, res, next) {
    var title, message;
    if (err instanceof Error) {
        message = err.message;
        err = err.stack;
    }
    res.err(err, title, message);
});

// Setup Route Bindings
exports = module.exports = function(app) {
    // Views
	app.get('/', routes.views.index);
	app.get('/blog/:category?', routes.views.blog);
	app.get('/blog/post/:post', routes.views.post);
    app.get('/testimonials/:article', routes.views.article);
    app.get('/company/:article', routes.views.article);
    app.get('/resources/:article', routes.views.article);
    app.get('/resources/forms/:form', routes.views.form);
    app.get('/forms/:form', routes.views.form);
    app.get('/services/:article', routes.views.article);
    app.get('/go-solar/:article', routes.views.article);
	app.all('/contact', routes.views.contact);
    app.get('/sitemap', routes.views.sitemap);
    app.get('/profile', routes.views.profile);
    app.get('/profile/quick-quote', routes.views.quickquote);
    app.get('/profile/system-evaluation', routes.views.systemEvaluation);
    app.get('/profile/monitoring', routes.views.monitoring);
    app.get('/profile/maintenance', routes.views.maintenance);
	app.get('/profile/solar-party', routes.views.solarParty);
	app.get('/register', routes.views.register);
	app.get('/profile/user-information', routes.views.userInformation);

	app.all('/signin', routes.views.signin);

    // API
    app.all('/api*', keystone.initAPI);
    app.all('/api/contact', routes.api.contact);
    app.all('/api/form', routes.api.form);
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

	//redirects
	app.get('/home-solar-panels-and-temperature-considerations*', routes.views.index);
	app.get('/comparing-solar-system-solar-panel-efficiency-important*', routes.views.index);
	app.get('/solar-quote-rooftop-solar-power*', routes.views.index);


}

