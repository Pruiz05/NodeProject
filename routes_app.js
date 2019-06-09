const express = require("express");
const Images = require("./models/images");
const router = express.Router();


/*  app.com/app/  */
router.get("/", (req, res)=>{
    //buscar el usuario logeado
    //redirecciona a la pantalla principal
    res.render("app/home");
});

/* REST */

router.get("/images/new", (req, res)=>{
    res.render("app/images/new")
});


router.get("/images/:id/edit", (req, res)=>{
    
});



router.route("/images/:id")
    .get((req, res)=>{
        Images.findById(req.params.id, (err, image)=>{
            if (!err) {
                res.render("app/images/show", {image:image})
            } else {
                res.render(err);
            }
        });//acceder el id que viene de la url
        
    })
    .put((req, res)=>{

    })
    .delete((req, res)=>{

    });

router.route("/images")
    .get((req, res)=>{

    })
    .post((req, res)=>{
        var data = {
            title:req.body.title
        }
        var image= new Images(data);

        image.save((err)=>{
            if(!err){
                res.redirect("/app/images/"+image._id);
            }
            else{
                res.render(err);
            }
        })
    });

//export
module.exports =router;