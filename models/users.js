var _ = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Users
 * =====
 */

var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: false },
    level: { type: Types.Select, options: 'first, second, third', default: 'first', index: true },
    company: {type: String},
    title: {type: String},
    prefix: {type: String},
    department: {type:String},
    workPhone: {type: String},
    homePhone: {type: String},
    cellPhone: {type:String},
    fax: {type:String},
    webSite: {type:String},
    address: {type: String},
    unit: {type:String},
    city: {type: String},
    state: {type: String},
    zip: {type:Types.Number},
    country: {type: String},
    consultant: {type: Types.Relationship, ref:'User'}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone' },
    isClient: { type: Boolean, label: 'Can access Profile' }
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


/**
 * Relationships
 */

User.relationship({ ref: 'Post', path: 'author' });


/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();
