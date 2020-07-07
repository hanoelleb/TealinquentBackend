
exports.product_list = function(req, res, next) {
    res.render('products', {title: 'All products'});
};

exports.product_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: product detail');
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
