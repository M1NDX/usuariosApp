const express = require("express");
const usersRouter = require("./routes/users");
const loginRouter = require("./routes/login");

const app =express();
const port = process.env.PORT ||  3001;

function testMiddleware(req,res,next){
    
    if( req.body.nombre){
        next();
    }else{
        res.status(400).send({error: "falta nombre"})
    }
}

//para que en el post puedas tener el body como req.body
app.use(express.json())


app.use('/api/users',usersRouter);
app.use('/api',loginRouter);

// app.get('/',(req,res)=>{
//     res.send("Hola");
// })

app.use('/', express.static(__dirname+'/public'))
app.post('/api/user', testMiddleware, (req,res)=>{
    res.send();
})

app.listen(port, () => console.log("corriendo"));