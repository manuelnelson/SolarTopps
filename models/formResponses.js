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

    keystone.list('User').model.find().where('isAdmin', true).exec(function(err, admins) {

        if (err) return callback(err);

        new keystone.Email('enquiry-notification').send({
            to: admins,
            from: {
                name: 'Solar Topps',
                email: 'robby@solartopps.com'
            },
            subject: 'Form for Solar Topps',
            enquiry: enqiury
        }, callback);

    });

}

FormResponse.defaultSort = '-createdAt';
FormResponse.defaultColumns = 'name, email, enquiryType, createdAt';
FormResponse.register();
