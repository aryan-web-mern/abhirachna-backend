import { getDateAccZone } from "../../utils/getDateAccZone";

export const generateMeetingMailHtml = (msg: any, customerTimeZone: string) => {
  console.log(msg, 'msg in generateMeetingMailHtml');
  const {
    dateAndTime,
    phone,
    message,
    name,
  } = msg;


  return `
  <div style="font-family: sans-serif; max-width: 800px; margin: auto; padding: 20px; border: 1px solid #ddd;">
    <h2 style="text-align: center; color: #007BFF;">Meeting Scheduled</h2>
    <p>A new meeting request has been submitted through the customer scheduling form. Please find the details below:</p>
    <p><strong>Customer Name:</strong> ${name || "-"}</p>
    <p><strong>Phone:</strong> ${phone || "-"}</p>
    <p><strong>Date and Time:</strong> ${getDateAccZone(dateAndTime, customerTimeZone) +" "+ customerTimeZone?.toLocaleUpperCase() || ""}</p>
    <p><strong>Message:</strong> ${message || ""}</p>
    <p>Please review the request and take appropriate action to confirm or follow up.</p>
    <p>Best regards,</p>
    <p>Thank you,</p>
    <p>Abhirachnaa Team</p>
  </div>`;
};
