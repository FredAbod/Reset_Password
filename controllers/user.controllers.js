const { passwordHash, passwordCompare } = require("../helper/hashing");
const { Services } = require("../services/services");
const {
  signUpValidation,
  loginValidation,
  newPassValidation,
} = require("../validation/validation");
const nodemailer = require("nodemailer");
const { jwtSignAccess } = require("../helper/jwt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.models");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const otpGenerator = require("otp-generator");

exports.signUp = async (req, res) => {
  try {
    const { name, email, password, resetLink, otp } = req.body;
    const validation = signUpValidation(req.body);
    if (validation.error) {
      return res
        .status(400)
        .json({ message: validation.error.details[0].message });
    }

    const hashedPassword = await passwordHash(password);

    const data = {
      name,
      email,
      password: hashedPassword,
      resetLink,
      otp,
    };
    const new_user = await Services.signUp(data);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: "boluwatifefred@gmail.com",
      to: data.email,
      subject: ` You have signed up succesfully `,
      html: `
    <h2> Your signup details </h2>
    <p>User name: ${data.name} <br> Email: ${data.email}</p>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
      console.log("Email Sent to " + info.accepted);
    });
    return res
      .status(201)
      .json({ message: "user added successfully", new_user: new_user._id });
  } catch (error) {
    return res.status(500).json({ message: "Email Already Exist" });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validation = loginValidation(req.body);
    if (validation.error)
      return res
        .status(400)
        .json({ message: validation.error.details[0].message });
    const user = await Services.findUserByEmail({ email });
    const isMatch = await passwordCompare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = jwtSignAccess(payload);
    res.cookie("access_token", token, { httpOnly: true });
    const dataInfo = {
      status: "success",
      message: "Login successfully",
      access_token: token,
    };
    return res.status(200).json(dataInfo);
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  const user = User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ error: error.message, message: "user does not exist" });
  }
  const token = jwt.sign({ _id: user._id }, process.env.RESET_LINK_KEY, {
    expiresIn: process.env.RESET_LINK_KEY_TTL,
  });
  let OTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: "boluwatifefred@gmail.com",
    to: email,
    subject: ` Your Forgot Password Mail `,
    html: `
    <h2> Please click on the link to reset your passsowrd</h2>
    <p> ${process.env.CLIENT_URL}/resetpassword/${token}</p>
    <h2>You can also use your OTP</h2>
    <p>Here is your otp: ${OTP}</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    }
    console.log("Email Sent to " + info.accepted);
  });
  return user.updateOne({ resetLink: token, otp: OTP }, (err) => {
    if (err) {
      return res.status(400).json({ error: "reset password link error" });
    } else {
      return res.status(200).json({ message: "follow the instructions" });
    }
  });
};

exports.resetPassword = async (req, res, next) => {
  const { resetLink, newPass, email, otp } = req.body;
  try {
    const validation = newPassValidation(req.body);
    if (validation.error)
      return res
        .status(400)
        .json({ message: validation.error.details[0].message });
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(newPass, salt);
    if (resetLink) {
      jwt.verify(resetLink, process.env.RESET_LINK_KEY, (err) => {
        if (err) {
          return res
            .status(401)
            .json({ error: "Incorrect token or it is expired" });
        }
        User.findOne({ resetLink, otp }, (err, user) => {
          if (err || !user) {
            return res
              .status(400)
              .json({ error: "user with this token or otp does not exist" });
          }

          const obj = {
            password: hash,
          };

          user = _.extend(user, obj);
          user.save((err) => {
            if (err) {
              return res.status(400).json({ error: "reset password error" });
            } else {
              return res
                .status(200)
                .json({
                  message: "your password has been changed succesfully",
                });
            }
          });
        });
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER_MAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: "boluwatifefred@gmail.com",
        to: email,
        subject: ` Your Password has been updated `,
        html: `
      <h2> Here's your new password </h2>
      <p> new password: ${newPass}</p>
      `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        }
        console.log("Email Sent to " + info.accepted);
      });
    } else {
      return res.status(401).json({ error: "authentication error" });
    }
  } catch (error) {
    next(error);
  }
};


