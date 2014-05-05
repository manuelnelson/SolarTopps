/**
 * Created by elnel_000 on 5/2/2014.
 */
/**
 * Created by elnel_000 on 4/14/2014.
 */
var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Form = new keystone.List('Form', {
    map: { name: 'title' },
    autokey: { path: 'slug', from: 'title', unique: true }
});

Form.add({
    title: { type: String, required: true },
    slug: { type: String, index: true },
    state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
    image: { type: Types.LocalFile, dest: keystone.get('localfile dest path') },
    content: { type: Types.Html, wysiwyg: true, height: 150 },
    form: { type: Types.Html, wysiwyg: true, height: 150 },
    emailMessage: {type: Types.Html, wysiwyg: true, height: 150},
    emailRecipeints: {type: Types.Relationship, ref: 'User', many:true},
    seoKeywords: {type: String},
    seoDescription: {type: String}
});

Form.defaultColumns = 'title, state|20%';
Form.register();
