import express from "express"
import {authenticate, codeExecution , getAllProjects, getProject, login, postProject, postUserData} from "../../controller/userController/userController.js";
import { registerSchema } from "../../schemas/userSchema.js";
import { validate } from "../../middlewares/validate.js";
import { register } from "../../middlewares/userSignup.js";
import LoginSchema from "../../schemas/loginSchema.js";

const UserRouter = express.Router();

UserRouter.post('/runCode' ,codeExecution);
UserRouter.post('/signup' , [validate(registerSchema) , register , postUserData]);
UserRouter.post('/login' , [validate(LoginSchema) , login ]);
UserRouter.get("/me" , authenticate );
UserRouter.get("/project/:id" , getProject);
UserRouter.post('/project' , postProject);
UserRouter.get("/myProjects" ,  getAllProjects);

export default UserRouter;