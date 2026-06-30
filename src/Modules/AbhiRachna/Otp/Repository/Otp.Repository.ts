import OtpModel from "../Modals/Otp.Modals";

export const deleteExistingOtp = async (params: { email?: string; phoneNumber?: number }) => {
  const { email, phoneNumber } = params;

  if (email) {
    await OtpModel.deleteMany({ email });
  } else if (phoneNumber) {
    await OtpModel.deleteMany({ phoneNumber });
  }
};

export const deleteOtp = async (query:any) => {
    await OtpModel.deleteMany(query);
};

export const createOtp = async (data: {
  phoneNumber?: number
  email?: string;
  otp: string;
  expiresAt: Date;
}) => {
  await OtpModel.create(data);
};

// export const findValidOtp = async (data: any) => {

//   return await OtpModel.findOne(data);
// };

export const findValidOtp = async (data: any) => {

  return await OtpModel.findOne(data);
};
