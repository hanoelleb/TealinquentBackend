var async = require('async');
var fs = require('fs');
var multer  = require('multer')
var upload = multer({ dest: './public/data/uploads/' })

var Product = require('../models/product');
var Review = require('../models/review');
var Category = require('../models/category');
const validator = require('express-validator');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.product_list = function(req, res, next) {
    Product.find({}, 'name price stock')
	.exec(function (err, list_products) {
            if (err) { return next(err); }
	    res.render('products', {title: 'All products',
	         prod_list: list_products});
	})
};

exports.product_image = function(req, res, next) {
    Product.findById(req.params.id)
	.exec(function (err, product) {
	    if (err) { return next(err); }
	    res.contentType(product.img.contentType);
	    res.send(product.img.data);
	});
}

exports.product_detail = function(req, res, next) {
    async.parallel ({
        product: function(callback) {
            Product.findById(req.params.id)
                .populate('categories')
                .exec(callback); },
	reviews: function(callback) {
	    Review.find({'product': req.params.id})
		.exec(callback); }
        }, function(err, results) {
	    if (err) { return next(err); }
            if (results.product==null){
	        var err = new Error('Product not found');
		err.status = 404;
		return next(err);
	    }
            res.render('product_detail', {title: 'Product Detail', 
                product: results.product, reviews : results.reviews});
	});  
};

exports.product_create_get = function(req, res, next) {
    Category.find()
	.exec(function(err,categories){
            if (err) { return next(err); }
	
	    for (var i = 0; i < categories.length; i++) {
	        categories[i].checked = 'false';
	    }

            res.render('product_form', { title: 'Create Product', 
                categories: categories} );
	});
};

exports.product_create_post = [

    (req, res, next) => {
        if(!(req.body.category instanceof Array)){
            if(typeof req.body.category==='undefined')
            req.body.category=[];
            else
            req.body.category=new Array(req.body.category);
        }
        next();
    },

    body('name', 'Product name is required').trim().isLength({min: 1}),
    body('desc', 'Product description is required').trim().isLength({min: 1}),
    body('price', 'Product price is required').trim().isLength({min: 1}),
    body('stock', 'Product stock is required').trim().isLength({min: 1}),
    
    sanitizeBody('name').escape(),
    sanitizeBody('desc').escape(),
    sanitizeBody('price').escape(),
    sanitizeBody('stock').escape(),
    sanitizeBody('category.*').escape(),

    (req, res, next) => {
         const errors = validationResult(req);

         var product = new Product(
            {
	        name: req.body.name,
		description: req.body.desc,
		price: req.body.price,
		stock: req.body.stock,
	        categories: req.body.category,
	    }
	 );

	 if (req.file != null) {
	     product.img.data = fs.readFileSync(req.file.path);
             product.img.contentType = 'image/png';
	 }

	 if (!errors.isEmpty()) {
	     Category.find()
		 .exec( function (err, categories) {
		     if (err) { return next(err); }

	             for (let i = 0; i < categories.length; i++) {
                         if (product.categories
			    .indexOf(categories[i]._id) > -1) {
                            categories[i].checked='true';
                         }
                     }
                     res.render('product_form', {title: 'Add product', 
			 categories: categories, errors: errors.array()})
	             return;
		 })
	 } else {
	     product.save( function(err) {
	         if (err) {return next(err);}
		 res.redirect(product.url);
	     });
	 }
    }
];

exports.product_update_get = function(req, res, next) {
    async.parallel(
       {
	  product: function(callback) {
              Product.findById(req.params.id)
		  .populate('categories')
		  .exec(callback);
	  },
	  categories: function(callback) {
	      Category.find(callback);
	  }
       }, function(err, results) {
           if (err) {return next(err);}
	   if (results.product == null) {
	       var err = new Error('Product not found');
               err.status = 404;
               return next(err);
	   }

	   for (var i = 0; i < results.categories.length; i++) {
	       for (var j = 0; j < results.product.categories.length; j++) {
	           if (results.categories[i]._id.toString() ===
			results.product.categories[j]._id.toString()) {
                        results.categories[i].checked='true';
                    } else
		       results.categories[i].checked='false';
	       }
	   }
	   res.render('product_update', { title: 'Update Product',
	       categories: results.categories, product: results.product });
     });
     
};

exports.product_update_post = [
    (req, res, next) => {
        if(!(req.body.category instanceof Array)){
            if(typeof req.body.category==='undefined')
            req.body.category=[];
            else
            req.body.category=new Array(req.body.category);
        }
        next();
    },

    body('name', 'Product name is required').trim().isLength({min: 1}),
    body('desc', 'Product description is required').trim().isLength({min: 1}),
    body('price', 'Product price is required').trim().isLength({min: 1}),
    body('stock', 'Product stock is required').trim().isLength({min: 1}),

    sanitizeBody('name').escape(),
    sanitizeBody('desc').escape(),
    sanitizeBody('price').escape(),
    sanitizeBody('stock').escape(),
    sanitizeBody('category.*').escape(),

    (req, res, next) => {
         const errors = validationResult(req);
         console.log(JSON.stringify(req.body));
         var product = new Product(
            {
                name: req.body.name,
                description: req.body.desc,
                price: req.body.price,
                stock: req.body.stock,
                categories: req.body.category,
		_id: req.params.id
            }
         );

	 if (!errors.isEmpty()) {
             console.log('ERRORS' + errors);
	     Category.find()
                 .exec( function (err, categories) {
                     if (err) { return next(err); }

                     for (let i = 0; i < categories.length; i++) {
                         if (product.categories
                            .indexOf(categories[i]._id) > -1) {
                            categories[i].checked='true';
                         }
                     }
                     res.render('product_update', {title: 'Update product',
                         categories: categories, errors: errors.array(),
		         product: product})
                     return;
             })
	 }
	 else {
             console.log('no errors!!!!');
	     Product.findByIdAndUpdate(req.params.id, product, {},
		 function(err) {
                 if (err) {return next(err);}
                 res.redirect(product.url);
             });
	 }
    }
];

exports.product_delete_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: product delete get');
};

exports.product_delete_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: product dekete post');
};
