import nodemailer from 'nodemailer';

const user = 'vedtam@gmail.com';
const appPassword = 'fdnjsbbyrxghrmkm';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user,
    pass: appPassword,
  },
});

export const sendToKindle = async (file: string, data: any) => {
  const info = await transporter.sendMail({
    from: user,
    to: 'vedtam_su2FH8@kindle.com',
    subject: '',
    html: '<div></div>',
    attachments: [
      { 
        filename: file,
        content: Buffer.from(data, 'utf8')
      },
    ]
  });

  console.log('Message sent: %s', info.messageId);
}