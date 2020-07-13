var async = require('async');
var Category = require('../models/category');
var Product = require('../models/product');
const validator = require('express-validator');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


exports.category_list = function(req, res, next) {
    Category.find()
	.sort([['name', 'ascending']])
	.exec(function (err, cat_list) {
	    if (err) {return next(err);}
	    res.render('categories', {title: 'All categories', 
		cat_list: cat_list});
	});
}

exports.category_detail = function(req, res, next) {
    async.parallel({
       category: function(callback) {
           Category.findById(req.params.id)
               .exec(callback);
       },
       products: function(callback) {
	   Product.find({'categories' : req.params.id})
	       .exec(callback);
       }
    }, function(err, results) {
        if (err) { return next(err); };
        if (results.category == null) {
	    var err = new Error('Category not found');
            err.status = 404;
	    return next(err);
	}
	res.render('category_detail', { title: 'Category', 
            category: results.category, products: results.products });
    });
}

exports.category_create_get = function(req, res, next) {
    res.render('category_form', {title: 'Add category'});
}

exports.category_create_post = [
    body('name', 'Category name is required').trim().isLength({min: 1}),

    sanitizeBody('name').escape(),

    (req, res, next) => {
	const errors = validator.validationResult(req);
	var category = new Category({name: req.body.name});

	if (!errors.isEmpty()){
	    res.render('category_form', {title: 'Add category', 
		 category: category});
	    return;
	} else {
	    Category.findOne({'name': req.body.name})
		.exec(function (err, found_cat) {
		    if (err){return next(err);}
		
		if (found_cat) { 
		    console.log('redirect');
		    res.redirect(found_cat.url); }
		else {
		    console.log('saving');
		    category.save(function(err) {
		        if(err){return next(err)}
			res.redirect(category.url);
		    });
		 }
	    });
	}
    }
]

exports.category_update_get = function(req, res, next) {
    Category.findById(req.params.id)
        .exec( function(err, category) {
	    if (err) { return next(err); }
            res.render('category_form', {title: 'Update category', 
		category: category});
	});
}

exports.category_update_post = [
    body('name', 'Name is required').trim().isLength({min: 1}),
    sanitizeBody('name').escape(),
    
    (req, res, next) => {
        const errors = validator.validationResult(req);
	
	var category = new Category(
	  {
	      name: req.body.name,
              _id: req.params.id,
	  }
	);

	if (!errors.isEmpty()){
	    res.render('category_form', {title: 'Update category',
		category: category});
            return;
	}
	else {
	    Category.findByIdAndUpdate(req.params.id, category, {},
		function(err, thecategory) {
		    if (err) { return next(err);}
	            res.redirect(thecategory.url);
		});
	}
    }
]

exports.category_delete_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: category delete get');
}

exports.category_delete_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: category delete post');
}

