const accountHistoryController = require('../controllers/accountHistory');
const md5 = require('md5');

exports.busRoutes = (req, res) => {
    pool.query("SELECT * FROM bus_routes WHERE bus_id=?", [req.userData.id], (err, rows) => {
        if (err) {
            console.log(err);
            res.send("Database error");
        } else {
            pool.query("SELECT route_id FROM buses WHERE id=?", [req.userData.id], (err, rows2) => {
                if (err) {
                    console.log(err);
                    res.send("Database error");
                } else {
                    res.render('bus/routes', {
                        routes: rows,
                        route_id: rows2[0].route_id
                    });
                }
            })
        }
    });
};

exports.setDefault = (req, res) => {
    var route_id = req.body.route_id || "";

    pool.query("UPDATE buses SET route_id=? WHERE id=?", [route_id, req.userData.id]);

    req.flash("success", "Default route was set.");
    res.redirect('back');
};

exports.addRoute = (req, res) => {
    var first_end = req.body.first_end;
    var last_end = req.body.last_end;

    if (first_end.length < 0 || last_end.length < 0) {
        req.flash("error", "Fill all the fields properly.")
    } else {
        pool.query("INSERT INTO bus_routes(bus_id, first_end, last_end) VALUES (?,?,?)", [req.userData.id, first_end, last_end]);
        req.flash("Route was added to the list.");
        res.redirect('back');
    }
};

exports.addStopsPage = (req, res) => {
    pool.query("SELECT * FROM bus_stops WHERE bus_route_id=?", [req.params.route_id], (err, rows) => {
        if (err) {
            console.log(err);
            res.send("Database error");
            console.log(rows);
        } else {
            pool.query("SELECT first_end, last_end FROM bus_routes WHERE id=?", [req.params.route_id], (err, rows2) => {
                if (err) {
                    console.log(err);
                    res.send("Database error");
                } else {
                    res.render('bus/addStops', {
                        busStops: rows,
                        route: rows2[0]
                    });
                }
            });
        }
    })
};

exports.addStop = (req, res) => {
    var stop_name = req.body.stop_name.trim();

    if (stop_name.length < 1) {
        req.flash("error", "Type in a valid stop name.");
        res.redirect("back");
    } else {
        pool.query("INSERT INTO bus_stops (bus_route_id,stop_name) VALUES (?,?)", [req.params.route_id, stop_name], (err, rows) => {
            if (err) {
                console.log(err);
                req.flash("error", "Database Error.");
                res.redirect("back");
            } else {
                req.flash("Bus stop was added.");
                res.redirect("back");
            }
        });
    }
};

exports.issueInvoicePage = (req, res) => {
    pool.query("SELECT bus_stops.* FROM buses INNER JOIN bus_stops ON bus_stops.bus_route_id=buses.route_id AND buses.id=?", [req.userData.id], (err, rows) => {
        if (err) {
            console.log(err);
            res.send("Database error");
        } else {
            res.render("bus/issueInvoice", {
                stops: rows
            });
        }
    })
};

exports.issueInvoice = (req, res) => {
    var passenger_id = req.body.passenger_id;
    var amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount < 0) {
        req.flash("error", "Enter valid amount in NPR.");
        res.redirect("back");
    } else {
        pool.query("SELECT COUNT(*) as num FROM passengers WHERE id=?", [passenger_id], (err, rows) => {
            if (err) {
                req.flash("error", "Database Error");
                console.log(err);
                res.redirect("back");
            } else {
                if (rows[0].num < 1) {
                    req.flash("error", "No passenger found with that ID.");
                    res.redirect("back");
                } else {
                    if (req.body.discount) {
                        amount = amount * 0.55;
                    }
                    pool.query("INSERT INTO payments(bus_id, passenger_id, details, amount, updated_at) VALUES (?,?,?,?,?)", [req.userData.id, passenger_id, req.body.from + " - " + req.body.to, amount, Date.now()], (err, rows) => {
                        if (err) {
                            req.flash("error", "Database Error");
                            console.log(err);
                            res.redirect("back");
                        } else {
                            req.flash("success", "Payment request was sent.");
                            res.redirect("back");
                        }
                    })
                }
            }
        });
    }
};

