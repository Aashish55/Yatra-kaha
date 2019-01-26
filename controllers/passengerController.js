const accountHistoryController = require('../controllers/accountHistory');
const md5 = require('md5');

exports.processRecharge = (req, res) => {
    var card_number = req.body.card_number || "";

    pool.query("SELECT status, balance FROM recharge_cards WHERE card_number=?", [card_number], (err, rows) => {
        if (err) {
            console.log(err);
            req.flash('error', 'Database Error');
            res.redirect('back');
        } else {
            if (rows.length > 0){
                if (rows[0].status == "Active"){
                    pool.query("UPDATE passengers SET balance=balance+? WHERE id=?", [rows[0].balance, req.userData.id]);
                    pool.query("UPDATE recharge_cards SET status='Used', used_by=?, used_at=? WHERE card_number=?", [req.userData.id, Date.now(), card_number]);
                    accountHistoryController.addAccountHistoy(req.userData.id, req.userData.type, "Recharged for " + rows[0].balance + " NPR.");
                    req.flash('success', 'You have recharged for amount ' + rows[0].balance + ' NPR.');
                    res.redirect('back');
                } else {
                    req.flash('error', 'Card is already used.');
                    res.redirect('back');
                }
            } else {
                req.flash('error', 'Card number is not valid.');
                res.redirect('back');
            }
        }
    });
};

exports.doLogin = (req, res) => {
    pool.query("SELECT id FROM passengers WHERE email=? AND password=?", [req.body.email, md5(req.body.password + secretKey)], (err, rows)=>{
        if (err) {
            console.log(err);
            req.flash("error", "Database error");
            res.redirect("back");
        } else {
            if (rows.length > 0){
                var token = jwt.sign({ id: rows[0].id, type: 'passenger' }, secretKey);
                req.flash("success", "Logged in successfully.");
                res.cookie('token', token, {maxAge: 2592000000});
                res.redirect("/passenger/home");
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
        if (!req.body.full_name.trim().includes(" ")) throw "Write a proper full name.";
        if (req.body.address.length < 5) throw "Enter a descriptive address.";

        pool.query("SELECT id FROM passengers WHERE email=?", [req.body.email], (err, rows) =>{
            if (err) {
                console.log(err);
                req.flash("error", "Database error");
                res.redirect("back");
            } else {
                if (rows.length > 0){
                    req.flash("error", "User with same email already exists.");
                    res.redirect("back");
                } else {
                    pool.query("INSERT INTO passengers (email, password, full_name, address) VALUES (?,?,?,?)", [req.body.email, md5(req.body.password + secretKey), req.body.full_name, req.body.address], (err, rows)=>{
                        if (err){
                            console.log(err);
                            req.flash("error", "Database error");
                            res.redirect("back");
                        } else {
                            var token = jwt.sign({ id: rows.insertId, type: 'passenger' }, secretKey);
                            req.flash("success", "Registration was successful.");                
                            res.cookie('token', token, {maxAge: 2592000000});
                            res.redirect("/passenger/home");
                        }
                    });
                }
            }
        });
    } catch(str){
        req.flash("error", str);
        res.redirect("back");
    }
};

exports.getPaymentRequests = (req, res) => {
    pool.query("SELECT * FROM payments WHERE status='Pending' AND passenger_id=?", [req.userData.id], (err, rows)=>{
        if (err) {
            console.log(err);
            res.send("Database Error");
        } else {
            res.render('passenger/paymentRequests', {
                payments: rows
            });
        }
    })
}

exports.acceptPayment = (req, res)=>{
    pool.query("SELECT * FROM payments WHERE status='Pending' AND passenger_id=?", [req.userData.id], (err, rows)=>{
        if (err){
            console.log(err);
            req.flash("error", "Database error occurred.");
            res.redirect("back");
        } else {
            if (rows.length < 1){
                console.log(err);
                req.flash("error", "No such payment request was found.");
                res.redirect("back");
            } else {
                pool.query("SELECT COUNT(*) as num FROM passengers WHERE id=? AND balance >= ?", [req.userData.id, rows[0].amount], (err, rows2)=>{
                    if (err) {
                        console.log(err);
                        req.flash("error", "Database error.");
                        res.redirect("back");
                    } else {
                        if (rows2[0].num < 1){
                            req.flash("error", "You do not have sufficient balance to pay the invoice.");
                            res.redirect("back");
                        } else {
                            pool.query("UPDATE passengers SET balance=balance - ? WHERE id=?",[rows[0].amount, req.userData.id]);
                            pool.query("UPDATE buses SET balance=balance + ? WHERE id=?",[rows[0].amount, rows[0].bus_id]);
                            accountHistoryController.addAccountHistoy(req.userData.id, req.userData.type, "Paid " + rows[0].amount + " NPR to Bus: " + rows[0].bus_id + ".");
                            accountHistoryController.addAccountHistoy(rows[0].bus_id, "bus", "Received " + rows[0].amount + " NPR from Passenger: " + req.userData.id + ".");

                            pool.query("UPDATE payments SET status='Paid', updated_at=? WHERE id=?", [Date.now(), rows[0].id], (err, data)=>{
                                req.flash("success", "Payment was sent to the bus department.");
                                res.redirect("back");
                            });    
                        }
                    }
                });
            }
        }
    });
};

exports.rejectPayment = (req, res)=>{
    pool.query("SELECT * FROM payments WHERE status='Pending' AND passenger_id=?", [req.userData.id], (err, rows)=>{
        if (err){
            console.log(err);
            req.flash("error", "Database error occurred.");
            res.redirect("back");
        } else {
            if (rows.length < 1){
                console.log(err);
                req.flash("error", "No such payment request was found.");
                res.redirect("back");
            } else {
                pool.query("UPDATE payments SET status='Rejected', updated_at=? WHERE id=?", [Date.now(), rows[0].id], (err, data)=>{
                    req.flash("success", "You have rejected the payment request that was sent.");
                    res.redirect("back");
                });
            }
        }
    });
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
    if (req.body.newPassword !== req.body.newPassword2){
        req.flash("error", "Confirmed password do not match.");
        res.redirect("back");
    } else if (req.body.newPassword.length < 5){
        req.flash("error", "New password must be atleast 5 characters long.");
        res.redirect("back");
    } else {
        pool.query("SELECT COUNT(*) as num FROM passengers WHERE id=? AND password=?", [req.userData.id, md5(req.body.oldPassword + secretKey)], (err, rows)=>{
            if (err){
                req.flash("Database error.");
                console.log(err);
                res.redirect("back");
            } else {
                if (rows[0].num > 0){
                    pool.query("UPDATE passengers SET password=? WHERE id=?", [md5(req.body.newPassword + secretKey), req.userData.id], (err, rows)=>{
                        if (err){
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