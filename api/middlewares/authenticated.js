'use stricit'
var jwt = require('jwt-simple');
var moment= require('moment');
var secret = 'clave_secreta_curso';

exports.ensureAuth = function(req,res,next){
    if(!req.headers.authorization){
        return res.status(403).send({message: 'la peticion no tiene la cabecera de la autenticacion'});
    }
    var token = req.headers.authorization.replace(/['"]+/g, '');
    try{
        var payload = jwt.decode(token, secret);
        if(payload.exp <= moment().unix()){
            return res.status(401).send({message: 'token expirado'});
        }
    }catch(ex){
        // console.log(ex);
        return res.status(404).send({message: 'token invalido'})
    }
    req.user = payload;
    next();
};