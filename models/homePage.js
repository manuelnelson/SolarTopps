var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Home = new keystone.List('Home', {
    autokey: { from: 'name', path: 'key' }
});

Home.add({
    name: { type: String, required: true },
    publishedDate: { type: Date, default: Date.now },
    carousel: { type: Types.CloudinaryImages },
    thumbnailTitle: {type: String},
    thumbnailContent: {type: Types.Html, wysiwyg:true},
    content: {type: Types.Html, wysiwyg: true, height: 400 },

});

Home.register();
