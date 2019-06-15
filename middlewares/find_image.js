const Image = require("../models/images");
module.exports = (req, res, next) => {
    Image.findById(req.params.id)
        .populate("creator")
        .exec((err, image) => {
        if (image != null) {
            res.locals.image = image;
            next();
        } else {
            res.redirect("/app");
        }
    });

}