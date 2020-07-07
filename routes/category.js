var express = require('express');
var router = express.Router();

var categoryController = require('../controllers/categoryController');

router.get('/', categoryController.category_list);

router.get('/:id', categoryController.category_detail);

router.get('/create', categoryController.category_create_get);

router.post('/create', categoryController.category_create_post);

router.get('/update', categoryController.category_update_get);

router.post('/update', categoryController.category_update_post);

router.get('/delete', categoryController.category_delete_get);

router.post('/delete', categoryController.category_delete_post);

module.exports = router;
