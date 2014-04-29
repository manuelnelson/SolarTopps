/**
 * Created by elnel_000 on 4/28/2014.
 */
var async = require('async'),
    keystone = require('keystone');

exports = module.exports = function(req, res) {

    var Enquiry = keystone.list('Enquiry');
    new Enquiry.model({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    }).save(function(err) {
            if (err) return res.apiResponse({ success: false, err: err });
            return res.apiResponse({ success: true });
        });
}