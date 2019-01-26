const router = require('express').Router();

const auth = require('../middlewares/auth');
const passengerAuth = require('../middlewares/passengerAuth');
const md5 = require('md5');

const passengerController = require('../controllers/passengerController');

router.get('/passenger/login', (req, res) => {
    res.render('login/login');
});

router.post('/passenger/login', passengerController.doLogin);

router.get('/passenger/register', (req, res) => {
    res.render('login/register');
});

router.post('/passenger/register', passengerController.doRegister);

router.get('/passenger/home', auth, passengerAuth, (req, res) => {
    res.render('passenger/home');
});

router.get('/passenger/recharge', auth, passengerAuth ,(req, res) => {
    res.render('passenger/recharge');
});

router.post('/passenger/recharge', auth, passengerAuth, passengerController.processRecharge);

router.get('/passenger/paymentRequests', auth, passengerAuth, passengerController.getPaymentRequests);

router.get('/passenger/payment/:id/accept', auth, passengerAuth, passengerController.acceptPayment);

router.get('/passenger/payment/:id/reject', auth, passengerAuth, passengerController.rejectPayment);

router.get('/passenger/accountHistory', auth, passengerAuth, passengerController.getAccountHistory);

router.get('/passenger/changePassword', auth, passengerAuth, (req, res) => {
    res.render('changePassword');
});

router.post('/passenger/changePassword', auth, passengerAuth, passengerController.changePassword);

module.exports = router;