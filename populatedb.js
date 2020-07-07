#! /usr/bin/env node
ar userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')

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

function productCreate() {

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

function reviewCreate() {

}
