const jwt = require('jsonwebtoken')
const User = require('../db/User')

function validarToken(req,res, next){
   const token =  req.get('x-auth');
   if(token){
        jwt.verify(token,'claveMuySecreta',function (err, payload){
            if(err){
                res.status(401).send({error: "token inválido"})
            }else{
                console.log(payload);
                req.correo = payload.correo;
                next();
            }
        } )
   }else{
       res.status(401).send({error: "no está autorizado"})
   }
}

function validarRol (req,res, next){
    const correo = req.correo;

    const user = User.obtenerUsuarioPorCorreo(correo);
    if(user & user.rol == "ADMIN"){
        next();    
    }else{
        res.status(401).send({error: "no está autorizado"})
    }
    


}



module.exports = {validarToken, validarRol};