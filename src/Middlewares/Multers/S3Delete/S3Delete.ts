
import dotenv from 'dotenv';
dotenv.config(); 
import { s3 } from "../S3Bucket/S3Intialization";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const bucketName = process.env.S3_BUCKET_NAME!

export async function deleteFromS3(key: string): Promise<void> {
	try {
		if (!bucketName) throw new Error('Bucket name not defined');

		if (!key) {
			throw new Error('No key provided to delete from S3.');
		}
		const params = {
			Bucket: bucketName,
			Key: key
		};
		const command = new DeleteObjectCommand(params);
		await s3.send(command);
		console.log(`Deleted file ${key} from bucket ${bucketName}`);
	} catch (error) {
		console.error(`Error deleting file ${key} from bucket ${bucketName}:`, error);
		throw error; // optionally rethrow or handle gracefully
	}
}