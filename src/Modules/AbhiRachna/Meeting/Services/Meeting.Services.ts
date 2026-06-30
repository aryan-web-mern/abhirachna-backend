
import { Types } from "mongoose";
import { completeMeetingRepo, createMeetingRepo, deleteMeetingRepo, editMeetingRepo, getLeadNumberAndNameRepo, getMeetingListByMonthRepo, getMeetingsByDateRepo } from "../Repository/Meeting.Repository";

export const createMeetingServices = async (meetingData: {
  date: string;
  starttime: string;
  meetingType: "in-person" | "virtual" | "hybrid";
  leadId: Types.ObjectId;
  userId: string;
  timeZone: string;
  userDesignation?: string;
}) => {
  try {
    const { date, starttime, meetingType, leadId, userId, timeZone } = meetingData;

    const newMeeting = await createMeetingRepo({
      date,
      starttime,
      meetingType,
      leadId,
      userId,
      timeZone,
      userDesignation: meetingData.userDesignation
    });

    return newMeeting;
  } catch (error: any) {
    throw new Error(error?.message || "Error creating meeting");
  }
};


export const completeMeetingServices = async (meetingId: string, userId: string, leadId: string) => {
  try {
    const updatedMeeting = await completeMeetingRepo(meetingId, userId, leadId);
    return updatedMeeting;
  } catch (error) {
    throw new Error("Error completing meeting");
  }
};

export const getLeadNumberAndNameService = async (userId: string, page: number, limit: number, designation: string, key: string) => {
  try {
    const leadInfo = await getLeadNumberAndNameRepo(userId, page, limit, designation, key);
    return leadInfo;
  } catch (error) {
    throw new Error("Error retrieving lead information");
  }
};


export const getMeetingListByMonthService = async (userId: string, date: string, userDesignation: string) => {
  try {
    const meetingsData = await getMeetingListByMonthRepo(userId, date, userDesignation);
    return meetingsData;
  } catch (error) {
    throw new Error("Error retrieving lead information");
  }
};

export const getMeetingListByDateService = async (userId: string, date: string, designation: string) => {
  try {
    const meetingsData = await getMeetingsByDateRepo(userId, date, designation);
    return meetingsData;
  } catch (error) {
    throw new Error("Error retrieving lead information");
  }
};


export const EditMeetingServices = async (meetingId: string, date: string, starttime: string, meetingType: "in-person" | "virtual" | "hybrid", userId: string, role: string) => {
  try {
    const updatedMeeting = await editMeetingRepo(meetingId, date, starttime, meetingType, userId, role);
    return updatedMeeting;
  } catch (error:any) {
    throw new Error(error?.message || "Error editing meeting");
  }
};  



export const deleteMeetingServices = async (meetingId: string, userId: string, role: string) => {
  try {
    const result = await deleteMeetingRepo(meetingId, userId, role);   
    return result;
  } catch (error) {   

    throw new Error("Error deleting meeting");
  } 

}