var _ = require('underscore'),
    keystone = require('keystone'),
    Types = keystone.Field.Types,
    helpers =  require("../../helpers");

/**
 * Users
 * =====
 */

var QuickQuote = new keystone.List('SystemEvaluation');

QuickQuote.add({
    name: { type: Types.Name, required: true, index: true },
    email: { type: Types.Email, initial: true, required: true, index: true },
    homePhone: {type: String},
    cellPhone: {type:String},
    propertyType: { type: Types.Select, options: 'Residential Single Story, Residential Double Story, Commercial Single Story, Commercial Multiple Story, Educational Institution, Government Facility, New Home Construction', default: 'first', index: true },
    address: {type: String},
    city: {type: String},
    zip: {type:Types.Number},
    state: {type: String},
    electricBill: {type: String},
    usage: {type: String},
    utilityCompany: {type:String},
    utilityRatePlan: {type:String},
    hearAbout: {type:String},
    comments: {type:String},
    createdAt: { type: Date, default: Date.now },
    user: {type: Types.Relationship, ref:'User'}
});

/**
 * Relationships
 */

QuickQuote.schema.pre('save', function(next) {
    this.wasNew = this.isNew;
    next();
})

QuickQuote.schema.post('save', function() {
    //TODO://Transfer this to a name value json object
    if (this.wasNew) {
        helpers.sendNotificationEmail(['joan@solartopps.com'],'Quick Quote', this);
    }
});

/**
 * Registration
 */
QuickQuote.defaultSort = '-createdAt';
QuickQuote.defaultColumns = 'name, email, createdAt';
QuickQuote.register();
