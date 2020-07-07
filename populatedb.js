#! /usr/bin/env node
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var fs = require('fs');

//TEAS
var jasmine = './public/images/tea1.jpg';
var white = './public/images/whitetea.jpg';
var earlgrey = './public/images/earlgrey.jpg';
var chai = './public/images/chaitea.jpeg';
var englishbreakfast = './public/images/englishbtea.jpg';
var genmaicha = './public/images/genmaicha.jpg';
var matcha = './public/images/matchatea.jpg';
var rooibos = './public/images/rooibos.jpeg';
var oolong = './public/images/oolong.jpg';
var yerbamate = './public/images/yerbamate.jpg';
var mint = './public/images/minttea.jpg';

//EQUIPMENT
var infuser = './public/images/infuser.jpg';
var whisk = './public/images/matchawhisk.jpg';
var kettle1 = './public/images/teakettle1.jpg';
var kettle2 = './public/images/teakettle2.jpeg';
var kettle3 = './public/images/teakettle3.jpeg';
var kettle4 = './public/images/teakettle4.jpg';
var kettle5 = './public/images/teakettle5.jpeg';

//SETS
var teaset1 = './public/images/teaset1.jpeg';
var teaset2 = './public/images/teaset2.jpg';
var teaset3 = './public/images/teaset3.jpeg';
var teaset4 = './public/images/teaset4.jpg';

//DISPLAYS/STANDS
var cakestand = './public/images/cakestand.jpg';
var dessertstand = './public/images/dessertstand.jpeg';
var modernstand = './public/images/modernstand.jpg';
var teatimeset = './public/images/teatimeset.jpg';

var Product = require('./models/product')
var Category = require('./models/category')
var Review = require('./models/review')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var products = [];
var categories = [];
var reviews = [];

function productCreate(name, description, price, stock, categories,
            imgpath, cb) {
    productdetail = {
        name: name,
	description: description,
	price: price,
	stock: stock,
	img: '',
    };

    if (imgpath != false) {
        productdetail.img.data = fs.readFileSync(imgpath);
        productdetail.img.contentType = 'image/png';
    }

    if (categories != false) productdetail.categories = categories

    var product = new Product(productdetail);

    product.save(function(err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Product: ' + product);
        products.push(product)
        cb(null, product);
    });
}

function categoryCreate(name, cb) {
    var category = new Category({name: name});

    category.save(function(err) {
        if (err) {
	    cb(err, null);
	    return;
	}
	console.log('New Category: ' + category);
        categories.push(category)
        cb(null, category);
    });
}

function reviewCreate(name, rating, details, product, cb) {
    reviewdetail = {
       name: name,
       rating: rating,
       details: details,
       product: product
    }

    var review = new Review(reviewdetail);
   
    review.save(function(err) {
       if (err) {
	   cb(err, null);
	   return;
       }
       console.log('New Review: ' + review);
       reviews.push(review)
       cb(null, review);
    });
}

function createCategories(cb) {
    async.series([
        function(callback) {
	    categoryCreate('loose-leaf', callback);
	},
	function(callback) {
            categoryCreate('tea bags', callback);
        },
	function(callback) {
            categoryCreate('powder/mix', callback);
        },
	function(callback) {
            categoryCreate('caffeine', callback);
        },
	function(callback) {
            categoryCreate('herbal', callback);
        },
	function(callback) {
            categoryCreate('equipment', callback);
        },
	function(callback) {
            categoryCreate('serve', callback);
        },
    ], cb);
}

function createProducts(cb) {
    async.series([
        function(callback) {
	    productCreate('Jasmine Tea', 'Japanese green tea infused with jasmine blossoms. 16 tea bags.', 800, 750, [categories[1],categories[3]], jasmine, callback);
	},
	function(callback) {
            productCreate('White Tea', 'Tea made when the tea leaves are plucked as early as possible. Imported from China. Loose-leaf.', 1500, 400, [categories[0],categories[3]], white, callback);
        },
	function(callback) {
            productCreate('Earl Grey Tea', 'English black tea infused with bergamot. 10 tea bags.', 600, 800, [categories[1],categories[3]], earlgrey, callback);
        },
	function(callback) {
            productCreate('Chai', 'Indian black tea infused with cardamon, cinnamon, and peppercorn. 16 0z. Powder mix.', 1000, 450, [categories[2],categories[3]], chai, callback);
        },
	function(callback) {
            productCreate('English Breakfast Tea', 'Traditional English black tea. 20 tea bags.', 700, 600, [categories[1],categories[3]], englishbreakfast, callback);
        },
	function(callback) {
            productCreate('Genmaicha', 'Japanese green tea infused with toasted  rice. 16 tea bags.', 600, 900, [categories[1],categories[3]], genmaicha, callback);
        },
	function(callback) {
            productCreate('Matcha', 'Traditional Japanese tea. 8 oz.Powder.', 2000, 350, [categories[2],categories[3]], matcha, callback);
	},
    ],cb);
}

function createReviews(cb) {
    async.series([
	 function(callback) {
             reviewCreate('John Smith', 4, 'Amazing tea!', products[0], callback);
	 },
	 function(callback) {
	     reviewCreate('Alice Waldorf', 5, 'Wow, it\'s worth the price!', products[6], callback);
	 },
    ],cb);
}

async.series([
    createCategories,
    createProducts,
    createReviews
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log( 'REVIEWS: '+ reviews);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});


