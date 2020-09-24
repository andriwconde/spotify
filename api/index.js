'use strict'
var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
var app = require('./app');
var port = process.env.PORT|| 3977;

mongoose.connect('mongodb://localhost:27017/spotify', {useNewUrlParser:true, useUnifiedTopology: true}, (err, res) => {
    if(err){
        throw err;
    }else{
        console.log('La conexion a la base de datos fue exitosa');
        
        app.listen(port, function(){
            console.log('Servidor API Rest de musica escuchando en http://localhost:'+ port);
        })
    }
});