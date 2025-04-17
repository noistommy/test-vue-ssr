import { SendEmailCommand } from "@aws-sdk/client-ses"
import { sesClient } from "../lib/sesClient.js"

const emailCommend = (toAddress, fromAddress, htmlContents)  => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: htmlContents,
        },
        Text: {
          Charset: "UTF-8",
          Data: "htmlContents",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "aws-ses testing",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  })
  
} 
const emailHandler = async(contents) => {
  const sendEmailCommend = emailCommend(
    'kmy@4grit.com',
    'noreply@4grit.com',
    contents
  )
  try {
    const sendResponse = await sesClient.send(sendEmailCommend)
    console.log(sendResponse)
  } catch (err) {
    console.error('Error sending email', err)
  }
}

// emailHandler()
export default emailHandler