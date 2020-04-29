const mongoose = require('mongoose');
let user =  process.env.MONGODB_USER//"dbUser";
let password = process.env.MONGODB_PASSWORD//"testUser";
let dbName = "dbUsers";
const dbUrl = `mongodb+srv://${user}:${password}@cluster0-h9l6a.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(dbUrl, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true
}).then(()=> console.log("Conectado a la base de datos"))
  .catch((err)=> console.log("No conectado, error", err))

module.exports = mongoose;