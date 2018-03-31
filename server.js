var express = require('express');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');

var app = express();
var port = 4567;

app.use(express.static(__dirname + '/public'));
app.use(methodOverride());
app.use(bodyParser.json())
app.listen(port);
    
app.get("/", function(req, res) {
  res.redirect("/index.html");
});

app.get("/alice", function(req, res) {
  res.redirect("/alice.html");
});

app.get("/createdata", function(req, res) {
  res.redirect("/createdata.html");
});

