var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var OfferSchema  = new Schema({
    offer: String,
	offerdescription: String
});

module.exports = mongoose.model('offers', OfferSchema);