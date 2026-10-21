import chalk from "chalk";
import mongoose from "mongoose"

export default async function dbConnection(){
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(chalk.cyan(`🚀 MongoDB Connected: ${conn.connection.host} 🔗`));
    }
    catch(error){
        console.log(chalk.redBright(`errors:${error}`));
    }
}