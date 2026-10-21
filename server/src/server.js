import express, { json, urlencoded } from "express";
import chalk from "chalk";
import cors from "cors";
import dotenv from "dotenv";
import UserRouter from "./routes/UserRouter/UserRoutes.js";
import router from "./routes/routes.js";
import dbConnection from "./db/mongoConnect.js";
import dns from "dns"
import cookieParser from "cookie-parser"

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();
dbConnection();
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(urlencoded({extended:true}));
app.use(json());
app.use(cookieParser())
app.use("/" , router);

const PORT = process.env.PORT;
app.listen(PORT,() => { 
    console.log(chalk.bgGreen(`server is up and running... on port ${PORT}`));
});