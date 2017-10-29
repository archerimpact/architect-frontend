### Posting to a model in Mongo:
# In app.js:
app.post('/squirrels', function(req, res) {
    var req_pretty = JSON.stringify(req.body, null, 2);
    // data = {};
    // data.name = req.body.name;
    // data.favnut = req.body.favnut;
    var newSquirrel = new Squirrel(req.body);

    newSquirrel.save(function (err) {
        if (err) {
            res.send('error: squirrel not saved!');
        } else {
            res.send(`saved ${req_pretty}, great success!`);
            // res.send(res.json(req.body));
        }
    });
});

app.post('/findsquirrel', function (req, res) {
    // var coll = req.body.collection; // hmm not easy to specify a collection dynamically using mongoose, mongodb simpler
    // https://stackoverflow.com/questions/24035872/return-results-mongoose-in-find-query-to-a-variable
    // shows how to do via .exec() or promises.
    query = Squirrel.find().where(req.body.field, req.body.search_term);
    // res.send(result);
    query.exec(function (err, squirrels) {
        if (err) {
            res.send(`error!: ${err}`);
        } else {
            res.send(squirrels);
        }
    })
});

---

# In models/squirrel.js:
var mongoose = require('mongoose');

var SquirrelSchema = new mongoose.Schema({
    name: String,
    favnut: String
},
    // { collection: 'custom_squirrel' } // for alt name
    );

// module.exports = mongoose.model('Squirrel', SquirrelSchema, 'custom_squirrel'); diff way to force alt name
module.exports = mongoose.model('Squirrel', SquirrelSchema);

---
---


