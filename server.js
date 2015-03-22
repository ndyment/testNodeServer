// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var Customer = require('./app/models/customer');
var Offer    = require('./app/models/offers');


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
newCustomer.storeName = "Sobeys"; //Sobeys, Starbucks, Shoppers

//create store objects
var latestSobeysCustomer = new Object();
var latestStarbucksCustomer = new Object();
var latestShoppersCustomer = new Object();

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
		newCustomer.storeName = req.body.storeName;
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
		
		//set customer in context of the store
		if (newCustomer.storeName == "Sobeys") {
			console.log("Customer is at Sobeys");
			
			latestSobeysCustomer.firstName = newCustomer.firstName;
			latestSobeysCustomer.isLoyal = newCustomer.isLoyal;

		} else if (newCustomer.storeName == "Starbucks") {
			console.log("Customer is at Starbucks");
			
			latestStarbucksCustomer.firstName = newCustomer.firstName;
			latestStarbucksCustomer.isLoyal = newCustomer.isLoyal;

		} else if (newCustomer.storeName == "Shoppers"){
			console.log("Customer is at Shoppers");
			
			latestShoppersCustomer.firstName = newCustomer.firstName;
			latestShoppersCustomer.isLoyal = newCustomer.isLoyal;
		} else {
			console.log("Store not found - "+newCustomer.storeName+" was detected.");
		}
    })
	
	.get(function(req, res) {
	    var storename = req.param('storename')
		console.log('Get2');
		console.log(req.body);
        	Offer.find({offer:storename},function(err, offers) {
	            if (err)
	                res.send(err);
					
			res.json(offers);
		  
		});
    });
    
//setup the webserver
app.get('/', function (req, res){
	//debug on base URL
	console.log("Starbucks");
	console.log(latestStarbucksCustomer);
	console.log("Shoppers");
	console.log(latestShoppersCustomer);
	console.log("Sobeys");
	console.log(latestSobeysCustomer);
	
	//reset variables
	latestSobeysCustomer = new Object();
	latestStarbucksCustomer = new Object();
	latestShoppersCustomer = new Object();


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
	if (latestStarbucksCustomer.firstName){
		
		if (1==latestStarbucksCustomer.isLoyal){
			loyaltyText = "Welcome back, " + latestStarbucksCustomer.firstName + ". We appreciate your loyalty!";
		}else{
			loyaltyText = "Hi, " + latestStarbucksCustomer.firstName + ". Would you like to sign-up for our loyalty program? Click here to sign up";
		}
		res.render('./starbucks.html', {name: latestStarbucksCustomer.firstName, text: loyaltyText});
	}else{
		res.render('./starbucks.html', {name: "Nobody", text: "Turn on your bluetooth so we can talk!"});
	}
  });
	
//setup shoppers
app.get('/shoppers', function (req, res){
	
    // use RENDER instead of SENDFILE
	if (latestShoppersCustomer.firstName){
		if (1==latestShoppersCustomer.isLoyal){
			loyaltyText = "Welcome back, " + latestShoppersCustomer.firstName + ". We appreciate your loyalty!";
		}else{
			loyaltyText = "Hi, " + latestShoppersCustomer.firstName + ". Would you like to sign-up for our loyalty program? Click here to sign up";
		}
		res.render('./shoppers.html', {name: latestShoppersCustomer.firstName, text: loyaltyText});
	}else{
		res.render('./shoppers.html', {name: "Nobody", text: "Turn on your bluetooth so we can talk!"});
	}
  });

//setup sobeys  
app.get('/sobeys', function (req, res){

    // use RENDER instead of SENDFILE
	if (latestSobeysCustomer.firstName){
		if (1==latestSobeysCustomer.isLoyal){
			loyaltyText = "Welcome back, " + latestSobeysCustomer.firstName + ". We appreciate your loyalty!";
		}else{
			loyaltyText = "Hi, " + latestSobeysCustomer.firstName + ". Would you like to sign-up for our loyalty program? Click here to sign up";
		}
		res.render('./sobeys.html', {name: latestSobeysCustomer.firstName, text: loyaltyText});
	}else{
		res.render('./sobeys.html', {name: "Nobody", text: "Turn on your bluetooth so we can talk!"});
	}
  });
  
//add test for autoloading body

app.get('/shoppers-body', function (req, res){
	res.render('./shoppers-body.ejs');
  });
  
  app.get('./starbucks-body', function (req, res){
	res.render('./starbucks-body.ejs');
  });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
