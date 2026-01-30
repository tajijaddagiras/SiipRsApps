import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendOTPEmail = async (email: string, code: string) => {
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Kode Verifikasi SIIP RS ESA UNGGUL',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #4285F4;">Verifikasi Akun Anda</h2>
                <p>Halo,</p>
                <p>Gunakan kode OTP berikut untuk melanjutkan tindakan Anda di SIIP RS ESA UNGGUL:</p>
                <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4285F4;">${code}</span>
                </div>
                <p>Kode ini berlaku selama 10 menit. Jika Anda tidak merasa melakukan tindakan ini, silakan abaikan email ini.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #777;">Email ini dikirim secara otomatis oleh sistem SIIP RS ESA UNGGUL.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', email);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
