var mongoose = require('mongoose');

var recipe = mongoose.Schema({
    name    : String,
    message : String
});

/* export module */
module.exports = mongoose.model( 'recipe', recipe );