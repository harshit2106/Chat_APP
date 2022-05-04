const express = require("express");
const router = express.Router();

const {
  signUp,
  signIn,
  test,
  signout,
  allUser,
} = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middlewares/authMiddleware");

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/signout", signout);
router.get("/alluser", isAuthenticatedUser, allUser);

module.exports = router;
