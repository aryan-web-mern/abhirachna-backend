import mongoose from "mongoose";
import Appconfig from "./Appconfig";
import MongoStore from "connect-mongo";
import { MongoClient } from "mongodb";
const tables =['leads','leadbasicdetails']



// MongoDB connection URI
const uri = Appconfig.databaseUrl;
// const sessionuri = Appconfig.session_url;
async function connectToMongoDB() {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(uri,{retryWrites: true});
    console.log("Connected to MongoDB with Mongoose!");

  } catch (error: any) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error(error)
  }
}


export const isValidObjectId= (id:string)=> {
  return mongoose.Types.ObjectId.isValid(id);
}

// Exporting the function for connection
export default connectToMongoDB;


