const bcrypt = require('bcryptjs');
const moongoose = require('./mongodb-connect');




let userSchema = moongoose.Schema({
    uid: {
        type: Number,
        required: true,
        unique: true
    },
    nombre:{
       type: String,
       required:true
    } ,
    apellido:{
        type: String,
        required:true
     },
    correo: {
        type: String,
        required:true,
        unique:true
     },
    pass: {
        type: String,
        required:true
     },
    sexo: {
        type: String,
        enum:['H', 'M'],
        required:true
     },
     url: {
         type:String,
         required: false
     },
     rol: {
        type: String,
        enum:['GUEST', 'USER', 'ADMIN'],
        required:false
     }  
})



userSchema.statics.obtenerUsuarios = function (skip,limit){
    return User.find({},{ _id:0, correo:1, nombre:1, url:1})
                .skip(skip)
                .limit(limit);
}

userSchema.statics.obtenerUsuarioPorCorreo = function(correo){
    return User.findOne({correo})
}

// userSchema.methods.guardar= ()=>{

// }

userSchema.statics.crearUsuario = ( userData ) => {
    console.log(userData);
    userData.uid = Date.now();

    userData.pass = bcrypt.hashSync(userData.pass , 8)
    console.log("hash", userData.pass);

    console.log(userData.uid);
    if(userData.url==undefined || userData.url==''){
        userData.url = `https://randomuser.me/api/portraits/${userData.sexo=="H"?"men":"women"}/${userData.uid % 100}.jpg`
    }
    console.log("userData", userData);
    userData.rol = "USER";
    let newUser = User(userData);
    return newUser.save()
}

userSchema.methods.actualizarUsuario = function(datos){
    return User.findOneAndUpdate(
        {_id:this._id},
        {$set:datos},
        {new:true,
         useFindAndModify:false
        }
        )
}

let User = moongoose.model('users',userSchema);

function getUsers(cbOk, cbErr){
    User.find({},(err,docs)=>{
        if(docs){
            console.log(docs);
            cbOk(docs)
        }
    
        if(err){
            console.log(err);
            cbErr(err)
        }
    })
 
}

async function getUsersAsync(){
    let docs = [];
    try {
        docs = await User.find({});
        console.log(docs);
    } catch (error) {
        console.log("error", error);
    }
   
    
    return docs;
 
}





function crearUsuario(user){
    
    let userMongo = User(user);
    userMongo.save()
            .then ( (resp)=> console.log(resp))
            .catch((err)=> console.log("ocurrió un error", err))
}

//let newUser = {uid:26, nombre: "testM3", apellido: "appM3", correo: "a@a", password:"abc", sexo: "M" };
//crearUsuario(newUser);


User.getUsers = getUsers;
User.getUsersAsync = getUsersAsync;

module.exports = User;