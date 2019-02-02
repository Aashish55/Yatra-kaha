module.exports = (req, res, next) => {
    if (req.userData.type === "passenger") {
        next();
    } else {
        req.flash("error", "You are not authorized.");
        res.redirect('/passenger/login');
    }
};