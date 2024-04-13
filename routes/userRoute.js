const express = require("express")
const router = express.Router();

const {userSignUp, userLogIn, userForgotPassword, userSignUpVerify, forgotPasswordVerify, setNewPassword, resetPassword} = require("../controllers/userController");


router.post("/signup", userSignUp)
router.post("/signup-verify", userSignUpVerify)

router.post("/login", userLogIn)

router.post("/forgot-password", userForgotPassword)
router.post("/forgot-verify", forgotPasswordVerify)
router.post("/set-password", setNewPassword)

router.post("/reset-password", resetPassword)


module.exports = router;