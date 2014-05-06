var keystone = require('keystone'),
    Types = keystone.Field.Types;

var FormResponse = new keystone.List('FormResponse', {
    nocreate: true,
    noedit: true
});

FormResponse.add({
    form: {type: String, index:true},
    response: {type: String},
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

    var enqiury = this;

    keystone.list('Form').model.find().where('slug', this.form).exec(function(err, form) {

        if (err) return callback(err);

        new keystone.Email({
            templateName: 'email-form',
            templateExt: '.hbs'
        }).send({
            to: form[0].emailRecipeints,
            from: {
                name: 'Solar Topps',
                email: 'elnels@gmail.com'
            },
            subject: 'Form for Solar Topps',
            enquiry: {
                form: form[0],
                data: enqiury
            }
        }, callback);

    });

}

FormResponse.defaultSort = '-createdAt';
FormResponse.defaultColumns = 'name, email, enquiryType, createdAt';
FormResponse.register();
