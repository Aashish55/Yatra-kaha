var jwt = require('jsonwebtoken');

module.exports = (req, res, next)=>{
    var token = req.cookies.token || "";

    try {
        var userData = jwt.verify(token, secretKey);
        req.userData = userData;
        var sql = "";
        if (userData.type == "passenger"){
            sql = "SELECT full_name as name, balance FROM passengers WHERE id=?";
            res.locals.passenger = true;
        } else {
            sql = "SELECT bus_number as name, balance FROM buses WHERE id=?";
            res.locals.bus = true;
        }

        pool.query(sql, [userData.id], (err, rows)=>{
            if (err) {
                console.log(err);
                req.flash("Database Error");
                res.redirect("/" + userData.type + "/home");
            } else {
                res.locals.name = rows[0].name;
                res.locals.balance = rows[0].balance;
                next();
            }
        });
    } catch(err) {
        req.flash("error","You are not authorized.");
        res.redirect("/");
    }
};