import chalk from "chalk";
import User from "../model/UserModel.js";
import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";

export const register = async (req , res , next) =>{
    const userData = await User.findOne({ email: req.body.email }).select("-password");
    try{
        if(userData){
           console.log(chalk.redBright("Email Already Exists"))
           return res.status(409).json({
             success: false,
             message: "User already exists with this email.",
           });
        }
        res.locals.uid = randomUUID();
        const payload = {
            uid:res.locals.uid,
            role:"user"
        }
        const tokenOptions = {
            expiresIn: process.env.JWT_EXPIRES_IN, 
            issuer: process.env.JWT_ISSUER,
            audience: process.env.JWT_AUDIENCE
        }
        const token = jwt.sign(payload , process.env.JWT_SECURITY_KEY , tokenOptions);
        console.log("token - " , token);
        res.locals.token = token;
        next();
    }
    catch(err){
        console.log(chalk.redBright(err));
    }
}