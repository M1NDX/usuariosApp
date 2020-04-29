const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../db/User');


router.post('/login',async (req,res)=>{
    let {correo, pass} = req.body;

    if(correo && pass){
        let user = await User.obtenerUsuarioPorCorreo(correo);
        if(user){
            if(bcrypt.compareSync(pass, user.pass)){
                let token = jwt.sign({correo:user.correo},"claveMuySecreta",{ expiresIn: '1h' })
                res.send({token});
            }else{
                res.status(401).send({error: "verifique usuario y contraseña"})
            }
        }else{
            res.status(404).send({error: "usuario no existe"})
        }
    }else{
        res.status(400).send({error: "faltan datos"})
    }

})



module.exports = router;