import { SESClient } from "@aws-sdk/client-ses";
import dotenv from 'dotenv'

dotenv.config()

const sesClient = new SESClient({
    region: process.env.AWS_SES_REGION,
    credentials: {
        accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY
    }
});
export { sesClient }