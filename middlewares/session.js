const User = require("../models/user").User;
/* for default middlewares */

module.exports = (req, res, next) => {
    //si el usuario no está logeado redirije a login page
    if (!req.session.user_id) {
        res.redirect("/login");
    }
    else {
        User.findById(req.session.user_id, (err, user) => {
            if (err) {
                console.log(err)
                res.redirect("/login");
            } else {
                res.locals ={user: user};
                next();
            }
        });

    }
}