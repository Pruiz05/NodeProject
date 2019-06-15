const Images = require("../models/images");

module.exports = (image, req, res)=>{
    //true = tiene permiso
    //false = no tiene permiso
    //si el modelo de image no tiene el campo creator
    if(typeof image.creator == "undefined") return false;

    if (req.method ==="GET" && req.path.indexOf("edit") < 0) {
        return true;
    }

    if (image.creator._id.toString() == res.locals.user._id) {
        //la imagen ha sido creada por el usuario logeado
        return true;
    }

    return false;
}