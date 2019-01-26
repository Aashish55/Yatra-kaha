var moment = require('moment');

exports.addAccountHistoy = (user_id, user_type, text) => {
    pool.query("INSERT INTO account_history (user_id, user_type, text, time) VALUES (?,?,?,?)", [user_id, user_type, text, Date.now()], (err, rows)=>{
        if (err) {
            console.log(err);
        }
    });
};

exports.getAccountHistory = (userData, callback)=>{
    pool.query("SELECT * FROM account_history WHERE user_id=? AND user_type=? ORDER BY id DESC LIMIT 50", [userData.id, userData.type], (err, rows)=>{
        if (err) {
            console.log(err)
            callback(false);
        } else {
            for (var i = 0; i < rows.length;i++){
                rows[i].time = moment.unix(rows[i].time / 1000).fromNow();
            }

            callback(rows);
        }
    });
};