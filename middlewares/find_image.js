const Image = require("../models/images");
const owner_check = require("../middlewares/image_permisions");

module.exports = (req, res, next) => {
    Image.findById(req.params.id)
        .populate("creator")
        .exec((err, image) => {
        if (image != null && owner_check(image, req, res)) {
            res.locals.image = image;
            next();
        } else {
            res.redirect("/app");
        }
    });

}