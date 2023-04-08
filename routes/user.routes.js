const { signUp, login, forgotPassword, resetPassword } = require('../controllers/user.controllers');

const router = require('express').Router();

router.post("/signup", signUp);
router.post("/login", login);
router.put("/forgotpassword", forgotPassword);
router.put("/resetpassword", resetPassword);

module.exports= router;