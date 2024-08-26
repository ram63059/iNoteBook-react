const express=require("express");
const router=express.Router();
const User=require("../models/User")
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const jwt_secret="thisisasecret";
var fetchuser=require('../middleware/fetchuser')

//Route 1
router.post('/createuser',[

   body('name',"enter a valid name").isLength({min:3}),
   body('email',"enter a valid email").isEmail(),
   body('password'   ).isLength({min:5}),
], async (req,res)=>{
   let success=false;
   
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return  res.send({success, errors: errors.array() });
   }

   try {
      
   
   let user=await User.findOne({email:req.body.email});
   console.log(user)
   if(user){
      return res.status(400).json({success, error:"sorry a user with this email already exists"})
   }
   const salt = await bcrypt.genSaltSync(10);
   const secPass=await bcrypt.hash(req.body.password,salt);

   user=await User.create({
      name:req.body.name,
      email:req.body.email,
      password:secPass,});

      const data={
         user:{
            id:user.id,
         }
      }
      const authtoken=jwt.sign(data,jwt_secret);
      let success=true;
          res.json({success,authtoken})

   } catch (error) {
      console.error(error.message);
      res.status(500).send("some error has occured");
   }
})

// Route 2
router.post('/login',[

   body('email',"enter a valid email").isEmail(),
   body('password',"Password cannot be blank").exists(),
], async (req,res)=>{
   let success=false;
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return  res.send({ errors: errors.array() });
   }

   const {email,password}=req.body;
   try {
      let user=await User.findOne({email});
      if(!user){
         return res.status(400).json({error:"please try login with correct credentials"})
      }
      const passwordCompare=await bcrypt.compare(password,user.password);
      if(!passwordCompare){
         return res.status(400).json({success,error:"please try login with correct credentials"})
      }

      const data={
         user:{
            id:user.id,
         }
      }
      const authtoken=jwt.sign(data,jwt_secret);
      success=true;
      res.json({success,authtoken})
   } catch (error) {
      console.error(error.message);
      res.status(500).send("some error has occured");
   }

})

//Route 3
router.post('/getuser',fetchuser, async (req,res)=>{
   try {
      userId=req.user.id;
      const user=await User.findById(userId).select("-password")
      res.send(user)
   } catch (error) {
      console.error(error.message);
      res.status(500).send("some error has occured");
   }
})
module.exports=router