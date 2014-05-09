var keystone = require('keystone'),
    Types = keystone.Field.Types;

var HomeCarouselSlide = new keystone.List('HomeCarouselSlide', {
    autokey: { from: 'name', path: 'key' }
});

HomeCarouselSlide.add({
    name: { type: String, required: true },
    publishedDate: { type: Date, default: Date.now },
    image: { type: Types.LocalFile,  dest: keystone.get('localfile dest path')  },
    order: {type: Types.Number},
    heading: {type: Types.Text},
    firstText: {type: Types.Text},
    secondText: {type: Types.Text},
    thirdText: {type: Types.Text},
    animation: {type: Types.Select, options: [{value: 'slideAppearLeftToRight', label:'left to right'},{value: 'slideAppearRightToLeft', label:'right to left'}, {value:'slideAppearUpToDown', label:'top to bottom'},{value:'slideAppearDownToUp', label:'bottom to top'}]}
});

HomeCarouselSlide.register();
