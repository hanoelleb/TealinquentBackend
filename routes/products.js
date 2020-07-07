var express = require('express');
var router = express.Router();

var productController = require('../controllers/productController');

router.get('/', productController.product_list);

router.get('/:id', productController.product_detail);

router.get('/create', productController.product_create_get);

router.post('/create', productController.product_create_post);

router.get('/update/:id', productController.product_update_get);

router.post('/update/:id', productController.product_update_post);

router.get('/delete/:id', productController.product_delete_get);

router.post('/delete/:id', productController.product_delete_post);

module.exports = router;
