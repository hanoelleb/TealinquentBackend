var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//status:
//0: Admin
//1: Shopper

//require('dotenv').config();
//var mongoDB2 = process.env.DB_URL_USER;
//mongoose.createConnection(mongoDB2);

var UserSchema = new Schema(
  {
      first_name: {type: String, required: true, minlength: 1, maxlength: 20},
      family_name: {type: String, required: true, minlength: 1, maxlength: 20},
      username: {type: String, required: true, minlength: 5},
      password: {type: String, required: true},
      member_status: {type: Number, required: true},
  }
)

module.exports = mongoose.model('User', UserSchema);
