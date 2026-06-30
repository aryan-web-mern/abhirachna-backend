import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Define Type for Email Options
export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments: any
}



// const template = handlebars.compile(source);

async function sendEmail({ to, subject, text, html, attachments }: SendEmailOptions): Promise<void> {
 
  const mailOptions :any= {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html:html,
    attachments,
  };

  //  console.log(mailOptions)
  await transporter.sendMail(mailOptions);
}

export default sendEmail;
