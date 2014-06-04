/**
 * Created by elnel_000 on 5/3/2014.
 */
var async = require('async'),
    keystone = require('keystone'),
    fs = require('fs');

exports = module.exports = function(req, res) {
    var serverPath = '/uploadedFormFiles/' + req.files.fileUpload.name;

    require('fs').rename(
        req.files.userPhoto.path,
            '/home/manny/TestWeb/SolarTopps/public' + serverPath,
        function(error) {
            if(error) {
                res.send({
                    error: 'Unable To Upload File'
                });
                return;
            }
            //TODO - enter in other code here
        }
    );

//    var FormResponse = keystone.list('FormResponse');
//    new FormResponse.model({
//        form: req.body.form,
//        response: JSON.stringify(req.body.response)
//    }).save(function(err) {
//            if (err) return res.apiResponse({ success: false, err: err });
//            return res.apiResponse({ success: true });
//        });

}