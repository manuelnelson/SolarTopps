/**
 * Created by elnel_000 on 5/3/2014.
 */
var async = require('async'),
    keystone = require('keystone'),
    fs = require('fs');

exports = module.exports = function(req, res) {
    //file uploaded

        if(req.files) {
            var fileName = req.files.fileUpload.name;
            var serverPath = '/uploadedFormFiles/' + fileName;
            var localPath = keystone.get('form upload path');
            fs.readFile(req.files.fileUpload.path, function (err, data) {
                // ...
                var newPath = localPath + serverPath;
                fs.writeFile(newPath, data,
                    function (error) {
                        if (error) {
                            res.send({
                                error: 'Unable To Upload File'
                            });
                            return;
                        }
                        return res.apiResponse({ fileName: fileName});
                    }
                );
            });
        }
        else{
            //submit the form
            var FormResponse = keystone.list('FormResponse');
            var model = new FormResponse.model({
                form: req.body.form,
                response: JSON.stringify(req.body.response)
            })
            model.formMarkdown.md = req.body.formMarkdown;
            model.save(function(err) {
                if (err) return res.apiResponse({ success: false, err: err });
                return res.apiResponse({ success: true });
            });
        }

}