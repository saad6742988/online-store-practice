const mongoose =require('mongoose')
const crypto = require("node:crypto")
const { Schema } = mongoose;
const uuidv1 = require("uuid/v1")
//const crypto = require('node:crypto');

const userSchema = new Schema({
  name: { type: String, required: true, maxlength: 32, trim: true },
  lastName: { type: String, maxlength: 32, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  userInfo: { type: String, trim: true },
  encrtyPassword: { type: String, required: true },
  salt: String,
  role: { type: Number, default: 0 },
  purchases: { type: Array, default: [] },
},{timestamps:true});

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encrtyPassword = this.securePassword(password);
  })
  .get(function(){
    return this._password
  });
userSchema.methods = {
  securePassword: function (plainPass) {
    if (!plainPass) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPass)
        .digest("hex");
    } catch {
      return "";
    }
  },
  authenticate:function(plainPass){
    return this.securePassword(plainPass)===this.encrtyPassword
  }
};

module.exports = mongoose.model("User", userSchema);
