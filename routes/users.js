const router = require("express").Router();
const User = require('../db/User');
const auth = require("../middlewares/auth");
//const {validarToken} = require("../middlewares/auth");


router.get('/', auth.validarToken,  async (req,res)=>{
    console.log("entra a get /api/users");
    console.log(req.query);
    console.log("usuario logueado", req.correo);
    let skip = Number(req.query.skip) || 0;
    let limit = Number(req.query.limit) || 4;

    //let docs = await User.getUsersAsync();
    let docs = await User.obtenerUsuarios(skip, limit);
    console.log(docs);
    res.json(docs);
    

    // User.getUsers((docs)=>{
    //     console.log("obteniendo docs", docs);
    //     res.json(docs);
    // }, (err)=>{
    //     res.status(400).json({error: err})
    // })

})

//  /users/123?nombre=pepe
router.get('/:correo', async (req,res)=>{
    let doc = await User.obtenerUsuarioPorCorreo(req.params.correo)

    res.send(doc);
})

router.post('/',validar, async (req,res)=>{
    console.log(req.body);
    let doc = await User.obtenerUsuarioPorCorreo(req.body.correo)
    console.log("doc por correo", doc);
    if(doc){
        res.status(400).send({error: "usuario ya existe"})
    }else{
        try{
            let usr = await User.crearUsuario(req.body);
            res.status(201).send(usr)
        }catch(err){
            res.status(400).send({error: err})
        }
    }

})

router.put('/:correo', validar, async (req,res)=>{
    if(req.params.correo == req.body.correo){
        let doc;
        try{
            doc = await User.obtenerUsuarioPorCorreo(req.params.correo);
            if(doc){
                await doc.actualizarUsuario(req.body);
                res.send();
            }
        }catch(err){
            res.status(404).send({error: err})
        }
    }else{
        res.status(400).send({error: "no se puede cambiar el correo"})
    }
})

function validar(req,res, next){
     let {correo, nombre, apellido, pass, sexo} = req.body;
     if(correo && nombre && apellido && pass && sexo){
         next()
         return;
     }

     res.status(400).send({error: "Falta información"})

}




//...

module.exports = router;