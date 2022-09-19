const express = require('express')
const { check } = require('express-validator');
const router = express.Router()
const {signout,signup,signin,isSignedIn}=require('../controller/auth')

router.post('/signup',[
    check('name','Name Must Have at least 3 Characters.').isLength({min:3}),
    check('email','Email Required').isEmail(),
    check('password','Password Must Have at least 8 Characters.').isLength({min:8}),
],signup)

router.post('/signin',[
    check('email','Email Required').isEmail(),
    check('password','Password Required').isLength({min:1}),
],signin)

router.get('/testrouter',isSignedIn,(req,res)=>{
    res.json(req.auth)
})

router.get('/signout',signout)

module.exports=router