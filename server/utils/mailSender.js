const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      // port: 465, // or 587 for TLS
      // secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      // tls: {
      //   rejectUnauthorized: false, // Added this line, not recommended
      // },
    });

    let info = await transporter.sendMail({
      from: "BitsBytesAndBlogs || Your new blogging partner.",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    console.log("Info from mailSender", info);

    return info;
  } catch (error) {
    console.log("Error from mailSender", error);
  }
};

module.exports = mailSender;
