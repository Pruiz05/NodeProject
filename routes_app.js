const express = require("express");
const Images = require("./models/images");
const router = express.Router();
const image_finder_middlewares = require("./middlewares/find_image");


/*  app.com/app/   s */
router.get("/", (req, res) => {
    //buscar el usuario logeado
    //redirecciona a la pantalla principal
    res.render("app/home");
});

/* REST */

router.get("/images/new", (req, res) => {
    res.render("app/images/new")
});

//middleware aplicado a todas las rutas
router.all("/images/:id*", image_finder_middlewares);


router.get("/images/:id/edit", (req, res) => {
    res.render("app/images/edit");
});



router.route("/images/:id")
    .get((req, res) => {
        //mostrar una imagen
        res.render("app/images/show");
    })
    .put((req, res) => {
        //actualizar una imagen

        res.locals.image.title = req.body.title;
        res.locals.image.save((err)=>{
            if (!err) {
                res.render("app/images/show");
            } else {
                res.render("app/images/" + req.params.id + "/edit");
            }
        });
    })
    .delete((req, res) => {
        //borrar una imagen
        Images.findOneAndRemove({_id: req.params.id}, (err)=>{
            if (!err) {
                console.log("Registro Eliminado");
                res.redirect("/app/images");
            } else {
                console.log(err);
                res.redirect("/app/images/"+req.params.id)
            }
        });
    });

//crud  
router.route("/images")
    .get((req, res) => {
        Images.find({creator:res.locals.user._id}, (err, _imgs) => {
            if (err) {
                res.redirect("/app/home");
                return;
            }
            res.render("app/images/index", { images: _imgs });
        });
    })
    .post((req, res) => {
        var data = {
            title: req.body.title,
            creator: res.locals.user._id//acceder al usuario conectado
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