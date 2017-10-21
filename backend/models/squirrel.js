var mongoose = require('mongoose');

var SquirrelSchema = new mongoose.Schema({
    name: String,
    favnut: String
},
    // { collection: 'custom_squirrel' } // for alt name
    );

// module.exports = mongoose.model('Squirrel', SquirrelSchema, 'custom_squirrel'); diff way to force alt name
module.exports = mongoose.model('Squirrel', SquirrelSchema);