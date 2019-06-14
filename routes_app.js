const express = require("express");
const Images = require("./models/images");
const router = express.Router();
const image_finder_middlewares = require("./middlewares/find_image");


/*  app.com/app/  */
router.get("/", (req, res) => {
    //buscar el usuario logeado
    //redirecciona a la pantalla principal
    res.render("app/home");
});

/* REST */

router.get("/images/new", (req, res) => {
    res.render("app/images/new")
});

//
router.all("/imagenes/:id*", image_finder_middlewares);


router.get("/images/:id/edit", (req, res) => {
    Images.findById(req.params.id, (err, _image) => {
        if (!err) {
            res.render("app/images/edit", { image: _image });
        } else {
            res.render(err);
            return;
        }
    });
});



router.route("/images/:id")
    .get((req, res) => {
        //mostrar una imagen
        Images.findById(req.params.id, (err, image) => {
            if (!err) {
                res.render("app/images/show", { image: image })
            } else {
                res.render(err);
            }
        });//acceder el id que viene de la url

    })
    .put((req, res) => {
        //actualizar una imagen
        Images.findById(req.params.id, (err, image) => {
            if (!err) {
                //obtener campo del formulario
                image.title = req.body.title;
                image.save((err) => {
                    if (!err) {
                        res.render("app/images/show", { image: image })
                    } else {
                        res.render("app/images/" + image.id + "/edit", { image: image })
                    }
                });
            } else {
                res.render(err);
            }
        });
    })
    .delete((req, res) => {
        //borrar una imagen
        Image.findOneAndRemove({_id: req.params.id}, (err)=>{
            if (!err) {
                res.redirect("/app/images");
            } else {
                console.log(err);
                res.redirect("/app/images"+req.params.id)
            }
        });
    });

//crud 
router.route("/images")
    .get((req, res) => {
        Images.find({}, (err, _imgs) => {
            if (err) {
                res.redirect("/app/home");
                return;
            }
            res.render("app/images/index", { images: _imgs });
        });
    })
    .post((req, res) => {
        var data = {
            title: req.body.title
        }
        var image = new Images(data);

        image.save((err) => {
            if (!err) {
                res.redirect("/app/images/" + image._id);
            }
            else {
                res.render(err);
                return;
            }
        })
    });

//export
module.exports = router;