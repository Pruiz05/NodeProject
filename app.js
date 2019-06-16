const express = require("express");
const bodyParser = require("body-parser");

const User = require("./models/user").User;
//manejo de sesiones
const session = require("express-session");
//manejo de cookies
const cookieSession = require("cookie-session");
//rutas modulares
const router_app = require("./routes_app");
//session middlewares
const session_middlewares = require("./middlewares/session")
//
const formidable = require("express-formidable");
//upload files 
const fileUpload = require("express-fileupload");
//sobrescribir methodos de los formularios -- middleware
const methodOverride = require("method-override");
//app
const app = express();

//archivos estaticos
app.use("/public", express.static('public'));
//leer parametros en las peticiones application/json
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ useNewUrlParser: true }));//true: hacer parsing de varios formatos

app.use(methodOverride("_method"));

//middleware subir imagen
app.use(fileUpload());

//middleware views engines 
app.set("view engine", "pug");

//middleware para manejo de sessiones
/*app.use(session({
    secret: "123456789",
    resave:false,//especifica que la sesion se vuelve a guardar resave: true or false
    saveUninitialized:false//indica si la session debe guardarse cuando no ha sido inicializada flase =reduce el almacenamiento en el store
    //genid:(req)=>{
    //}
}));*/

//middleware manejo de cookies
app.use(cookieSession({
    name: "session",
    keys: ["llave-1", "llave-2"]
}));

//Home
app.get("/", (req, res) => {
    console.log(req.session.user_id);
    res.render("index");
});

app.get("/signup", (req, res) => {
    User.find((err, doc) => {
        console.log(doc);
    });
    res.render("signup");
});

app.get("/login", (req, res) => {
    /*
    //buscar usuarios registrados eb ka base de datos
    User.find((err, doc)=>{
        console.log(doc);
    });*/
    res.render("login");
});

app.post("/users", (req, res) => {
    var user = new User({
        email: req.body.email,
        password: req.body.password,
        password_confirmation: req.body.password_confirmation,
        username: req.body.username
    });

    /* 
    Error, documento, numero de elementos afectados
    */
    user.save((err, user, numero) => {
        //validar
        if (err) {
            console.log(String(err))
        }
        res.send("Datos Guardados!")
    });

    //promesas 
    /*user.save().then((us)=>{
        res.send("Datos Guardados!");
    }, (err)=>{
        if (err) {
            console.log(String(err));
        }
    });*/
});

//login
app.post("/sessions", (req, res) => {
    //finders
    User.findOne({
        email: req.body.email,
        password: req.body.password
    }, (err, user) => {
        //console.log(user);
        if (err) {
            console.log(err);
            res.redirect("/app");
        }
        else {
            //se asigna valor a una ariable de sesion
            req.session.user_id = user._id;
            res.redirect("/app");
            //res.send("Hola Mundo");
        }

    });
});

//
app.use("/app", session_middlewares);
//
app.use("/app", router_app);

//server
app.listen(8080, function () {
    console.log("Server on port 8080");
});