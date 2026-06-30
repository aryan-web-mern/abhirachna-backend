
export const generateContactMsgMailHtml = (msg: any) => {
    console.log(msg, 'msg in generateMeetingMailHtml');
    const {
        phoneNumber,
        message,
        name,
    } = msg;

    const capitalizeFirst = (str: string = "") =>
        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    return `
  <div style="font-family: sans-serif; max-width: 800px; margin: auto; padding: 20px; border: 1px solid #ddd;">
    <h3>New Contact Us Message</h3>
    <p><strong>Name:</strong> ${capitalizeFirst(name) || "N/A"}</p>
    <p><strong>Phone Number:</strong> ${phoneNumber || "N/A"}</p>
    <p><strong>Message:</strong></p>
    <p>${message || "No message provided."}</p>
    <br/>
    <p>Best regards,</p>
    <p>Thank you,</p>
    <p><strong>Abhirachnaa Team</strong></p>
  </div>`;
};
