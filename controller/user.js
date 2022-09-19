const User = require("../models/user");
const Order=require('../models/order')
exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No User Found!",
      });
    }
    req.profile = user;
    next();
  });
};
exports.getAllUsers = (req, res) => {
  User.find().exec((err, users) => {
    if (err || !users) {
      return res.status(400).json({
        error: "No User Found!",
      });
    }
    res.json(users);
  });
};
exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encrtyPassword = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You Are Not Allowed to Edit!",
        });
      }
      user.salt = undefined;
      user.encrtyPassword = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      return res.json(user);
    }
  );
};

exports.getUserPurchaseList=(req,res)=>{
  Order.find({user:req.profile._id}).
  populate('user' ,'_id name').
  exec((err,order)=>{
    if(err)
    {
      return res.status(400).json({
        error:"No Orders Found"
      })
    }
    return res.json(order)
  })
}

exports.pushOrderInPurshaseList=(req,res,next)=>{
  let purchases=[];
  req.body.order.products.forEach(product=>{
    purchases.push({
      _id:product._id,
      name:product.name,
      description:product.description,
      category:product.category,
      quantity:product.quantity,
      amount:req.body.order.amount,
      transaction_id:req.body.order.transaction_id

    })
  })

  //storing in DB
  User.findOneAndUpdate(
    {_id:req.profile.id},
    {$push:{purchases:purchases}},
    {new:true},
    (err,purchases)=>
    {
      if(err)
      {
        return res.status(400).json({
          error:'Unable to save your Purchase List'
        })
      }
      next();
    }
  )
}