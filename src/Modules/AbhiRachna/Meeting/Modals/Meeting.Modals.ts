
import mongoose from "mongoose";
import {Types} from "mongoose"

export interface Meeting {
  date: string;
  starttime: string;
  endtime: string;
  leadId: Types.ObjectId;
  meetingType:"in-person" | "virtual" | "hybrid",
  status:"schedule" | "completed" | "cancelled" | "miss",
  createdBy:Types.ObjectId,
  createdAt: Date,
  updatedAt: Date,
  timeZone: string,
}



const MeetingSchema= new mongoose.Schema<Meeting>({
date:{
    type:String,
    required:true

},
starttime:{
    type:String,
    required:true

},
endtime:{
   type:String,
    required:false
},
leadId:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "Lead",
    required:true

},
timeZone:{
    type:String,
    required:true

},
meetingType:{
    type:String,
    enum:["in-person", "virtual", "hybrid"],
    required:true,
    default:"in-person"

},
status:{
    type:String,
    enum:["schedule", "completed", "cancelled", "miss"],
    required:true,
    default:"schedule"

},
createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref: "user"
}

},

  { timestamps: true })


export const MeetingModal = mongoose.model<Meeting>("Meeting", MeetingSchema);



