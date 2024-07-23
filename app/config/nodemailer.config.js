const nodemailer = require("nodemailer");
const config = require("../config/auth.config");

const user = config.emailUser;
const pass = config.emailPassword;

const transport = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    requireTLS:true,
    auth:{
      user:user,
      pass:pass
    }
  })

exports.sendConfirmationEmail = (name, email, verifyCode) => {
    transport.sendMail({
      from: user,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
          <a href=http://localhost:3000/account-verification/${verifyCode}> Click here</a>
          </div>`,
    }).catch(err => console.log(err));
  };