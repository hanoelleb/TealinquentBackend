var async = require('async');
var Review = require('../models/review');
var Product = require('../models/product'); 
const validator = require('express-validator');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.review_list = function(req, res, next) {
    Review.find({'product': req.params.id})
	.populate('product')
	.exec( function(err, reviews) {
	    if (err) { return next(err); }
            res.render('reviews', { title: 'Reviews', 
		reviews: reviews, product: req.params.id});
	});
}

exports.review_detail = function(req, res, next) {
    Review.findById(req.params.rid)
	.populate('product')
	.exec( function(err, review) {
            if (err) { return next(err); }
            res.render('review_detail', {title: 'Review',
		review: review, product: req.params.id});
	});
}

exports.review_create_get = function(req, res, next) {
    Product.findById(req.params.id)
       .exec( function(err, product) {
           if (err) { return next(err); }
	   res.render('review_form', {title: 'Add review', product: product});
       });
}

exports.review_create_post = [
    body('name', 'Name is required').trim().isLength({min: 1}),
    body('rating', 'Rating is required').isNumeric(),
    body('details', 'Details are required').trim().isLength({min: 1}),

    sanitizeBody('*').escape(),

    //console.log('product: ' + req.body.product), 
    (req, res, next) => {
       const errors = validationResult(req);

       var review = new Review(
         {
	     name: req.body.name,
             rating: req.body.rating,
             details: req.body.details,
	 }
       )

       if (!errors.isEmpty()){
           Product.findById(req.params.id)
               .exec( function(err, product) {
                   if (err) { return next(err); }
                   res.render('review_form', {title: 'Add review', 
			product: product});
		   return;
               });
       } else {
           Product.findById(req.params.id)
               .exec( function(err, product) {
	           if (err) { return next(err); }
		   review.product = product;
		   review.save( function(err) {
		       if (err) { return next(err); }
		       res.redirect(review.url);
		   });
	       });
       }
    }
]

exports.review_update_get = function(req, res, next) {
    if (res.locals.currentUser) {
    Review.findById(req.params.rid)
	.populate('product')
	.exec(function(err, review) {
	    if (err) {return next(err);}
	    if (review == null) {
	        var err = new Error('Review not found');
		err.status = 404;
		return next(err);
	    }

	    res.render('review_form', {title: 'Update review',
		review: review});
	})
    } else 
	res.redirect('/auth/login');
}

exports.review_update_post = [
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }),
    body('rating', 'Rating must not be empty.').trim().isNumeric().isLength({ min: 1 }),
    body('details', 'Details must not be empty.').trim().isLength({ min: 1 }),

    sanitizeBody('name').escape(),
    sanitizeBody('rating').escape(),
    sanitizeBody('details').escape(),

    (req, res, next) => {
        const errors = validationResult(req);

	var review = new Review (
	  {
              name: req.body.name,
              rating: req.body.rating,
              details: req.body.details,
	      product: req.params.id,
              _id: req.params.rid
	  }
	);

	if (!errors.isEmpty()){
	    res.render('review_form', {title: 'Update review', 
		review: review});
	    return;
	}
	else {
	    Review.findByIdAndUpdate(req.params.rid, review, {},
		function(err,thereview) {
		    if (err) { return next(err);}
                    res.redirect(thereview.url);
		});
	}
    }
]

exports.review_delete_get = function(req, res, next) {
    if (res.locals.currentUser) {
    Review.findById(req.params.rid)
        .populate('product')
        .exec((err, review) => {
        if (err) {return next(err)};
        if (review === null) {
            res.redirect('/products/' + req.params.id + '/reviews/' + 
	    req.params.rid);
            return;
	}
        res.render('review_delete', { title: 'Delete Review',
            review: review });
        });
    } else 
	res.redirect('/auth/login');
}

exports.review_delete_post = function(req, res, next) {
    Review.findById(req.params.rid)
	.exec( (err, review) => {
	    if (err) {return next(err);}
	
            Review.findByIdAndRemove(req.body.reviewId,
		function deleteReview(err) {
	          if (err) {return next(err);}
                  res.redirect('/products/' + req.params.id + '/reviews');
	    });
	});
}

