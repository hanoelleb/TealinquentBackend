var async = require('async');
var Review = require('../models/review');
var Product = require('../models/product'); 

exports.review_list = function(req, res, next) {
    Review.find({'product': req.params.id})
	.populate('product')
	.exec( function(err, reviews) {
	    if (err) { return next(err); }
            res.render('reviews', { title: 'Reviews', reviews: reviews});
	});
}

exports.review_detail = function(req, res, next) {
    Review.findById(req.params.rid)
	.populate('product')
	.exec( function(err, review) {
            if (err) { return next(err); }
            res.render('review_detail', {title: 'Review', review: review});
	});
}

exports.review_create_get = function(req, res, next) {
    Product.findById(req.params.id)
       .exec( function(err, product) {
           if (err) { return next(err); }
	   res.render('review_form', {title: 'Add review', product: product});
       });
}

exports.review_create_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: review create post');
}

exports.review_update_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: review update get');
}

exports.review_update_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: review update post');
}

exports.review_delete_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: review delete get');
}

exports.review_delete_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: review delete post');
}

