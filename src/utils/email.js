import nodemailer from 'nodemailer'
import { email } from '../config/loginConfig'

const transporter = nodemailer.createTransport(email);

export const mailSample = () => {
    const sampleMailOptions = {
        from: process.env.SMTP_AUTH_USER,
        to: "sushan.shr10@gmail.com",
        subject: "Sending Email is easy",
        html: "<br>Isn't that way too easy??",
        attachments: null
    };

    transporter.sendMail(sampleMailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};

export const sendMail = (to, subject, html, attachments, callback) => {
    const mailOptions = {
        from: process.env.SMTP_AUTH_USER,
        to,
        subject,
        html,
        attachments
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return callback(err);
        }
        return callback(null, info);
    });
};
