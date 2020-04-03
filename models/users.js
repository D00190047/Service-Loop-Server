const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  users_full_name: {
    type: String,
    required: true
  },
  user_email: {
    type: String,
    required: true
  },
  user_phone_number:
  {
    type: String,
    required: true
  },
  user_tutor:
  {
    type: Boolean,
    required: true
  },
  user_college: {
    type: String,
    required: true
  },
  past_ratings: {
    type: Array
  },
  tutor_rating: {
    type: Number,
    default: 0
  },
  total_ratings: {
    type: Number,
    default: 0
  },
  user_modules: {
    type: Array
  },
  user_password: {
    type: String
  },
  user_digital_certificate_path:
  {
    type: String
  },
  user_digital_certificate_password:
  {
    type: String
  },
  user_avatar:
  {
    type: String
  },
  user_blockchain_api_token: {
    type: String
  },
  user_blockchain_id: {
    type: String
  },
  user_blockchain_identity_name: {
    type: String
  }
});

// UserSchema.methods.get_user_id = function get_user_id (email, cb) {
//       this.find({ email: email }).select('_id').exec(cb);
//   }

const User = mongoose.model("Users", UserSchema);
module.exports = User;