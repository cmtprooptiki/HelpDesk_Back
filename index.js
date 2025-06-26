import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import db from "./config/database.js"
import SequelizeStore from "connect-session-sequelize"
import session from "express-session";
import cors from "cors"
// var express = require("express");
// var bodyParser = require("body-parser");
import testRouter from "./routes/test_route.js";
import userRouter from "./routes/user_route.js";
import authRouter from "./routes/auth_route.js";
import issuesRouter from "./routes/issue_route.js"
import organizationsRouter from "./routes/organization_route.js";
import indicatorRouter from "./routes/indicator_route.js"
import category_Router from "./routes/category_route.js";
import solutionRouter from "./routes/solution_route.js";
import report_router from "./routes/report_route.js"

import Users from "./models/user_model.js";
import Organizations from "./models/organization_model.js";
import Issues from "./models/issue_model.js";
import Indicators from "./models/indicators_model.js";
import IndicatorsHasIssues from "./models/indicators_issues_model.js";
import Categories from "./models/category_model.js";
import Solutions from "./models/solution_model.js";


dotenv.config()

const app = express();

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));


const sessionStore=SequelizeStore(session.Store);
const store = new sessionStore({
    db:db
});

(async()=>{
    //await db.sync();
    await Users.sequelize.sync();  
    await Organizations.sequelize.sync();
    await Issues.sequelize.sync();
    await Indicators.sequelize.sync();
    await IndicatorsHasIssues.sequelize.sync();
    await Categories.sequelize.sync();
    await Solutions.sequelize.sync();
})();



app.use(session({
    secret:process.env.SESS_SECRET,
    resave:false,
    saveUninitialized:false,
    store:store,
    cookie:{
        secure:false,
        httpOnly:true,
        sameSite:"lax",
        maxAge: 24 * 60 * 60 * 1000,
    }
}))

app.use(cors({
    credentials:true,
    origin:'http://localhost:3000',
    
})); 

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Frontend URL
    res.header('Access-Control-Allow-Credentials', 'true');  // Allow cookies
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use(express.json());
app.use(testRouter);
app.use(userRouter);
app.use(authRouter);
app.use(issuesRouter);
app.use(organizationsRouter);
app.use(indicatorRouter);
app.use(category_Router);
app.use(solutionRouter);
app.use(report_router);

// var routes = require("./routes/routes.js")(app);

var server = app.listen(process.env.APP_PORT, function () {
    console.log("Listening on port %s...", server.address().port);
});   

// app.listen(process.env.APP_PORT,()=>{
//     console.log("Listening on port %s...", server.address().port);
// });