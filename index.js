
import express from "express";
import { dbConnection } from "./config/db.js";
import expressOasGenerator from "@mickeymond/express-oas-generator";
import cors from "cors";
import errorHandler from "errorhandler";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import userRouter from "./routes/user_route.js";
import { restartServer } from "./restart_server.js";
import { profileRouter } from "./routes/profile_route.js";



//  instantiate express
const app = express();

expressOasGenerator.handleResponses(app, {
    alwaysServeDocs: true,
    tags: ['users', "profiles"],
    mongooseModels: mongoose.modelNames(),
});

//  create a db connection
// dbConnection();


// Use middlewares
app.use(cors({ credentials: true, origin: '*' }));
app.use(express.static("upload"));


app.use(express.json());
// use session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL
    })
}));

// Use routes
app.use("/api/v1", userRouter);
app.use('/api/v1', profileRouter);


//  handle all documentation
expressOasGenerator.handleRequests();
app.use((req, res) => res.redirect('/api-docs/'));
app.use(errorHandler({ log: false }));


const reboot = async () => {
    setInterval(restartServer, process.env.INTERVAL)
};


//  create a db connection and lsiten to app on port

dbConnection()
.then(() => {
  const PORT = process.env.PORT || 3550;
  app.listen(PORT, () => {
    reboot().then(() => {
      console.log(`Server Restarted`);
    });
    console.log(`App is listening on port ${PORT}`);
  });
})
.catch((err) => {
  console.log(err);
  process.exit(-1);
});

// create a port
// const port = process.env.PORT || 3550;

// listen on port
// app.listen(port, () => {
//     console.log(`App is listening at port ${port}!`)
// });