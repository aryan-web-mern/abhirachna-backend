import { AuthenticatedRequest } from '../types/types'
import winston from 'winston';


function setLogger({ req, errType = "" }: { req?: AuthenticatedRequest; errType?: string }): winston.Logger {
    // currently return for lead
    let type = req?.headers["x-upload-type"] ? "lead" : errType === "processError" ? "processError" : "web"
    let filename = 'error.log';

    switch (type) {
        case "lead":
            filename = "leadErrors.log"
            break;
        case "web":
            filename = "webErrors.log"
            break;
        case "processError":
            filename = "error.log"
            break;
    }
    console.log("filename", filename)
    return winston.createLogger({
        level: 'error',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        transports: [
            new winston.transports.File({ filename: filename, level: 'error' }),
        ],
    });
}

export default setLogger;