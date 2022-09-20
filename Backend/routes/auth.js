
// import express

const express = require('express');
const fetchuser = require('../middleware/fetchuser')
const User = require('../models/User')
const router = express.Router();

//require bcrypt. bcrypt is used to dcrypt the password and save from hacker
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator');

//jwt which is used to secure  connection btw website and server
var jwt = require('jsonwebtoken');
const JWT_SECRET='rana$123'
// router means path // router.get means get api to get data
router.post('/createuser',[
    body('name',  "Enter a valid name").isLength({ min: 3 }),
    body('email', "Enter a valid email").isEmail(),
    body('password',"Enter a valid password").isLength({ min: 5 }),
], async (req, res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
try{
    //check whether the user with same email is already exist or not
    let user = await User.findOne({email:req.body.email});
    if(user)
    {
      return res.status(400).json({error:"Sorry a user with this email already exist"})
    }

    // salt is a additional string which we add with password for security purpose
    const salt = await bcrypt.genSalt(10);
    //bcrypt.has function generate the hash of password and add salt
    const secPass = await bcrypt.hash(req.body.password, salt)
       user = await User.create({
        name: req.body.name,
        email:req.body.email,
        password: secPass,
       })
      
       const data={
        user:{
          id:user.id
        }
       }
       const authToken = jwt.sign(data, JWT_SECRET);
      res.json({authToken})
  }catch(error){
    console.log(error.message)
    res.status(500).send("Some error occured")
  }
})

// login api
router.post('/login',[
  body('email', "Enter a valid email").isEmail(),
  body('password',"Enter a valid password").exists(),
], async (req, res)=>{
   
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  // get data which is entered by user on portal
   const {email,password} = req.body;
   try{
      // find data in database
      let user = await User.findOne({email})

      if(!user)
      {
        return res.status(400).json({error:" Pleae enter right credential"})
      }

      // compare the password which is entered by usser with the password which It was saved earlier
      const passwordCompare = await bcrypt.compare(password, user.password);

      if(!passwordCompare)
      {
        return res.status(400).json({error:" Pleae enter right credential"})
      }
      const data={
        user:{
          id:user.id
        }
       }
       const authToken = jwt.sign(data, JWT_SECRET);
      res.json({authToken})
   }catch{
    console.log(error.message)
    res.status(500).send("Some error occured")
   }
})

//get user details api
router.post('/getuser',fetchuser, async (req, res)=>{

  try {
     userId=req.user.id;
     const user = await User.findById(userId).select("-password")
     res.send(user);
  }catch{
    console.log(error.message)
    res.status(500).send("Some error occured")
   }
})
module.exports = router