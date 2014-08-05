/**
 * Created by elnel_000 on 7/28/2014.
 */

var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Referral = new keystone.List('Referral', {
    map: { name: 'name' },
    autokey: { path: 'slug', from: 'name', unique: true }
});

Referral.add({
    name: { type: String, required: true },
    slug: { type: String, index: true },
    credited: { type: Types.Select, options: 'yes, no', default: 'yes'},
    referree: {type: Types.Relationship, ref:'User'}
});


Referral.defaultColumns = 'name, credited|20%';
Referral.register();
