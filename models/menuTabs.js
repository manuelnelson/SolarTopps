var keystone = require('keystone'),
    Types = keystone.Field.Types;

var MenuTab  = new keystone.List('MenuTab', {
    map: { name: 'name' },
    autokey: { path: 'key', from: 'name'}
});

MenuTab.add({
    name: { type: String, required: true },
    slug: { type: String, index: true },
    state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
    order: { type: Types.Number}
//    categories: { type: Types.Relationship, ref: 'PostCategory', many: true }
});

MenuTab.defaultColumns = 'title, state|20%';
MenuTab.register();
