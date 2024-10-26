import nodemailer from "nodemailer";
import config from "../config";
import { TUser } from "../modules/user/user.interface";

export const sendEmail = async (userInfo: TUser, resetLink: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.NODE_ENV === "production",
        auth: {
            user: "noyonhossain560@gmail.com",
            pass: "dwoz swgb qsbw ouev",
        },
    });

    await transporter.sendMail({
        from: 'noyonhossain560@gmail.com',
        to: userInfo.email,
        subject: "PH-University Password Reset Request",
        text: `
        Dear ${userInfo.id},
        
        We received a request to reset your PH-University account password. If you made this request, please use the link below to reset your password:
        
        Reset Password: [RESET_LINK]
        
        If you did not request this change, please ignore this email, and your password will remain unchanged.
        
        Thank you,
        PH-University Support Team`,
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #4CAF50;">PH-University Password Reset Request</h2>
          <p>Dear <strong>${userInfo.id}</strong>,</p>
          <p>We received a request to reset the password associated with your PH-University account.</p>
          <p style="margin-bottom: 30px;">If you made this request, click the button below to reset your password:</p>
          <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p style="margin-top: 30px;">If you didn't request a password reset, please ignore this email. Your password will remain the same.</p>
          <br />
          <p>Thank you,</p>
          <p>PH-University Support Team</p>
        </div>
        `
    });
}
