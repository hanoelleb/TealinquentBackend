var express = require('express');
var router = express.Router();

var multer  = require('multer')
var upload = multer({ dest: './public/data/uploads/' })

var productController = require('../controllers/productController');
var reviewController = require('../controllers/reviewController');

//PRODUCTS

router.get('/', productController.product_list);

router.get('/create', productController.product_create_get);

router.post('/create', upload.single('img'), 
	productController.product_create_post);

router.get('/update/:id', productController.product_update_get);

router.post('/update/:id', productController.product_update_post);

router.get('/delete/:id', productController.product_delete_get);

router.post('/delete/:id', productController.product_delete_post);

router.get('/:id/picture', productController.product_image);

router.get('/:id', productController.product_detail);

//REVIEWS

router.get('/:id/reviews', reviewController.review_list);

router.get('/:id/reviews/create', reviewController.review_create_get);

router.post('/:id/reviews/create', reviewController.review_create_post);

router.get('/:id/reviews/:rid/update', reviewController.review_update_get);

router.post('/:id/reviews/:rid/update', reviewController.review_update_post);

router.get('/:id/reviews/:rid/delete', reviewController.review_delete_get);

router.post('/:id/reviews/:rid/delete', reviewController.review_delete_post);

router.get('/:id/reviews/:rid', reviewController.review_detail);

module.exports = router;
