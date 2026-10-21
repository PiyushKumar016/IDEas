import chalk from "chalk";
import codeRunner from "../../services/codeRunner.js";
import bcrypt from "bcrypt";
import User from "../../model/UserModel.js";
import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import { success } from "zod";
import {Project} from "../../schemas/projectSchema.js";

export const codeExecution = async (req, res) => {
  const { code, language } = req.body;
  if (!code || !language) {
    return res.status(400).json({ error: "code aur language dono chahiye" });
  }

  if (code.length > 50000) {
    return res.status(400).json({ error: "Code bahut bada hai (max 50KB)" });
  }

  try {
    const result = await codeRunner(code, language);
    console.log({
      output: result.output,
      error: result.error,
    });
    res.json({
      output: result.output,
      error: result.error,
    });
  } catch (err) {
    console.log({ error: "Server error: " + err.message });
    res.status(500).json({ error: "Server error: " + err.message });
  }
};
export const postUserData = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const saltRounds = Number(process.env.SALT);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
      uid: res.locals.uid,
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    console.log(chalk.greenBright("register successful"));
    res.cookie("accessToken", res.locals.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    return res.status(200).json({
      success:true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error in postUserData:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const authenticate = async (req, res, next) => {
  try {
    const receivedToken = req.cookies.accessToken;
    if (!receivedToken) {
      console.log(chalk.redBright("token not recived"));
      return res.status(401).json({
        success: false,
        message: "unauthorized",
      });
    }
    const decoded = jwt.verify(receivedToken, process.env.JWT_SECURITY_KEY);
    const {email , username} = await User.findOne({ uid: decoded.uid }).select("-password");
    if (!email) {
      console.log(chalk.redBright("user not found"));
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    return res.status(200).json({
      success: true,
      user:{
        email,
        username,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: "invalid token",
    });
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)
    const userData = await User.findOne({ email: email }).select("+password");
    if (!userData) {
      console.log(chalk.redBright("user not found"))
      return res.status(401).json({
        success:false,
        message: "invalid credentials",
      });
    }
    const passwordCorrect = await bcrypt.compare(password, userData.password);
    if (!passwordCorrect) {
      console.log(chalk.redBright("incorrect password"))
      return res.status(401).json({
        success:false,
        message: "invalid credentials",
      });
    }
    const payload = {
      uid: userData.uid,
      role: userData.role,
    };
    const tokenOptions = {
      expiresIn: process.env.JWT_EXPIRES_IN,
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE,
    };
    const token = jwt.sign(payload, process.env.JWT_SECURITY_KEY, tokenOptions);
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    return res.status(200).json({
      success:true
    });
  } catch (err) {
    console.log(chalk.redBright(err));
    return res.status(401).json({
      message: "invalid credentials",
    });
  }
};

export const getProject = async (req,res,next) => {
  try{
    const id = req.params.id;
    const projectData = await Project.findOne({ "owner": id });
    if(!projectData){
      console.log(chalk.redBright("project not found"));
      return res.json({
        success:false,
        message:"project not found",
      })
    }
    console.log(chalk.greenBright("project success"));
    return res.status(200).json({
      success:true,
      project:projectData
    })
  }
  catch(err){
    console.log(chalk.redBright(err));
    return res.json({
      success:false,
      message:"project not found",
    })
  }
}
export const postProject = async (req , res , next) => {
  try{
    console.log("project body -> " , req.body);
    const receivedToken = req.cookies.accessToken;
    if (!receivedToken) {
      console.log(chalk.redBright("token not recived"));
      return res.status(401).json({
        success: false,
        message: "unauthorized",
      });
    }
    const {uid} = await jwt.verify(receivedToken, process.env.JWT_SECURITY_KEY);
    const project = await Project.updateOne({"owner": req.body.id } , {$set: {rootNode:req.body}});
    const user = await User.updateOne(
      { uid: uid },
      { 
        $addToSet: { projects: req.body.id } 
      }
    )
    if(project.matchedCount === 0){
      console.log(chalk.greenBright("project saved successfully"));
      const newProject = await new Project({owner:req.body.id,rootNode:req.body});
      await newProject.save();
      return res.status(200).json({
        success:true,
        message : "project saved successfully"
      })
    }
    console.log(chalk.cyan("this is user with updated projects array -> " , user))
    console.log(chalk.greenBright("project saved successfully"));
    return res.status(200).json({
      success:true,
      message : "project saved successfully"
    })
  }
  catch(err){
    console.log(chalk.redBright(err));
    return res.json({
      success:false,
      message:"something went wrong",
    })
  }
}
export const getAllProjects = async (req , res , next) => {
  try{
    const receivedToken = req.cookies.accessToken;
    if (!receivedToken) {
      console.log(chalk.redBright("token not recived"));
      return res.status(401).json({
        success: false,
        message: "unauthorized",
      });
    }
    const {uid} = jwt.verify(receivedToken, process.env.JWT_SECURITY_KEY);
    const {projects} = await User.findOne({uid:uid});
    const projectsData = await Project.find({
      owner: { $in: projects }
    });
    if(projects && projects.matchedCount === 0){
      return res.status(400).json({
        success:false,
        message:"no projects found"
      })
    }
    return res.status(200).json({
      success:true,
      projects:projectsData
    });
  }
  catch(err){
    console.log(chalk.redBright(err));
    return res.status(400).json({
        success:false,
        message:"something went wrong"
      })
  }
}