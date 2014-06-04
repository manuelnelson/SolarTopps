/**
 * Created by elnel_000 on 5/3/2014.
 */
var async = require('async'),
    keystone = require('keystone'),
    fs = require('fs');

exports = module.exports = function(req, res) {
    //file uploaded
    if(req.files){
        var fileName = req.files.fileUpload.name;
        var serverPath = '/uploadedFormFiles/' + fileName;
        var localPath = keystone.get('form upload path');
        require('fs').rename(
            req.files.fileUpload.path, localPath + serverPath,
            function(error) {
                if(error) {
                    res.send({
                        error: 'Unable To Upload File'
                    });
                    return;
                }
                return res.apiResponse({ fileName: fileName});
            }
        );
    }
    else{
        //submit the form
        var FormResponse = keystone.list('FormResponse');
        new FormResponse.model({
            form: req.body.form,
            response: JSON.stringify(req.body.response)
        }).save(function(err) {
                if (err) return res.apiResponse({ success: false, err: err });
                return res.apiResponse({ success: true });
            });
    }
}