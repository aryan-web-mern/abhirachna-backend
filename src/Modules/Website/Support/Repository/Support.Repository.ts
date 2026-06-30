import { SupportMsgModel, ScheduledMeetingModel} from "../Modals/Support.Modals";

export const createSupportMsg = async (data: any) => {
  try {
    return await SupportMsgModel.create(data);
  } catch (err: any) {
    throw new Error("Repo error: " + err.message);
  }
};

export const scheduleMeeting = async (data: any) => {
  try {
    return await ScheduledMeetingModel.create(data);
  } catch (err: any) {
    throw new Error("Repo error: " + err.message);
  }
};