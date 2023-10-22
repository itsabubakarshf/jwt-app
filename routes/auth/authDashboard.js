const User=require('../../models/User');
const authVerify=require('./authVerify');
const router = require('express').Router();

router.get('/all-users',authVerify,async(req,res)=>{
    try{
        const users=await User.find();
        res.json(users);
    }catch(error){
        res.json({message:error});
    }
});

module.exports=router;