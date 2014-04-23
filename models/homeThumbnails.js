var keystone = require('keystone'),
    Types = keystone.Field.Types;

var HomeThumbnail = new keystone.List('HomeThumbnail', {
    autokey: { from: 'name', path: 'key' }
});

HomeThumbnail.add({
    name: { type: String, required: true },
    publishedDate: { type: Date, default: Date.now },
    image: { type: Types.CloudinaryImage },
    order: {type: Types.Number},
    content: {type: Types.Html, wysiwyg: true, height: 150 },
    active: {type: Types.Boolean},
    moreUrl: {type: Types.Url}
});

HomeThumbnail.register();
