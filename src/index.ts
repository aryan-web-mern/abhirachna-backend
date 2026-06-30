// src/server.ts

import multer from "multer";
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { createServer as httpcreateServer } from "node:http";
import logger from "./Logger/logger";

import { ServerError } from "./Error/ServerError";
import AuthRoutes from './Modules/AbhiRachna/Auth/Routes'
import DesignationRoutes from './Modules/AbhiRachna/Desigantion/Routes'
import OtpRoutes from './Modules/AbhiRachna/Otp/Routes'
import LeadRoutes from './Modules/AbhiRachna/Leads/Routes'
import TalkinLeadRoutes from './Modules/AbhiRachna/TalkingLead/Routes'
import DesignRoutes from './Modules/AbhiRachna/Design/Routes'
import DirectorRoutes from './Modules/AbhiRachna/Director/Routes'
import NegoationRoutes from './Modules/AbhiRachna/Negotiation/Routes'
import ClosedRoutes from './Modules/AbhiRachna/Closed/Routes'
import EstimateRoutes from './Modules/AbhiRachna/Estimate/Routes'
import MeetingRoute from "./Modules/AbhiRachna/Meeting/Routes";
// import connectToMongoDB from "Config/db";
import Appconfig from "./Config/Appconfig";
import connectToMongoDB from "./Config/db";
import { LeadBasicDetailsModel, LeadModel } from "./Modules/AbhiRachna/Leads/Modals/Leads.Modals";
import WebsiteRoutes from "./Modules/Website/website.routes"
import AbhirachnaaLeadRoutes from './Modules/AbhiRachna/abhirachnaa.routes'
import surveyorRouters from "./Modules/Surveyor/surveyor.routes"
import ImageRouter from "./Middlewares/Multers/Router"
import sendEmail from "./Services/mailer";
import { getAllLeadRepoByStatus } from "./Modules/AbhiRachna/Leads/Repository/Leads.Repository";
import { NotFound } from "./Error/NotFound";
import { startConsuming } from "./RabbitMq/consumer";
import { AuthenticatedRequest } from "./types/types";
import setLogger from "./Logger/logger";
// import { scheduleLogsMail } from "./jobs/scheduleLogsMailService/scheduleLogsMail";





// Online Javascript Editor for free
// Write, Edit and Run your Javascript code using JS Online Compiler

/* ------------------------ PROCESS LEVEL ERROR HANDLERS ------------------------ */
process.on("unhandledRejection", (err: any) => {
  console.error("Unhandled Rejection:", err?.name, err?.message);
  setLogger({ errType: "processError" })?.log('error', 'unhandle error', { message: err })
  setTimeout(() => process.exit(1), 100);
});

process.on("uncaughtException", (err: any,
  res: Response) => {
  console.error("Uncaught Exception:", err?.name, err?.message);
  setLogger({ errType: "processError" })?.log('error', 'uncaughtException', { message: err })
  setTimeout(() => process.exit(1), 1000);
});

/* ------------------------ APP INITIALIZATION ------------------------ */
const app = express();
const appserver = httpcreateServer(app);

const corsOptions = {
  origin: ["https://www.abhirachnaa.com","https://dashboard.abhirachnaa.com","https://abhirachnaa.com","https://www.dashboard.abhirachnaa.com",   "https://chat.abhirachnaa.com",
    "https://www.chat.abhirachnaa.com"],
  credentials: true,
};






/* ------------------------ MIDDLEWARE ------------------------ */
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cookieParser());
app.use(morgan("common"));
app.use(cors());


// Add more routes here... here 
app.use(`${Appconfig.api_prefix}/auth`, AuthRoutes);
app.use(`${Appconfig.api_prefix}/designation`, DesignationRoutes)
app.use(`${Appconfig.api_prefix}/otp`, OtpRoutes)
app.use(`${Appconfig.api_prefix}/lead`, LeadRoutes)
app.use(`${Appconfig.api_prefix}/lead/talking`, TalkinLeadRoutes)
app.use(`${Appconfig.api_prefix}/lead/design`, DesignRoutes)
app.use(`${Appconfig.api_prefix}/director`, DirectorRoutes)
app.use(`${Appconfig.api_prefix}/negotiation`, NegoationRoutes)
app.use(`${Appconfig.api_prefix}/lead/closed`, ClosedRoutes)
app.use(`${Appconfig.api_prefix}/website`, WebsiteRoutes)
app.use(`${Appconfig.api_prefix}/s3`, ImageRouter)
app.use(`${Appconfig.api_prefix}/estimate`, EstimateRoutes)


// Abhirachnaa Routes
app.use(`${Appconfig.api_prefix}/abhirachnaa`, AbhirachnaaLeadRoutes)
app.use(`${Appconfig.api_prefix}/meeting`, MeetingRoute);

// Surveyor Routes
app.use(`${Appconfig.api_prefix}/surveyor`, surveyorRouters)



// /* ------------------------ ERROR HANDLING ------------------------ */

app.use(NotFound);
app.use(ServerError);

app.use((
  err: any,
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  setLogger({ req })?.log('error', `statusCode-${res.statusCode} in url- ${req.url}, req-method- ${req.method}`, { message: err });
  res.status(500).json({ message: err?.message || 'Internal Server Error' });
});


app.use((err:any, req:any, res:any, next:any) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (err.message.includes("File too large")) {
    return res.status(413).json({ message: "File exceeds 10MB limit" });
  }
  console.error("Unexpected upload error:", err);
  return res.status(500).json({ message: "File upload failed" });
});

/* ------------------------ DB + SERVER START ------------------------ */
(async () => {
  try {
    await connectToMongoDB();
  } catch (error: any) {
    console.error("Failed to connect to MongoDB:", error?.message || error);
  }

  try {
    await startConsuming();
  } catch (error: any) {
    console.error("Failed to start RabbitMQ consumer:", error?.message || error);
  }
})();

appserver.listen(Appconfig.port, () => {
  console.log(` Server is running on port ${Appconfig.port}`);
  if ((process.env.S3_ENV === "Development")) {
    console.log("job runsssssss***********")
    // scheduleLogsMail();
  }

});







