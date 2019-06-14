const Image= require("../models/images");
module.exports = (req, res, next) => {
    Image.findBy.id(req.params.id, ()=>{
        if (image != null) {
            res.locals.image=image;
            next();
        }else{
            res.redirect("/app");
        }
    });
    
}