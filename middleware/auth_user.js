import User from "../models/user_model.js";




export const verifyUser = async (req,res,next)=>{
    if(!req.session.userId){
        return res.status(401).json({msg:"please log in to yourt account"});
    }
    const user = await User.findOne({
        where:{
            uuid:req.session.userId
        }
    });
    if (!user) return res.status(404).json({msg:"User not  found"});

    req.userId = user.id;
    req.role = user.role;
    next();
}




export const adminOnly = async (req,res,next)=>{
   
    const user = await User.findOne({
        where:{
            uuid:req.session.userId
        }
    });
    if (!user) return res.status(404).json({msg:"User not  found"});
    if (user.role !=="admin") return res.status(403).json({msg:"Access forbiden"});

    next();
}

export const selfOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { uuid: req.session.userId },
    });

    if (!user) return res.status(404).json({ msg: "User not found" });

    // Allow if admin OR accessing own account
    if (user.role === "admin" || user.uuid == req.params.id) {
      return next();
    }

    return res.status(403).json({ msg: "Access forbidden" });
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
};
