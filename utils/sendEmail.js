'use strict';
const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (options) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();


  // create NODEMAILER transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST_MAILTRAP,
    port: process.env.SMTP_PORT_MAILTRAP,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL_MAILTRAP, // generated ethereal user
      pass:process.env.SMTP_PASSWORD_MAILTRAP, // generated ethereal password
    },
  });


  // // GMAIL 
  // let transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: process.env.GMAIL_EMAIL,
  //     pass: process.env.GMAIL_PASSWORD,
  //   },
  // });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // sender address
    to: `${options.email}`, // list of receivers
    subject: `${options.subject}`, // Subject line
    text: `${options.message}`, // plain text body
    html: `${options.message}`, // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

// sendEmail().catch(console.error);

module.exports = sendEmail;
