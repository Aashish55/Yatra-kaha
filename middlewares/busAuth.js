module.exports = (req, res, next) => {
    if (req.userData.type === "bus") {
        next();
    } else {
        req.flash("error", "You are not authorized.");
        res.redirect('/bus/login');
    }
};