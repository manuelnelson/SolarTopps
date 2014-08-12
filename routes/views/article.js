/**
 * Created by elnel_000 on 4/14/2014.
 */
var keystone = require('keystone'),
    _ = require('underscore'),
    helpers = require("../../helpers");
exports = module.exports = function(req, res) {

    var locals = res.locals,
        view = new keystone.View(req, res);
    locals.filters = {
        article: req.params.article
    };
    locals.data = { };    // Set locals
    locals.section = 'article';
    // Load the current post
    view.on('init', function(next) {

        var q = keystone.list('Article').model.findOne({
            state: 'published',
            slug: locals.filters.article
        }).populate('author');

        q.exec(function(err, result) {
            if(!result){
                res.status(404).render('errors/404');
                return;
            }
            locals.data.article = result;
            if(result.title)
                locals.data.title = result.title;
            locals.data.seo = {
                description: result.seoDescription,
                keywords: result.seoKeywords,
                title: result.title,
                date: result.publishedDate,
                type: 'article'
            };
			locals.data.headerScripts = "";
			if(result.useFacebookTracking){
				locals.data.headerScripts = '<script>(function() {var _fbq = window._fbq || (window._fbq = []);if (!_fbq.loaded) {var fbds = document.createElement("script");fbds.async = true;fbds.src = "//connect.facebook.net/en_US/fbds.js";var s = document.getElementsByTagName("script")[0];s.parentNode.insertBefore(fbds, s);_fbq.loaded = true;}})();window._fbq = window._fbq || [];window._fbq.push(["track", "6020618782775", {"value":"0.00","currency":"USD"}]);</script><noscript><img height="1" width="1" alt="" style="display:none" src="https://www.facebook.com/tr?ev=6020618782775&amp;cd[value]=0.00&amp;cd[currency]=USD&amp;noscript=1" /></noscript>';
			}
			if(result.useBingTracking){
				locals.data.headerScripts += '<script type="text/javascript"> if (!window.mstag) mstag = {loadTag : function(){},time : (new Date()).getTime()};</script><script id="mstag_tops" type="text/javascript" src="//flex.msn.com/mstag/site/e7ec24ce-511a-41de-b8be-a984385c7251/mstag.js"></script> <script type="text/javascript"> mstag.loadTag("analytics", {dedup:"1",domainId:"3228306",type:"1",actionid:"256752"})</script> <noscript> <iframe src="//flex.msn.com/mstag/tag/e7ec24ce-511a-41de-b8be-a984385c7251/analytics.html?dedup=1&domainId=3228306&type=1&actionid=256752" frameborder="0" scrolling="no" width="1" height="1" style="visibility:hidden;display:none"></iframe></noscript>';
			}
			next(err);
        });

    });

    view.on('init', function(next) {
        helpers.getMenu(locals.filters.article.toLowerCase(), function(err,result){
            locals.data.menu = result;
            locals.data.breadcrumbs = helpers.getBreadcrumbs(result,req.url.toLowerCase(),locals.filters.article.toLowerCase());
            locals.data.sideMenu = helpers.getActiveSubmenu(result,locals.data.breadcrumbs);
            next(err);
        });
    });

    // Render the view
    view.render('article');

}
