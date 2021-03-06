var nodemailer = require("nodemailer");

require("dotenv").config();

const stamp = `<div style='text-align: center; width: fit-content; margin: 2rem 2rem 1rem'>
<h3 style='color: #15767c' >AF Charter</h3>
<p>1635 N Bayshore Dr, Miami, FL</p>
<p>+1 (305) 377-7369</p>
<a href="https://af-charter.herokuapp.com">www.af-charter.herokuapp.com</a>
</div>`;

const sendEmail = (user_email, subject, text) => {
   const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
         user: process.env.EMAIL,
         pass: process.env.EMAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
   });

   const mailOptions = {
      from: `AF Charters <${process.env.EMAIL}>`,
      to: user_email,
      subject,
      text,
      html: `<div>${text}</div>${stamp}`,
   };

   transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
         console.error(error.message);
      } else console.log(info.response);
   });
};

const sentToCompany = (message) => {
   const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
         user: process.env.EMAIL,
         pass: process.env.EMAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
   });

   const mailOptions = {
      to: process.env.EMAIL,
      subject: "Contact Form Message",
      message,
      html: `<div>${message}</div>${stamp}`,
   };

   transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
         console.error(error.message);
      } else console.log(info.response);
   });
};

module.exports = { sendEmail, sentToCompany };
