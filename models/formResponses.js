var keystone = require('keystone'),
    Types = keystone.Field.Types;

var FormResponse = new keystone.List('FormResponse', {
    nocreate: true,
    noedit: true
});

FormResponse.add({
    form: {type: String, index:true},
    response: {type: String},
    formMarkdown: {type:Types.Markdown},
    createdAt: { type: Date, default: Date.now }
});

FormResponse.schema.pre('save', function(next) {
    this.wasNew = this.isNew;
    next();
})

FormResponse.schema.post('save', function() {
    if (this.wasNew) {
        this.sendNotificationEmail();
    }
});

FormResponse.schema.methods.sendNotificationEmail = function(callback) {

    var enquiry = this;

    keystone.list('Form').model.find().where('slug', this.form).populate('emailRecipeints').exec(function(err, form) {

        if (err) return callback(err);
        enquiry.responseJson = JSON.parse(enquiry.response);
        new keystone.Email('email-form').send({
            to: form[0].emailRecipeints,
            from: {
                name: 'Solar Topps',
                email: 'info@solartopps.com'
            },
            subject: 'Form for Solar Topps',
            enquiry: {
                form: form[0],
                data: enquiry
            }
        }, callback);

    });

}

FormResponse.defaultSort = '-createdAt';
FormResponse.defaultColumns = 'name, email, enquiryType, createdAt';
FormResponse.register();
