const express = require("express");
const Images = require("./models/images");
const router = express.Router();
const image_finder_middlewares = require("./middlewares/find_image");

/*  app.com/app/  */
router.get("/", (req, res) => {
    //buscar el usuario logeado
    //redirecciona a la pantalla principal
    //res.render("app/home");
    Images.find({})
        .populate("creator")
        .exec((err, _images)=>{
            if(err) console.log(err);
            res.render("app/home", {images: _images})
        })
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
        //mostrar una imagen redirigir a la vista 'Show'
        res.render("app/images/show");
    })
    .put((req, res) => {
        //actualizar una imagen
        res.locals.image.title = req.body.title;
        res.locals.image.save((err) => {
            if (!err) {
                res.render("app/images/show");
            } else {
                res.render("app/images/" + req.params.id + "/edit");
            }
        });
    })
    .delete((req, res) => {
        //borrar una imagen
        Images.findOneAndRemove({ _id: req.params.id }, (err) => {
            if (!err) {
                console.log("Registro Eliminado");
                res.redirect("/app/images");
            } else {
                console.log(err);
                res.redirect("/app/images/" + req.params.id)
            }
        });
    });

//crud  
router.route("/images")
    .get((req, res) => {
        //lista de imagenes creadas por el usuario
        //filtrando por el usuario conectado y las imagenes de ese usuario
        Images.find({ creator: res.locals.user._id }, (err, _imgs) => {
            if (err) {
                res.redirect("/app/home");
                return;
            }
            res.render("app/images/index", { images: _imgs });
        });
    })
    .post((req, res) => {
        //subir imagen al servidor y data a la bd

        if (Object.keys(req.files).length == 0) {
            return res.status(400).send('No files were uploaded.');
        }

        // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
        let archivo = req.files.archivo;

        var extension = req.files.archivo.name.split(".").pop();
        //console.log(req.files);
        var data = {
            title: req.body.title,
            creator: res.locals.user._id,//acceder al usuario conectado
            extension: extension
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
        
        
        // Use the mv() method to place the file somewhere on your server
        archivo.mv('C:/Users/PEDRO RUIZ DIAS/Documents/My Web Sites/NodeProject/public/images/' + image._id +'.' + extension, (err)=>{
            if (err)
                return res.status(500).send(err);
            
            //res.send('File uploaded!');
            console.log("File Uploaded!");
        });

    });

//export
module.exports = router;