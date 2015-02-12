// server.js

// BASE SETUPte
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var Customer = require('./app/models/customer');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://tj:nopass@ds031691.mongolab.com:31691/testdb1'); 

/*
var NewCustomer = new Object();
//probably don't need this - but I'm old school
newCustomer.firstName = "init";
newCustomer.lastName = "init";
newCustomer.isLoyal = 0;
newCustomer.waletID = "init";
*/
var newCustomer = new Customer();
//add some stuff incase the website launches before we get a customer
//i'm sure there's a better way to do this
newCustomer.firstName = "init";
newCustomer.lastName = "init";
newCustomer.isLoyal = 0;
newCustomer.waletID = "init";


var loyaltyText = "sample loyalty text"; //init the loyalty text

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 8080;       

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();          


// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Recieving data from the client.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	console.log('Get1');
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// on routes that end in /customers
// ----------------------------------------------------
router.route('/customers')

    .post(function(req, res) {
        console.log(req.body);
		newCustomer.firstName = req.body.firstName; 
		newCustomer.lastName = req.body.lastName; 
		newCustomer.walletID = req.body.walletID; 
		newCustomer.isLoyal = req.body.isLoyal;
		console.log("Hello " + newCustomer.firstName + ". And welcome");
		
		//write to mongoDB
		        // save the bear and check for errors
        newCustomer.save(function(err) {
            if (err){
                res.send(err);
				
			}
			console.log('Customer ' + newCustomer.firstName + ' created!');
            res.json({ message: 'Customer created!' });
        });        
    })
	
	.get(function(req, res) {
		console.log('Get2');
		console.log(req.body);
        Offer.find(function(err, offers) {
            if (err)
                res.send(err);

            res.json(offers);
        });
    });
	
//setup the webserver
app.get('/', function (req, res){

    // use RENDER instead of SENDFILE
	if (1==newCustomer.isLoyal){
		loyaltyText = "Welcome back, " + newCustomer.firstName + ". We appreciate your loyalty!";
	}else{
		loyaltyText = "Hi, " + newCustomer.firstName + ". Would you like to sign-up for our loyalty program? Click here to sign up";
	}
    res.render('./index.html', {name: newCustomer.firstName, text: loyaltyText});
  });

//starbucks  
app.get('/starbucks', function (req, res){

    // use RENDER instead of SENDFILE
	if (1==newCustomer.isLoyal){
		loyaltyText = "Welcome back, " + newCustomer.firstName + ". We appreciate your loyalty!";
	}else{
		loyaltyText = "Hi, " + newCustomer.firstName + ". Would you like to sign-up for our loyalty program? Click here to sign up";
	}
    res.render('./starbucks.html', {name: newCustomer.firstName, text: loyaltyText});
  });
	
//setup shoppers
app.get('/shoppers', function (req, res){

    // use RENDER instead of SENDFILE
	if (1==newCustomer.isLoyal){
		loyaltyText = "Welcome back, " + newCustomer.firstName + ". We appreciate your loyalty!";
	}else{
		loyaltyText = "Hi, " + newCustomer.firstName + ". Would you like to sign-up for our loyalty program? Click here to sign up";
	}
    res.render('./shoppers.html', {name: newCustomer.firstName, text: loyaltyText});
  });

//setup sobeys  
app.get('/sobeys', function (req, res){

    // use RENDER instead of SENDFILE
	if (1==newCustomer.isLoyal){
		loyaltyText = "Welcome back, " + newCustomer.firstName + ". We appreciate your loyalty!";
	}else{
		loyaltyText = "Hi, " + newCustomer.firstName + ". Would you like to sign-up for our loyalty program? Click here to sign up";
	}
    res.render('./sobeys.html', {name: newCustomer.firstName, text: loyaltyText});
  });
	



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);