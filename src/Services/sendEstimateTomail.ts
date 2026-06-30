import { sendToQueue } from  "../RabbitMq/producer"
import { generateEstimateHtml } from "./getEstimateTemplate";
import sendEmail from "./mailer";


export const sendEstimateToAdmin = async (estimateData: any) => {

  const plainEstimate=estimateData?.toObject(); 




    
  const htmlContent = generateEstimateHtml(plainEstimate);

  const mailPayload: any = {
      to:"abhirachnaasolutions@gmail.com.rani@psquarecompany.com",
      subject:"New Estimate Or Lead",
      text:"New Estimate or Lead Data Mentioned",
      html:htmlContent,
    };
await sendToQueue(mailPayload)

};
