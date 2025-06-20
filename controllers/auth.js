import User from "../models/user_model.js";
import argon2 from "argon2";

export const Login = async(req,res)=>{
    const user = await User.findOne({
        where:{
            email:req.body.email
        }
    });
    if (!user) return res.status(404).json({msg:"User not  found"});
    const match = await argon2.verify(user.password, req.body.password);
    if (!match) return res.status(400).json({msg:"wrong password"});
    req.session.userId=user.uuid;
    const id = user.id
    const uuid=user.uuid;
    const name = user.name;
    const email = user.email;
    const role = user.role;
    //const profileImage=user.profileImage;
    res.status(200).json({id,uuid,name,email,role});
 
}

export const Me = async(req,res)=>{
    if(!req.session.userId){
        return res.status(401).json({msg:"please log in to yourt account"});
    }
    const user = await User.findOne({
        attributes:['id','uuid','name','email','role'],
        where:{
            uuid:req.session.userId
        }
    });
    if (!user) return res.status(404).json({msg:"User not  found"});
    res.status(200).json(user);
}

export const logOut = (req,res)=>{
    req.session.destroy((err)=>{
        if (err) return res.status(400).json({msg:"canot log out"});
        res.status(200).json({msg:"Logged out"});
    });
}