/**
 * Created by elnel_000 on 4/15/2014.
 */
var keystone = require('keystone');

exports.dateFormat = function (dateString) {
    return new Date(dateString).toDateString();
};
exports.localFile = function (path) {
    var split = path.split('public');
    if(split.length>0)
        return split[1];
};

exports.getMenu = function(pageTitle, callback){
    var q = keystone.list('MenuTab').model.where({
        state: 'published'
    }).sort('order');
    var menu;
    q.exec(function(err, result) {
        menu = result;
        var query = keystone.list('MenuLink').model.where({
            state: 'published'
        }).sort('order').populate('menuTab');

        query.exec(function(err, result) {
            //go through menu, get menulinks for menutabs with no slug
            _.each(menu,function(item,ndx){
                var subMenuLinks = _.filter(result,function(link){
                    return link.menuTab.name == item.name;
                });
                _.map(subMenuLinks,function(subLink){
                    subLink.folder = item.path;
                    var pathParts = subLink.path.split('/');
                    var lastSlug = pathParts[pathParts.length -1].toLowerCase();
                    subLink.isActive = lastSlug == pageTitle;
                });
                item.subMenuLinks = _.sortBy(subMenuLinks, function(subLink){
                    return subLink.order;
                });
            });
            callback(err, menu);

        });
    });
}

exports.getBreadcrumbs = function(menu, url, pageTitle){
    //get current menu
    var currentMenu = "";
    _.each(menu, function(menuTab){
        if(menuTab.hasSubMenu){
            var menuLink = _.find(menuTab.subMenuLinks, function(subMenuLink){
                if(subMenuLink.path && !subMenuLink.isExternal)
                    return subMenuLink.path.replace('/').toLowerCase() == pageTitle;
                else if(subMenuLink.path && subMenuLink.isExternal)
                    return url.indexOf(subMenuLink.path.toLowerCase()) >= 0;

            });
            if(menuLink)
                currentMenu = menuLink;
        }else{
            if(typeof(menuTab.path) != 'undefined' && menuTab.path.toLowerCase() == url)
                currentMenu = menuTab;
        }
    });
    if(currentMenu){
        if(typeof currentMenu.hasSubMenu != 'undefined'){
            //menuTab
            return {
                hasSubMenu: false,
                name: currentMenu.name
            };
        }else{
            //menuLink
            return {
                hasSubMenu: true,
                subMenu: currentMenu.menuTab.name,
                name: currentMenu.title
            };
        }
    }
}

exports.getActiveSubmenu = function(menu, breadCrumbs) {
    if (breadCrumbs && breadCrumbs.hasSubMenu) {
        //we have side menu
        //Get all menu links with submenu name
        var activeMenuTab = _.find(menu, function (menuItem) {
            return menuItem.name == breadCrumbs.subMenu;
        })
        return activeMenuTab.subMenuLinks;
    }
}