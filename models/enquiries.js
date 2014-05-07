var keystone = require('keystone'),
    exphbs  = require('express3-handlebars'),
	Types = keystone.Field.Types;

var Enquiry = new keystone.List('Enquiry', {
	nocreate: true,
	noedit: true
});

Enquiry.add({
	name: { type: String, required: true },
	email: { type: Types.Email, required: true },
	phone: { type: String },
	message: { type: String, required: true },
	createdAt: { type: Date, default: Date.now }
});

Enquiry.schema.pre('save', function(next) {
	this.wasNew = this.isNew;
	next();
})

Enquiry.schema.post('save', function() {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

Enquiry.schema.methods.sendNotificationEmail = function(callback) {
	
	var enqiury = this;
	
	keystone.list('User').model.find().where('isAdmin', true).exec(function(err, admins) {
		
		if (err) return callback(err);
		
		new keystone.Email('enquiry-notification').send({
			to: admins,
			from: {
				name: 'Solar Topps',
				email: 'elnels@gmail.com'
			},
			subject: 'New Enquiry for Solar Topps',
			enquiry: enqiury
		}, callback);
		
	});
	
}

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, enquiryType, createdAt';
Enquiry.register();
