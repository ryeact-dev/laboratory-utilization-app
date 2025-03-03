const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const { logger } = require('./winstonLogger');
const { dateConverter } = require('./dateConverter');

/** send mail from real gmail account */
async function nodeMailer(userData, introMessage, resMessage) {
  const { email, full_name, password } = userData;

  const config = {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(config);

  const MailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'Mailgen',
      link: 'https://mailgen.js/',
    },
  });

  const response = {
    body: {
      name: full_name,
      intro: introMessage,
      outro: `<h1 style="font-weight: bold; font-size: 24px;">${password}</h1>`,
    },
  };

  const mail = MailGenerator.generate(response);

  const message = {
    from: process.env.EMAIL,
    to: email,
    subject: 'UMTC LUMENS Registration',
    html: mail,
  };

  transporter
    .sendMail(message)
    .then(() => logger.info(resMessage))
    .catch((err) =>
      logger.error(`Nodemailer Transporter :: ${err.stack} ${dateConverter()}`)
    );
}

exports.nodeMailer = nodeMailer;
