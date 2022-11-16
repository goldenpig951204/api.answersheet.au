const nodemailer = require('nodemailer');

const transport = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PWD
    }
}

const transporter = nodemailer.createTransport(transport);

module.exports = transporter;