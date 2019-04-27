var mongoose = require('mongoose');

var account = mongoose.Schema({
    account : String,
    password    : String,
    token   : String
});

/* export module */
module.exports = mongoose.model( 'account', account );