var keystone = require('keystone'),
    Types = keystone.Field.Types;

var MenuLink = new keystone.List('MenuLink', {
    map: { name: 'title' },
    autokey: { path: 'path', from: 'title', unique: true }
});

MenuLink.add({
    title: { type: String, required: true },
    path: { type: String, index: true },
    state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
    publishedDate: { type: Types.Date, index: true },
    menuTab: { type: Types.Relationship, ref: 'MenuTab', many: false, index: true },
    order: { type: Types.Number},
    isExternal: {type: Types.Boolean}
});


MenuLink.defaultColumns = 'title, state|20%, menuTab|20%';
MenuLink.register();
