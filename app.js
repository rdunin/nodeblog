var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var config = require('config');
var utils = require('./lib/utils');
var mongooseConnection = utils.connectToDatabase(mongoose, config.db);
var passport = require('passport');
var session = require('express-session');
var redis = require('redis');
var sessionStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');

var app = express();

app.set("port", process.env.PORT || 3000);

//var redisClient = redis.createClient( 14604, 'pub-redis-14604.eu-west-1-2.1.ec2.garantiadata.com', 
//    { auth_pass: '5349449' } );

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev') ); // Log every request to console
app.use(bodyParser()) ; // Pull information from POST request
app.use(methodOverride() ); // Simulate DELETE and PUT
app.use(cookieParser());
app.use(session({
    secret: 'hrelmdsksksls',
    cookie: { secure: false, maxAge:86400000 },
    store: new sessionStore({ host: 'pub-redis-14604.eu-west-1-2.1.ec2.garantiadata.com', port: '14604', pass: '5349449'}),
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(require("./lib/views"));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {layout: true});

require("./controllers/IndexController")(app);

require("./models/Article")(mongooseConnection);
require("./models/User")(mongooseConnection);
require("./models/Comment")(mongooseConnection);

require("./lib/passport")();

require("./controllers/IndexController")(app, mongooseConnection);
require("./controllers/ArticleController")(app, mongooseConnection);
require("./controllers/CommentController")(app, mongooseConnection);
require("./controllers/UserController")(app, mongooseConnection);

app.listen(app.get("port"), function(){
    console.log("Express server: " + app.get('port')); 
});