var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReviewSchema = new Schema(
  {
      name: {type: String, required: true, minlength: 3, maxlength: 100},
      rating: {type: Number},
      details: {type: String},
      product: {type: Schema.Types.ObjectId, ref: 'Product', required: true}
  }
)

ReviewSchema.methods.url = function(pid) {
       return 'products/' + pid + '/reviews/' + this._id;
   };

module.exports = mongoose.model('Review', ReviewSchema);
