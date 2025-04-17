import pkg from 'winston'
const { createLogger, format, transports, info } = pkg
import winstonDaily from 'winston-daily-rotate-file'
import moment from 'moment'
import fs from 'fs'
import 'moment-timezone'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const { combine, printf } = format
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logDir = __dirname + "/logs"

const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: 'logs/Test-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxFiles: '14d'
})

moment.tz.setDefault('Asia/Seoul')
const timestemp = () => moment().format('YYYY-MM-DD HH:mm:ss')

const loggingFormat = printf(({ level, message }) => {
    return `${timestemp()} ${level} ${message}`
})

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
}

const infoTransport = new transports.Console({
    level: 'info'
})

const errorTransport = new transports.Console({
    level: 'error'
})

const logger = createLogger({
    format: combine(loggingFormat),
    transports: [infoTransport, errorTransport, dailyRotateFileTransport]
})

const stream = {
    write: message => {
        logger.info(message)
    }
}

export { logger, stream }

