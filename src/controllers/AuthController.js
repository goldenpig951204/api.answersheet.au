const crypto = require("node:crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transporter = require("../services/mail");
const UserModel = require("../models/UserModel");
const EmailVerifyModel = require("../models/EmailVerifyModel");
const { findOne } = require("../models/UserModel");

const register = async (req, res) => {
    let data = req.body;
    try {
        let salt = bcrypt.genSaltSync(10);
        data.password = bcrypt.hashSync(data.password, salt);
        let user = await UserModel.findOne({email: data.email});
        if (user) {
            res.json({
                success: false,
                data: {
                    msg: "The email address already exist."
                }
            });
        } else {
            let { email } = await UserModel.create(data);
            let buffer = await crypto.randomBytes(30);
            let token = buffer.toString('hex');
            await EmailVerifyModel.create({
                email: email,
                token: token
            });
            // await transporter.sendMail({
            //     from: process.env.SMTP_USER,
            //     to: email, 
            //     subject: "Welcome to register on our website!",
            //     html: `
            //         <h1>You are nearly there!</h1>
            //         <p>Please verify your email address to log in and get started.</p>
            //         <a href='http://localhost:3000/verify-email/${token}'>Verify Email</a>
            //     `
            // });

            res.json({
                success: true,
                data: { 
                    msg: "Successfully registered, please check your email.",
                    token: token
                }
            });
        }
    } catch (err) {
        res.json({
            success: false,
            data: {
                msg: err.toString()
            }
        });
    }
}

const verify = async (req, res) => { // After registering, verify email.
    let { token } = req.params;
    let verify = await EmailVerifyModel.findOne({token});
    if (verify) {
        await UserModel.findOneAndUpdate({ 
            email: verify.email 
        }, { status: true });
        res.json({
            success: true,
            data: {
                msg: "Successfully verified your email."
            }
        })
    } else {
        res.json({
            success: false,
            data: {
                msg: "Verify token is not icorrect."
            }
        });
    }
}

const login = async (req, res) => {
    let { email, password } = req.body;
    try {
        let user = await UserModel.findOne({ email });
        if (!user) {
            res.json({
                success: false,
                data: {
                    msg: "The user registered with that email does not exist."
                }
            });
        } else if (!bcrypt.compareSync(password, user.password)) {
            res.json({
                success: false,
                data: {
                    msg: "The password does not match."
                }
            });
        } else {
            if (!user.status) {
                res.json({
                    success: false,
                    data: {
                        msg: "You need to verify your email to log in."
                    }
                });
            } else {
                let token = jwt.sign({
                    userId: user._id, email: user.email
                }, "a1A!s2S@d3D#f4F$",
                {
                    expiresIn: "24h"
                });
                res.json({
                    success: true,
                    data: { 
                        user, 
                        token,
                         msg: "Successfully signed up." 
                    }
                });
            }
        }
    } catch (err) {
        res.json({
            success: false,
            data: {
                msg: err.toString()
            }
        });
    }

}
module.exports = {
    register,
    verify,
    login
}