// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv')().load();

// Require keystone
var keystone = require('keystone'),
    exphbs  = require('express3-handlebars'),
    helpers = require("./helpers");


// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'SolarTopps',
	'brand': 'SolarTopps',
	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.png',
	'views': 'templates/views',
    'custom engine': exphbs({defaultLayout: 'main',layoutsDir:'templates/layouts',partialsDir:'templates/views/partials',extname:'.hbs', helpers: helpers}),
	'view engine': 'hbs',
	'emails': 'templates/emails',
	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
    'signin url': '/signin',
	'cookie secret': '_Ab"%|=y1dMG,9-95=VN<,ZvW$6pH5XuL.;1V#>NnHE(M(T=>DUaT=&4DHdf`UP~',
    'localfile dest path': 'C:/Web/SolarTopps/public/uploadedimages'
});


keystone.set('port', keystone.get('env') == 'production' ? '80' : '8050');
var sessionStoreOptions = {
    db: 'solartopps'
};
if(keystone.get('env') == 'production')
    sessionStoreOptions.url = 'mongodb://heroku_app25105627:rk38e037pjn9bit5vhvv58cfdc@ds043037.mongolab.com:43037/heroku_app25105627';


keystone.set('session store options', sessionStoreOptions);

keystone.set('session store', 'connect-mongo');
keystone.set('form upload path', "C:/Web/SolarTopps/public")
// Load your project's Models
keystone.import('models');
keystone.set('wysiwyg additional buttons', 'styleselect');
keystone.set('wysiwyg images', 'true');
// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

// Load your project's Routes

keystone.set('routes', require('./routes'));

// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.

keystone.set('email locals', {
	logo_src: '/images/ST Logo.png',
	logo_width: 380,
	logo_height: 262,
	theme: {
		email_bg: '#f9f9f9',
		link_color: '#208e4e',
		buttons: {
			color: '#fff',
			background_color: '#208e4e',
			border_color: '#1a7cb7'
		}
	}
});

// Setup replacement rules for emails, to automate the handling of differences
// between development a production.

// Be sure to update this rule to include your site's actual domain, and add
// other rules your email templates require.

keystone.set('email rules', [{
	find: '/images/',
	replace: (keystone.get('env') == 'production') ? 'http://www.solartopps.com/images/' : 'http://localhost:8020/images/'
}, {
	find: '/keystone/',
	replace: (keystone.get('env') == 'production') ? 'http://www.solartopps.com/keystone/' : 'http://localhost:8020/keystone/'
}]);

// Load your project's email test routes
keystone.set('email tests', require('./routes/emails'));

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
	'posts': ['posts', 'post-categories'],
	'users': 'users',
    'menu': ['menu-tabs','menu-links'],
    'articles': 'articles',
    'forms': ['forms', 'form-responses']
});

// Start Keystone to connect to your database and initialise the web server
keystone.start();
