const express = require('express');

const User = require('../../model/registerUser')
const router = express()
const bcrypt = require('bcrypt')
const config = require('config')
const jsontoken = require('jsonwebtoken')
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

router.get('/',auth,async(req,res)=>{
   try{
    let user = await User.findById(req.user.id).select("-password")
        res.status(200).json(user)
    }
catch(error)
{
    console.log(error.message)
    res.status(500).json("Not Valid Request")
}
})

router.post('/',
check('email',"Enter a valid email").isEmail(),
check('password',"Password Required").not().isEmpty()
,async (req,res)=>{
    const error = validationResult(req)
    if(!error.isEmpty())
    {
        return res.status(500).json({error:error.array()})
    }
    const {email,password}=req.body
    console.log(email,password)
   try {
    let user = await User.findOne({email})

   
    if(!user)
    {
        console.log("user",user)
        return res.status(500).json({error:["Invalid Crediential"]})
    }
    const isMatch = await bcrypt.compare(password,user.password)
    console.log("IsMatch",isMatch)
    if(!isMatch)
    {
        return res.status(500).json({error:["Invalid Crediential"]})
    }
  

  const paylaod = {
      user:{
          id:user.id
      }
  }
  jsontoken.sign(paylaod,config.get('token'),
  {expiresIn:3600},
  (err,token)=>{
      if(err) throw err
      console.log(token)
      res.status(200).json([user,token])
  }
  )
  
}
    catch(error)
    {
        res.status(401).json("Server Error")
        console.log(error.message)
    }

})
module.exports=router