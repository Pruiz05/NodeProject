const express = require("express");
//const mongoose = require("mongoose");
const bodyParser = require("body-parser");
/*import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
*/
const app = express();
//const Schema = mongoose.Schema;

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


//connection --------------------
//mongoose.connect("mongodb://localhost/fotos");

//tabla  
/*var userSchemaJSON = {
    email: String,
    password: String
};
//crear schema
var user_schema = new Schema(userSchemaJSON);
//crear modelo
var User = mongoose.model("User", user_schema);
*/


//archivos estaticos
app.use("/public", express.static('public'));
//leer parametros en las peticiones application/json
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ useNewUrlParser: true }));//true: hacer parsing de varios formatos

app.use(methodOverride("_method"));

//middleware subir imagen
app.use(fileUpload());



//leyendo archivos en la app
//app.use(formidable.parse({keepExtensions: true}));
/*app.use(formidable({
    encoding:'utf-8',
    uploadDir:'/assets/',
    multiples: true
}));*/

//app.use(formidable.parse({keepExtensions: true, uploadDir:"images"));
/*app.use(formidable());
var opts = {
    encoding: 'utf-8',
    uploadDir: '/my/dir',
    multiples: true, // req.files to be arrays of files
}
 
app.post('/images', (req, res) => {
  req.fields; // contains non-file fields
  req.files; // contains files
});*/


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

/*
app.post('/app/images', (req, res)=>{
    console.log(req);
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
      }
    
      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      let sampleFile = req.files.archivo;
    
      // Use the mv() method to place the file somewhere on your server
      sampleFile.mv('/assets/filename.jpg', function(err) {
        if (err)
          return res.status(500).send(err);
    
        res.send('File uploaded!');
      });
});
*/

//server
app.listen(8080, function () {
    console.log("Server on port 8080");
});