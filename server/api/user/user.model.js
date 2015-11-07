'use strict';

var mongoose = require('mongoose'),
// TODO: point to another MongoDB server in future apps
//   mongooseConfig = require("../../config/mongoose"),
   Schema = mongoose.Schema,
   crypto = require('crypto'),
   timestamps = require('mongoose-timestamp'),
   mongooseTypes = require("mongoose-types"),
   SEQ_ID = require("../../config/SEQ_ID");

mongooseTypes.loadTypes(mongoose);

// TODO: point to another MongoDB server in future apps
// var connection = mongooseConfig.use('local');
var connection = mongoose;

var Email = mongoose.SchemaTypes.Email;
var URL = mongoose.SchemaTypes.Url;

var UserSchema = new Schema({
   username: {type: String, lowercase: true},
   firstName: {type: String},
   lastName: {type: String},
   email: {type: Email, lowercase: true},
   phoneNumbers: [
      {type: String, value: String}
   ],
   notifySMS: String,
   addresses: [{
      type: String,
      address1: String,
      address2: String,
      city: String,
      province: String,
      postCode: String,
      country: String
   }],
   companySEQ: String,
   title: String,
   role: {
      type: String,
      default: 'user'
   },
   background: String,
   language: String,
   avatar: String,
   photos: [
      {type: String, size: String, url: URL}
   ],
   lastLogin: {type: Date},
   createdBy: {type: String},
   hashedPassword: {type: String},
   provider: {type: String},
   salt: {type: String}
});

UserSchema.plugin(SEQ_ID.plugin, {counterID: 'core', prefix: 'US'});

UserSchema.plugin(timestamps, {
   createdAt: 'tsCreate',
   updatedAt: 'tsUpdate'
});

/**
 * Virtuals
 */
UserSchema
   .virtual('password')
   .set(function (password) {
      this._password = password;
      this.salt = this.makeSalt();
      this.hashedPassword = this.encryptPassword(password);
   })
   .get(function () {
      return this._password;
   });

// Public profile information
UserSchema
   .virtual('profile')
   .get(function () {
      return {
         'firstName': this.firstName,
         'lastName': this.lastName,
         'role': this.role
      };
   });

// Non-sensitive info we'll be putting in the token
UserSchema
   .virtual('token')
   .get(function () {
      return {
         '_id': this._id,
         'role': this.role
      };
   });

/**
 * Validations
 */

// Validate empty email
UserSchema
   .path('email')
   .validate(function (email) {
      return email.length;
   }, 'Email cannot be blank');

// Validate empty password
UserSchema
   .path('hashedPassword')
   .validate(function (hashedPassword) {
      return hashedPassword.length;
   }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
   .path('email')
   .validate(function (value, respond) {
      var self = this;
      this.constructor.findOne({email: value}, function (err, user) {
         if (err) throw err;
         if (user) {
            if (self.id === user.id) return respond(true);
            return respond(false);
         }
         respond(true);
      });
   }, 'The specified email address is already in use.');

var validatePresenceOf = function (value) {
   return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
   .pre('save', function (next) {
      if (!this.isNew) return next();
      if (!validatePresenceOf(this.hashedPassword))
         next(new Error('Invalid password'));
      else
         next();
   });

/**
 * Methods
 */
UserSchema.methods = {
   /**
    * Authenticate - check if the passwords are the same
    *
    * @param {String} plainText
    * @return {Boolean}
    * @api public
    */
   authenticate: function (plainText) {
      return this.encryptPassword(plainText) === this.hashedPassword;
   },

   /**
    * Make salt
    *
    * @return {String}
    * @api public
    */
   makeSalt: function () {
      return crypto.randomBytes(16).toString('base64');
   },

   /**
    * Encrypt password
    *
    * @param {String} password
    * @return {String}
    * @api public
    */
   encryptPassword: function (password) {
      if (!password || !this.salt) return '';
      var salt = new Buffer(this.salt, 'base64');
      return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
   }
};

// TODO: point to another MongoDB server in future apps

module.exports = connection.model('User', UserSchema);
