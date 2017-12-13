var mongoose = require('mongoose');

var interfaceSchema = new mongoose.Schema({ 
    username: { type: String, required: true},
    password: { type: String, required: true},
    students: [Number]
});
