import { createTransport } from 'nodemailer'

const transporter = createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})


export default async (mailOpts, template) => {
  await transporter.sendMail({
    from:'mh15721812@gmil.com Mail Manger',
    to: mailOpts.to,
    subject:mailOpts.subject,
    html:template,
  });
};



