var _ = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types,
	helpers =  require("../helpers");

/**
 * Users
 * =====
 */

var CustomerSupport = new keystone.List('CustomerSupport');

CustomerSupport.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	homePhone: {type: String},
	cellPhone: {type:String},
	propertyType: { type: Types.Select, options: 'Residential Single Story, Residential Double Story, Commercial Single Story, Commercial Multiple Story, Educational Institution, Government Facility, New Home Construction', default: 'first', index: true },
	address: {type: String},
	city: {type: String},
	zip: {type:Types.Number},
	whoInstalled: {type: String},
	whenInstalled: {type: String},
	purchased: {type: String},
	monitoring: {type:String},
	size: {type:Types.Number},
	systemMounting: {type:String},
	numberOfPanels: {type:Types.Number},
	typeOfPanels: {type:String},
	numberOfInverters: {type:Types.Number},
	typeOfInverters: {type:String},
	hearAbout: {type:String},
	comments: {type:String},
	createdAt: { type: Date, default: Date.now },
	user: {type: Types.Relationship, ref:'User'}
});

/**
 * Relationships
 */

CustomerSupport.schema.pre('save', function(next) {
	this.wasNew = this.isNew;
	next();
})

CustomerSupport.schema.post('save', function() {
	//TODO://Transfer this to a name value json object
	if (this.wasNew) {
		helpers.sendNotificationEmail(['neal@solartopps.com'],'Monitoring', this);
	}
});

/**
 * Registration
 */
CustomerSupport.defaultSort = '-createdAt';
CustomerSupport.defaultColumns = 'name, email, createdAt';
CustomerSupport.register();
