// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST and setup the HTML rendering
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//create the object for the messages
var customer = new Object();      // create a new instance of the customer
var loyaltyText = "sample loyalty text"; //init the loyalty text
customer.name = "init";
customer.isLoyal = 0;

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

//do something on any request
router.use(function(req, res, next) {
    // do logging
	console.log("Stuff is happening");
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

app.get('/', function (req, res){

    // use RENDER instead of SENDFILE
	if (1==customer.isLoyal){
		loyaltyText = "Welcome back, " + customer.name + ". We appreciate your loyalty!";
	}else{
		loyaltyText = "Hi, " + customer.name + ". Would you like to sign-up for our loyalty program? Click here to sign up";
	}
    res.render('./Homepage.html', {name: customer.name, text: loyaltyText});
  });

router.route('/enter')

    // send customer data (accessed at POST http://localhost:8080/api/enter)
    .post(function(req, res) {
        customer.name = req.body.name;  // set the customer name (comes from the request)
		customer.isLoyal = req.body.isLoyal;
		res.json({ message: 'Customer: ' + customer.name + 'isLoyal?' + customer.isLoyal})
        
    });

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);