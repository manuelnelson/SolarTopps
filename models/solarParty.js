var _ = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types,
	helpers =  require("../helpers");

/**
 * Users
 * =====
 */

var SolarParty = new keystone.List('SolarParty');

SolarParty.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	homePhone: {type: String},
	cellPhone: {type:String},
	propertyType: { type: Types.Select, options: 'Residential Single Story, Residential Double Story, Commercial Single Story, Commercial Multiple Story, Educational Institution, Government Facility, New Home Construction', default: 'first', index: true },
	address: {type: String},
	city: {type: String},
	zip: {type:Types.Number},
	existingCustomer: {type:String},
	systemCommissioned: {type:String},
	hostDuringCommissioning: {type:String},
	partyDate: {type:Date},
	comments: {type:String},
	createdAt: { type: Date, default: Date.now },
	user: {type: Types.Relationship, ref:'User'}
});

/**
 * Relationships
 */

SolarParty.schema.pre('save', function(next) {
	this.wasNew = this.isNew;
	next();
})

SolarParty.schema.post('save', function() {
	//TODO://Transfer this to a name value json object
	if (this.wasNew) {
		helpers.sendNotificationEmail(['neal@solartopps.com'],'Solar Party', this);
	}
});

/**
 * Registration
 */
SolarParty.defaultSort = '-createdAt';
SolarParty.defaultColumns = 'name, email, createdAt';
SolarParty.register();
