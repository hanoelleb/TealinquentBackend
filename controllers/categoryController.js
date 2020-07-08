var async = require('async');
var Category = require('../models/category');

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
    res.send('NOT IMPLEMENTED: category detail');
}

exports.category_create_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: category create get');
}

exports.category_create_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: category create post');
}

exports.category_update_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: category update get');
}

exports.category_update_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: category update post');
}

exports.category_delete_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: category delete get');
}

exports.category_delete_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: category delete post');
}

