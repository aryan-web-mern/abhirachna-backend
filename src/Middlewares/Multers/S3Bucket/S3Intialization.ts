import { S3Client,GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv';

dotenv.config(); 

//---------------------------------------------------------------------------------------------
// Intialization of S3 client 

export const s3 = new S3Client({
    region:"ap-south-1", // Set your region
    credentials: {
      accessKeyId:process.env.S3_ACCESS_KEY!,
      secretAccessKey:process.env.S3_SECRET_KEY!,
    },
  });
  

  //---------------------------------------------------------------------------------------------

  // intialize to get the image from s3 using get url Object

  export const getObjectURL = async (key:string) => {
    const command = new GetObjectCommand({
      Bucket:process.env.S3_BUCKET_NAME,
      Key: key
    });
    const url = getSignedUrl(s3, command)
    return url;
  }



  

  //---------------------------------------------------------------------------------------------



