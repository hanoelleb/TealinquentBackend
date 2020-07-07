var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema(
  {
      name: {type: String, required: true, minlength: 1, maxlength: 100},
      description: {type: String, required: true};
      price: {type: Number, required: true},
      stock: {type: Number, required: true},
      categories: [{type: Schema.Types.ObjectId, ref: 'Category'}],
      reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]
  }
);

ProductSchema
.virtual('url')
.get( function() {
    return '/products/' + this._id;
});
