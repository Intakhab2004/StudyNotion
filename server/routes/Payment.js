const express = require("express");
const router = express.Router();

const {capturePayment, verifySignature, successfulPaymentEmail} = require("../controller/Payment");
const { auth, isStudent } = require("../middlewares/auth");

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifySignature", auth, isStudent, verifySignature);
router.post("/successfulPaymentEmail", auth, isStudent, successfulPaymentEmail);

module.exports = router;