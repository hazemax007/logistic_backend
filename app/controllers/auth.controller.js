var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var nodemailer = require('nodemailer');
var randomstring = require('randomstring');
const db = require("../models");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
const config = require("../config/auth.config");
const configMail = require('../config/nodemailer.config');

exports.signup = (req, res) => {
  const verifyToken = jwt.sign({ email: req.body.email }, config.secret);
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    verifyToken: verifyToken
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User registered successfully!" });
            sendConfirmationEmail(user.username, user.email, user.verifyToken);
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User registered successfully! Please check your email inbox to verify your account " });
          sendConfirmationEmail(user.username, user.email, user.verifyToken);
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      if (user.status === "Pending") {
        return res.status(401).send({
          message: "Pending Account. Please Verify Your Email!",
        });
      }

      if (user.status === "Inactive") {
        return res.status(401).send({
          message: "Inactive Account. Please contact the administrator.",
        });
      }

      const token = jwt.sign({ id: user.id },
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: 86400, // 24 hours
                              });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { verifyToken: req.params.verifyToken }
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    user.status = "Active";
    await user.save();

    res.status(200).send({ message: "User has been verified successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ where: { email: email } }); // Sequelize's equivalent to findOne

    if (userData) {
      const randomString = randomstring.generate();
      await User.update(
        { resetToken: randomString },
        { where: { email: email } }
      ); // Sequelize's equivalent to updateOne

      sendResetPasswordMail(userData.username, userData.email, randomString);
      res.status(200).send({ success: true, msg: "Please check your inbox or spam folder and reset your password." });
    } else {
      res.status(404).send({ success: false, msg: "This email does not exist." }); // Adjusted status code
    }
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message }); // Adjusted status code
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const resetToken = req.query.resetToken;
    const tokenData = await User.findOne({ where: { resetToken: resetToken } }); // Sequelize's equivalent to findOne

    if (tokenData) {
      const password = req.body.password;
      const newPassword = bcrypt.hashSync(password, 8);
      
      const userData = await User.update(
        { password: newPassword, resetToken: '' },
        { where: { id: tokenData.id }, returning: true }
      ); // Sequelize's equivalent to findByIdAndUpdate
      
      res.status(200).send({ success: true, msg: "User password has been reset", data: userData[1][0] });
    } else {
      res.status(404).send({ success: false, msg: "This token has expired" }); // Adjusted status code
    }
  } catch (error) {
    res.status(500).send({ success: false, msg: error.message }); // Adjusted status code
  }
};

const sendConfirmationEmail = (name, email, verifyToken) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hazembensalem77@gmail.com', // Update with your email
      pass: 'efcrbuwgbygwxcvs' // Update with your password
    }
  });

  transporter.sendMail({
    from: configMail.emailUser,
    to: email,
    subject: "Please confirm your account",
    html: `<h1>Email Confirmation</h1>
      <h2>Hello ${name}</h2>
      <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
      <a href=http://localhost:3000/account-verification/${verifyToken}> Click here</a>
      </div>`,
  }).catch(err => console.log(err));
};

const sendResetPasswordMail = async (name, email, resetToken) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: 'hazembensalem77@gmail.com', // Update with your email
        pass: 'efcrbuwgbygwxcvs' // Update with your password
      }
    });

    const mailOptions = {
      from: configMail.emailUser,
      to: email,
      subject: 'Reset Password',
      html: `<p>Hii ${name}, Please copy the link and <a href="http://localhost:3000/reset-password?resetToken=${resetToken}">reset your password</a></p>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail has been sent: ", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

