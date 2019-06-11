const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//add settings 
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };

//connection to database
mongoose.connect("mongodb://localhost:27017/fotos");//(url),options)

//expresiones regulares
var email_match =[/^[A-Z]{1,2}\s\d{4}\s([B-D]|[F-H]|[J-N]|[P-T]|[V-Z]){3}$/];
// 
var valida_pass = {
    validator: (p) => {
        return this.password_confirmation==p;
    },
    message: "Las contraseñas no son iguales"
}

//esquema
var user_schema = new Schema({
    name: String,
    username: {type: String, required:true, maxlength: [50,"El usuario es muy grande"]},
    password: {type: String, 
        required:true, 
        minlength: [5,"La contraseña es muy corta"]//,
        //validate: valida_pass
    },
    age: {type: Number, min:[5,"La edad no puede ser menor que 5"], max:[100, "La edad no puede ser mayor que 100"]},
    email: {type: String, required: "El correo es obligatorio"},//validaciones 
    date_of_birth: Date
});

//virtuals 
user_schema.virtual("password_confirmation").get(() => {
    return this.p_c;
}).set((password) => {
    this.p_c = password;
});

//crear modelo
var User = mongoose.model("User", user_schema);
//export
module.exports.User = User;