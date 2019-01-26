const router = require('express').Router();

const auth = require('../middlewares/auth');
const busAuth = require('../middlewares/busAuth');
const busController = require('../controllers/busController');

router.get('/bus/login', (req, res) => {
    res.render('login/login');
});

router.post('/bus/login', busController.doLogin);

router.get('/bus/register', (req, res) => {
    res.render('login/busRegister');
});

router.post('/bus/register', busController.doRegister);

router.get('/bus/home', auth, busAuth, (req, res) => {
    res.render('bus/home');
});

router.get('/bus/changePassword', auth, busAuth, (req, res) => {
    res.render('changePassword');
});

router.post('/bus/changePassword', auth, busAuth, busController.changePassword)

router.get('/bus/accountHistory', auth, busAuth, busController.getAccountHistory);

router.get('/bus/routes', auth, busAuth, busController.busRoutes);

router.get('/bus/routes/:route_id/stops/add', auth, busAuth, busController.addStopsPage);

router.post('/bus/routes/:route_id/stops/add', auth, busAuth, busController.addStop);

router.post('/bus/routes/setDefault', auth, busAuth, busController.setDefault);

router.get('/bus/issueInvoice', auth, busAuth, busController.issueInvoicePage);
router.post('/bus/issueInvoice', auth, busAuth, busController.issueInvoice);

router.post('/bus/routes/add', auth, busAuth, busController.addRoute);
module.exports = router;