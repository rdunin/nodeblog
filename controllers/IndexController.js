var rtg   = require("url").parse('redis://pub-redis-14604.eu-west-1-2.1.ec2.garantiadata.com:14604/');
var redis = require("redis").createClient( 14604, 'pub-redis-14604.eu-west-1-2.1.ec2.garantiadata.com');
redis.auth('5349449');

redis.on("error", function(err) {
    console.log("Redis Err: " + err);
});
module.exports = function(app) {

    app.all("*", function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', 'http://techface.koding.io:3000');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    app.get("/", function(req, res) {
        res.render("index");
    });

    app.get("/redis/set/:key/:val", function(req, res, next) {
        var key = req.params.key;
        var val = req.params.val;
        redis.set(key, val, redis.print);
        next("Key value pair added!");
    });

    app.get("/redis/get/:key", function(req, res, next) {
        var key = req.params.key;
        redis.get(key, function(err, data) {
            next(key + "=>" + data);
        })
    })

}