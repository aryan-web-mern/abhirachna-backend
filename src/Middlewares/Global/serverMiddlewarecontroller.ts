// import session from "express-session";
// import { v4 as genuuidv4 } from "uuid";
// import { dbsessionstore } from "../../Config/db"
// import Appconfig from "../../Config/Appconfig";

// const sessionMiddleware =  session({
//     genid: (req) => genuuidv4(),
//     store: dbsessionstore,
//     secret: Appconfig.session_secret,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       path:"/",
//       httpOnly: true,
//       secure: Appconfig.environment === "production",
//       // secure: true,
//       maxAge: 1000 * 60 * 60 * 24 * 60,
//       sameSite: Appconfig.environment === "production" ? "strict" : "lax",
//       // sameSite: "none",
//     },
//   });





//   export {sessionMiddleware};