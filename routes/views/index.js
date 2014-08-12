var keystone = require('keystone')
    _ = require('underscore'),
    helpers =  require("../../helpers");

exports = module.exports = function(req, res) {
	
	var locals = res.locals,
		view = new keystone.View(req, res);
	
	// Set locals
	locals.section = 'home';
    locals.data = {
        posts: []
    };

	//locals.data.headerScripts = '<script>(function() {var _fbq = window._fbq || (window._fbq = []);if (!_fbq.loaded) {var fbds = document.createElement("script");fbds.async = true;fbds.src = "//connect.facebook.net/en_US/fbds.js";var s = document.getElementsByTagName("script")[0];s.parentNode.insertBefore(fbds, s);_fbq.loaded = true;}})();window._fbq = window._fbq || [];window._fbq.push(["track", "6020618782775", {"value":"0.00","currency":"USD"}]);</script><noscript><img height="1" width="1" alt="" style="display:none" src="https://www.facebook.com/tr?ev=6020618782775&amp;cd[value]=0.00&amp;cd[currency]=USD&amp;noscript=1" /></noscript>';

    // Load the current post
    view.on('init', function(next) {

        var q = keystone.list('HomeThumbnail').model.where({
            active: 'true'
        }).sort('order').limit('6');

        q.exec(function(err, result) {
            locals.data.thumbnails = result.slice(0,3);
            if(result.length == 6)
                locals.data.thumbnailsSetTwo = result.slice(3,6);
            next(err);
        });
    });
    view.on('init', function(next) {
        var q = keystone.list('HomeCarouselSlide').model.find({
        }).sort('order');
        q.exec(function(err, result) {
            _.each(result,function(slide){
                switch (slide.animation){
                    case "slideAppearLeftToRight":
                        slide.oppositeAnimation = "slideAppearRightToLeft";
                    case "slideAppearRightToLeft":
                        slide.oppositeAnimation = "slideAppearLeftToRight";
                    case "slideAppearUpToDown":
                        slide.oppositeAnimation = "slideAppearDownToUp";
                    case "slideAppearDownToUp":
                        slide.oppositeAnimation = "slideAppearUpToDown";
                }
            });
            locals.data.carouselSlides = result;
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
