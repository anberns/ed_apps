var mongoose = require('mongoose');

// subschemas defined before main schema
var studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastInit: { type: String, required: true },
    sounds: [String],
    sightWords: [String]
});

var userSchema = new mongoose.Schema({ 
    username: { type: String, required: true},
    password: { type: String, required: true},
    students: [studentSchema]
});

//create model
mongoose.model('User', userSchema); 