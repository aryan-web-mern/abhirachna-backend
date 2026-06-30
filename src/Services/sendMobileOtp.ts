import axios from "axios";
import Appconfig from ".././Config/Appconfig"


const API_KEY= Appconfig.factor_api_key;

const TEMPLATE_NAME= Appconfig.template_name;



export const sendOtpSms = async (phoneNumber: number, otp: string): Promise<boolean> => {
  try {
    const url = `https://2factor.in/API/V1/${API_KEY}/SMS/${phoneNumber}/${otp}/${TEMPLATE_NAME}`;
    const response: any = await axios.get(url);

    if (response.data.Status === "Success") {
      return true;
    } else {
      console.error("2Factor Error:", response.data);
      return false;
    }
  } catch (error: any) {
    console.error("SMS send error:", error.message);
    return false;
  }
};