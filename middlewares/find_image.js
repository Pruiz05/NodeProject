const Image = require("../models/images");
const owner_check = require("../middlewares/image_permisions");

module.exports = (req, res, next) => {
    Image.findById(req.params.id)
        .populate("creator")//agregando el campo creator
        .exec((err, image) => {
            
            if(err){
                res.redirect("/app");
                //TODO: crear pagina para manejo de errores
            }
            if (image != null && owner_check(image, req, res)) {//validar el usuario conectado con la funcion owner_check
                res.locals.image = image;
                next();
            } else {
                res.redirect("/app");
            }
        });

}