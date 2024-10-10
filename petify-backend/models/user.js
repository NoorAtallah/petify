const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String }, // Add profile picture URL (optional)
  role: { 
    type: String, 
    enum: ['user', 'vet'], 
    default: 'user' 
  }, 
   isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('User', UserSchema);
