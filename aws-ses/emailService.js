import * as aws from '@aws-sdk/client-ses'
import nodemailer from 'nodemailer'

const ses = new aws.SES({
  region: process.env.AWS_SES_REGION,
  credentials: {
      accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY
  }
})

const transporter = nodemailer.createTransport({
  SES: {ses, aws},
  sendingRate: 1,
  maxConnections: 1
})

const deliverEmail = (toAddresses, fromAddress, subject, htmlContents) => {
  return new Promise(async (resolve, reject) => {
    transporter.sendMail(
    {
      from: fromAddress,
      to: toAddresses,
      subject,
      html: htmlContents
    },
    (err, info) => {
      transporter.close();
      resolve(true);
      if (err) {
        console.error(err);
      } else {
        console.log(new Date().toLocaleString(), info?.envelope);
        console.log(info?.messageId);
      }
    }
    );
    resolve(true);
  });
};

    
export const deliverHandler = async (contents) => {
  const mailInfo = [
    'kmy@4grit.com',
    'noreply@4grit.com',
    '', contents
  ]
  try {
    const result = await deliverEmail(...mailInfo)
    console.log(result)
  } catch (err) {
    console.log(err)
  }
}