const mongoose = require('mongoose');

// subschemas defined before main schema
const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastInit: { type: String, required: true },
    sounds : {
        shortVowels : {
            all : false,
            a : false,
            e : false,
            i : false,
            o : false,
            u : false 
        },
        digraphs : {
            all : false,
            sh : false,
            ch : false,
            th : false,
            wh : false,
            ck : false 
        },
        longVowels : {
            all : false,
            a : false,
            e : false,
            i : false,
            o : false,
            u : false 
        },
        vowelTeams : {
            all : false,
            ea : false,
            ee : false,
            ai : false,
            ei : false,
            ie : false, 
            oo : false,
            ou : false,
            au : false,
            ui : false,
            ue : false
        },
        diphs : {
            all : false,
            ow : false,
            oy : false,
            ey : false,
            ew : false,
            ay : false, 
            aw : false
        },
        rCon : {
            all : false,
            ar : false,
            er : false,
            ir : false,
            or : false,
            ur : false 
        }
    },
    sightWords: [String]
}, {_id : true });

const userSchema = new mongoose.Schema({ 
    username: { type: String, required: true},
    password: { type: String, required: true},
    students: [studentSchema]
});

//create model
mongoose.model('User', userSchema); 
