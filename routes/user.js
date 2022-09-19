const express = require("express");
const router = express.Router();
const {getUserById, getUser, getAllUsers,updateUser,getUserPurchaseList} = require("../controller/user");
const {isSignedIn,authenticated,isAdmin} = require("../controller/auth");

router.param('userId',getUserById)
router.get('/users',getAllUsers)
router.get('/user/:userId',isSignedIn,authenticated,getUser)

router.put('/user/:userId',isSignedIn,authenticated,updateUser)
router.put('/orders/user/:userId',isSignedIn,authenticated,getUserPurchaseList)

module.exports = router;
