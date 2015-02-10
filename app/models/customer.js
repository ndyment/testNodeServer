var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CustomerSchema  = new Schema({
    firstName: String,
	lastName: String,
	isLoyal: Boolean,
	walletID: String,
	storeName : String
});

module.exports = mongoose.model('Customer', CustomerSchema);