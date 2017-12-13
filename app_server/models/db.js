var mongoose = require( 'mongoose' );
require('./interface');
var dbURI = "mongodb://anberns:anmT8gOclnVr1Ggf@cluster0-shard-00-00-bx1le.mongodb.net:27017,cluster0-shard-00-01-bx1le.mongodb.net:27017,cluster0-shard-00-02-bx1le.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
mongoose.connect(dbURI, { useMongoClient: true});
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error ' + err);
});
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});
gracefulShutdown = function (msg, callback) { 
    mongoose.connection.close(function () {   
        console.log('Mongoose disconnected through ' + msg);   
        callback(); 
    });
};
// For nodemon restarts
process.once('SIGUSR2', function () { 
    gracefulShutdown('nodemon restart', function () {    
        process.kill(process.pid, 'SIGUSR2');
    }); 
});
// For app termination
process.on('SIGINT', function() {  
    gracefulShutdown('app termination', function () {    
        process.exit(0);
    }); 
});
// For Heroku app termination
process.on('SIGTERM', function() {  
    gracefulShutdown('Heroku app shutdown', function () {    
        process.exit(0);
    }); 
});