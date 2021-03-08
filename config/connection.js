const mongodb = require('mongoose');
const config = require('config')
const db = config.get('dburl')
const connectDb =async ()=>{
 try{
    await mongodb.connect(db,{
        useNewUrlParser:true,
        useCreateIndex:true,
    })
    console.log("connecting...")}
    catch(error)
    {
        console.log(error.message)
        process.exit(1)
    }
}

module.exports=connectDb;