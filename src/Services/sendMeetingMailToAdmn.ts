import sendEmail from "./mailer";
import { generateMeetingMailHtml } from "./templates/meetingMailTemplate";

export const sendMeetingMailToAdmn = async (msg: any, customerTimeZone: string) => {
const plainMsg=msg?.toObject(); 
    
  const htmlContent = generateMeetingMailHtml(plainMsg, customerTimeZone);

  const mailPayload: any = {
      to:"abhirachnaasolutions@gmail.com.rani@psquarecompany.com",
      subject:"New Meeting Request Submitted",
      html:htmlContent,
    };

sendEmail(mailPayload)


};
