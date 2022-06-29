import "dotenv/config";
import nodemailer from "nodemailer";
/**
 * -Create a Nodemailer transporter using either SMTP or some other transport mechanism
- Set up message options (who sends what to whom)
- Deliver the message object using the sendMail() method of your previously created transporter
 */

// create the transporter
function createTransport() {
  let transporter = nodemailer.createTransport({
    // host: "smtp.ethereal.email",
    // port: 587,
    service: "gmail",
    // host: 'smtp.gmail.com',
    // secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.GUSER, // generated ethereal user
      pass: process.env.GPASS, // generated ethereal password
    },
  });
  return transporter;
}
async function sendWelcomeEmail() {
  // send mail with defined transport object
  let info = await createTransport().sendMail({
    from: "nodegmailer", // sender address
    to: `dumbskull3@gmail.com`, // list of receivers
    subject: "Welcome", // Subject line
    text: "Welcome to TaskApp!", // plain text body
    // html: "<b>Hello world?</b>", // html body
  });
  return info.messageId;
}
async function sendCancelEmail() {
  // send mail with defined transport object
  let info = await createTransport().sendMail({
    from: "nodegmailer", // sender address
    to: `dumbskull3@gmail.com`, // list of receivers
    subject: "Welcome", // Subject line
    text: `Goodbye! Hope to see you back soon.`, // plain text body
    // html: "<b>Hello world?</b>", // html body
  });
  return info.messageId;
}

// // main().then(()=>console.log('mail was sent!')).catch(console.error);
export { sendWelcomeEmail, sendCancelEmail };
