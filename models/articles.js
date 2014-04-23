/**
 * Created by elnel_000 on 4/14/2014.
 */
var keystone = require('keystone'),
    Types = keystone.Field.Types;

var Article = new keystone.List('Article', {
    map: { name: 'title' },
    autokey: { path: 'slug', from: 'title', unique: true }
});

Article.add({
    title: { type: String, required: true },
    slug: { type: String, index: true },
    state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
    author: { type: Types.Relationship, ref: 'User', index: true },
    publishedDate: { type: Types.Date, index: true },
    image: { type: Types.CloudinaryImage },
    content: { type: Types.Html, wysiwyg: true, height: 150 }
});

Article.schema.virtual('content.full').get(function() {
    return this.content.extended || this.content.brief;
});

Article.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Article.register();
