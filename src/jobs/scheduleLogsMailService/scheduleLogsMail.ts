// import cron from 'node-cron';
// import fs from 'fs'; // Node.js Promise-based file system
// import moment from 'moment-timezone';
// import path from 'path';
// import sendEmail from '../../Services/mailer'
// import { __dirname } from '../../utils/dirname';


// function removeFile(filePath: string) {
// 	fs.unlink(filePath, (err) => {
// 		if (err) {
// 			console.error('Error deleting errors log file:', err);
// 			return;
// 		}
// 		console.log('Error Logs File deleted successfully!');
// 	});
// }


// function saveAsText(logs: any, output: string) {
// 	const content = logs
// 		.map((log: any) => JSON.stringify(log))
// 		.join("\n");

// 	fs.writeFileSync(output, content, "utf8");
// }


// async function safeReadFile(filePath: string) {
// 	try {
// 		if (!fs.existsSync(filePath)) {
// 			console.warn(`File not found: ${filePath}`);
// 			return [];
// 		}

// 		const content = fs.readFileSync(filePath, "utf8").trim();
// 		if (!content) return [];

// 		return content
// 			.split("\n")
// 			.filter((line) => line.trim() !== "")
// 			.map((line) => {
// 				try {
// 					return JSON.parse(line);
// 				} catch (err) {
// 					console.error(`Failed to parse line: ${line}`);
// 					return null;
// 				}
// 			})
// 			.filter((entry) => entry !== null);
// 	} catch (err: any) {
// 		if (err.code === 'ENOENT') {
// 			return null;
// 		}
// 		throw err;
// 	}
// }


// const myAsyncFunction = async () => {
// 	const file1Path = path?.join(__dirname, '../../error.log');
// 	const file2Path = path?.join(__dirname, '../../webErrors.log');

// 	const [file1Content, file2Content] = await Promise.all([
// 		safeReadFile(file1Path),
// 		safeReadFile(file2Path)
// 	]);
// 	const merged = [...(file1Content ?? []), ...(file2Content ?? [])];

// 	saveAsText(merged.length>0?merged:[], "LogsFile.txt")

// 	const mailPayload: any = {
// 		to: "abhirachnaasolutions@gmail.com.rani@psquarecompany.com",
// 		subject: "Last 1 day error Logs file of Abhirachnaa website",
// 		text: "Hi,\n\nPlease find attached the Error logs file of Abhirachnaa Website.It contains error logs of last 1 day.\n\nRegards,\nAutomation Bot",
// 		attachments: [
// 			{
// 				filename: "LogsFile.txt",
// 				path: path.join(__dirname, "../../LogsFile.txt"),
// 			},
// 		],
// 	};
// 	await sendEmail(mailPayload);
// 	removeFile(file1Path)
// 	removeFile(file2Path)
// 	console.log("job Error Logs Email Sent! *****************")
// 	return;
// };


// export const scheduleLogsMail = () => {
// 	cron.schedule('30 15 * * *', async () => {
// 		console.log('run ccronv')
// 		const time = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
// 		console.log(`Cron job ran at ${time} IST`);
// 		try {
// 			const result = await myAsyncFunction();
// 		} catch (err) {
// 			console.error('Scheduled job failed:', err);
// 		}
// 	}, {
// 		timezone: 'Asia/Kolkata'
// 	});
// }

