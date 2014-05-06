/**
 * Created by elnel_000 on 5/3/2014.
 */
var async = require('async'),
    keystone = require('keystone');

exports = module.exports = function(req, res) {

    var FormResponse = keystone.list('FormResponse');
    new FormResponse.model({
        form: req.body.form,
        response: JSON.stringify(req.body.response)
    }).save(function(err) {
            if (err) return res.apiResponse({ success: false, err: err });
            return res.apiResponse({ success: true });
        });
}