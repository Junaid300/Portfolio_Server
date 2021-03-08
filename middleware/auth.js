const jwtToken = require('jsonwebtoken')
const config = require ('config')

module.exports= function(req,res,next)
{
    const token = req.header('x-auth')
    if(!token)
    {
        return res.status(400).json("Invalid Token Request")

    }
    try {
    const decode =  jwtToken.verify(token,config.get('token'))
    req.user = decode.user;
    next()
    }
    catch(error)
    {
        console.log(error.message)
        res.status(500).json("Not Valid Request")
        
    }

}