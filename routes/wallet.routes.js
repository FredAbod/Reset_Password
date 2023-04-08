const { deposit } = require('../controllers/wallet.controllers');


const router = require('express').Router();

router.post('/deposit', deposit);

module.exports = router;