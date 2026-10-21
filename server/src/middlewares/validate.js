import chalk from "chalk";

export const validate = (schema) => async (req, res, next) => {
  try{
    console.log("old body - ", req.body);
    const result = await schema.safeParseAsync(req.body);
    if (!result.success) {
      console.log(chalk.cyan(JSON.stringify(result, null, 2)));
      console.log(chalk.redBright("fail to register"));
        const issueErrors = result.error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          }));

        return res.status(400).json({
              success: false,
              message: "Validation Error",
              errors: issueErrors,
        });
    }
    req.body = result.data;
    console.log("new body - ", req.body);
    next();
  }
  catch(err){
    console.log(chalk.redBright(err));
  }
};
