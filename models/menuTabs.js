var keystone = require('keystone'),
    Types = keystone.Field.Types;

var MenuTab  = new keystone.List('MenuTab', {
    map: { name: 'name' },
    autokey: { path: 'key', from: 'name'}
});

MenuTab.add({
    name: { type: String, required: true },
    path: { type: String, index: true },
    state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
    order: { type: Types.Number},
    hasSubMenu: {type:Types.Boolean}
});

MenuTab.defaultColumns = 'title, state|20%';
MenuTab.register();
