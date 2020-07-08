var async = require('async');
var Product = require('../models/product');
var Review = require('../models/review');
var Category = require('../models/category');

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
    res.send('NOT IMPLEMENTED: product create get');
};

exports.product_create_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: product create post');
};

exports.product_update_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: product update get');
};

exports.product_update_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: product update post');
};

exports.product_delete_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: product delete get');
};

exports.product_delete_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: product dekete post');
};
