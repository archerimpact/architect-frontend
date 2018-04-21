var express = require('express');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var requirejs = require('require')

var app = express();
var port = process.env.PORT || 4567;

app.use(express.static(__dirname + '/public'));
app.use(methodOverride());
app.use(bodyParser.json())
app.listen(port);
    
app.get("/", function(req, res) {
  res.redirect("/index.html");
});

requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../app'
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['app/main']);