exports.doLogin = (req, res) => {
    pool.query("SELECT id FROM buses WHERE email=? AND password=?", [req.body.email, md5(req.body.password + secretKey)], (err, rows) => {
        if (err) {
            console.log(err);
            req.flash("error", "Database error");
            res.redirect("back");
        } else {
            if (rows.length > 0) {
                var token = jwt.sign({
                    id: rows[0].id,
                    type: 'bus'
                }, secretKey);
                req.flash("success", "Logged in successfully.");
                res.cookie('token', token, {
                    maxAge: 2592000000
                });
                res.redirect("/bus/home");
            } else {
                req.flash("error", "Email and password did not match.");
                res.redirect("back");
            }
        }
    });
};

exports.doRegister = (req, res) => {
    var emailRegEx = /@gmail.com|@microsoft.com|@yahoo.com|@googlemail.com|@ymail.com|@live.com|@hotmail.com/;

    try {
        if (!emailRegEx.test(req.body.email)) throw "Email from your domain is not supported.";
        if (req.body.password.length < 5) throw "Password must be atleast 5 characters long.";
        if (req.body.password !== req.body.password2) throw "Confirmed password did not match.";
        if (req.body.bus_number.trim().length < 4) throw "Write a proper bus name.";

        pool.query("SELECT id FROM passengers WHERE email=?", [req.body.email], (err, rows) => {
            if (err) {
                console.log(err);
                req.flash("error", "Database error");
                res.redirect("back");
            } else {
                if (rows.length > 0) {
                    req.flash("error", "User with same email already exists.");
                    res.redirect("back");
                } else {
                    pool.query("INSERT INTO buses (email, password, bus_number) VALUES (?,?,?)", [req.body.email, md5(req.body.password + secretKey), req.body.bus_number], (err, rows) => {
                        if (err) {
                            console.log(err);
                            req.flash("error", "Database error");
                            res.redirect("back");
                        } else {
                            var token = jwt.sign({
                                id: rows.insertId,
                                type: 'bus'
                            }, secretKey);
                            req.flash("success", "Registration was successful.");
                            res.cookie('token', token, {
                                maxAge: 2592000000
                            });
                            res.redirect("/bus/home");
                        }
                    });
                }
            }
        });
    } catch (str) {
        req.flash("error", str);
        res.redirect("back");
    }
};

exports.getAccountHistory = (req, res) => {
    accountHistoryController.getAccountHistory(req.userData, (histories) => {
        if (!histories) {
            res.send("Database error.");
        } else {
            res.render('accountHistory', {
                histories: histories
            });
        }
    })
};

exports.changePassword = (req, res) => {
    if (req.body.newPassword !== req.body.newPassword2) {
        req.flash("error", "Confirmed password do not match.");
        res.redirect("back");
    } else if (req.body.newPassword.length < 5) {
        req.flash("error", "New password must be atleast 5 characters long.");
        res.redirect("back");
    } else {
        pool.query("SELECT COUNT(*) as num FROM buses WHERE id=? AND password=?", [req.userData.id, md5(req.body.oldPassword + secretKey)], (err, rows) => {
            if (err) {
                req.flash("Database error.");
                console.log(err);
                res.redirect("back");
            } else {
                if (rows[0].num > 0) {
                    pool.query("UPDATE buses SET password=? WHERE id=?", [md5(req.body.newPassword + secretKey), req.userData.id], (err, rows) => {
                        if (err) {
                            req.flash("Database error.");
                            console.log(err);
                            res.redirect("back");
                        } else {
                            req.flash("success", "Password was updated successfully.");
                            res.redirect("back");
                        }
                    });
                } else {
                    req.flash("error", "Old password did not match.");
                    res.redirect("back");
                }
            }
        })
    }
};