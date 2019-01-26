var router = require('express').Router();

router.get('/logout', (req, res) =>{
    res.clearCookie('token');
    res.redirect('/');
});

router.get('/', (req, res)=>{
    res.render('login/index');
});

module.exports = router;