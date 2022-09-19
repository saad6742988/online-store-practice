const User= require('../models/user')
const { validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressjwt = require("express-jwt");

exports.signout=(req,res)=>
{
    res.clearCookie('token');
    res.json({
        message:"User SignOut"
    })
}

exports.signup=(req,res)=>{

    const errors=validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(422).json({
            Error:errors.array()[0].msg,
            Field:errors.array()[0].param
        }) 
    }
    const user =new User(req.body);
    user.save((err,newUser)=>{
        if(err)
        {
            return res.status(400).json({
                err_message:'Unable to save user'
            })
        }
        res.json({
            name:user.name,
            email:user.email,
            id:user._id
        })
    })
}

exports.signin=(req,res)=>
{
    const {email,password}=req.body;
    const errors=validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(422).json({
            Error:errors.array()[0].msg,
            Field:errors.array()[0].param
        }) 
    }
    User.findOne({email},(err,user)=>{
        if(err || !user)
        {
            return res.status(400).json(
                {
                    error:"User Not Found!"
                }
            )
        }
        if(!user.authenticate(password))
        {
            return res.status(401).json(
                {
                    error:"Email and Password Don't Match!"
                }
            )
        }
        const token=jwt.sign({_id:user._id},process.env.Secret)
        ///storing cookies
        res.cookie('token',token,{expire:new Date()+9999})

        res.json({token,User:{
            name:user.name,
            email:user.email,
            id:user._id,
            role:user.role
        }})

    })
}

//protected Route
exports.isSignedIn=expressjwt({
    secret:process.env.Secret,
    userProperty:"auth"
})


//custom middlewares
exports.authenticated=(req,res,next)=>{
    let check = req.profile && req.auth && req.profile._id==req.auth._id
    if(!check)
    {
        return res.status(403).json({
            error:"Access Denied"
        })
    }
    next();
}
exports.isAdmin=(req,res,next)=>{
    if(req.profile.role===0)
    {
        return res.status(403).json({
            error:"You are not Admin"

        })
    }
    next();
}