import { generateContactMsgMailHtml } from  "../../../../Services/templates/contactUsMail"
import sendEmail, { SendEmailOptions } from "../../../../Services/mailer";
import { sendMeetingMailToAdmn } from "../../../../Services/sendMeetingMailToAdmn"
import { createSupportMsg, scheduleMeeting } from "../Repository/Support.Repository";

export const saveUserMsgService = async (data: any) => {
  try {
    const msg = await createSupportMsg(data);
    const htmlContent = generateContactMsgMailHtml(msg);

    const mailPayload: any = {
      to: "abhirachnaasolutions@gmail.com.rani@psquarecompany.com",
      subject: "ContactUs Message",
      html: htmlContent,
    };

    sendEmail(mailPayload)

  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};

export const scheduleMeetingService = async (data: any) => {
  try {
    const msg = await scheduleMeeting(data);
    sendMeetingMailToAdmn(msg, data?.customerTimeZone)
    return msg;
  } catch (err: any) {
    throw new Error("Service error: " + err.message);
  }
};