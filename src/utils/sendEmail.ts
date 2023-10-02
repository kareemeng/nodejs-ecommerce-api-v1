import nodemailer from "nodemailer";

const sendEmail = async (options: any) => {
  // create a transporter - transporter is a service that sends emails (gmail, sendgrid, mailgun, etc)
  // gmail must have "less secure app" option turned on in order to send emails
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST!,
    port: Number(process.env.MAIL_PORT!), // Number() is used to convert string to number
    secure: true, //process.env.MAIL_PORT! ? true : false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER!,
      pass: process.env.MAIL_PASSWORD!,
    },
  });
  // define the email options (subject, body, from, etc)
  const mailOptions = {
    from: `E-shop App <${process.env.MAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // actually send the email with nodemailer

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
