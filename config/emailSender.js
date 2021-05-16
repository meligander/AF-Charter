var nodemailer = require("nodemailer");
const path = require("path");

require("dotenv").config();

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
      html: `<div>${text}
      </div>
      <div style='text-align: center; width: fit-content; margin: 2rem 2rem 1rem'>
        <h3>AF Charter</h3>
        <p>1635 N Bayshore Dr, Miami, FL</p>
        <p>Phone: +1 (305) 377-7369</p>
        <a href="https://af-charter.herokuapp.com">https://af-charter.herokuapp.com</a>
    </div> 
      `,
   };

   transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
         console.error(error.message);
      } else console.log(info.response);
   });
};

module.exports = sendEmail;
