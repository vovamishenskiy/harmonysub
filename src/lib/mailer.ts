import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendMail(to: string, subject: string, html: string) {
    await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to,
        subject,
        html,
    });
}
