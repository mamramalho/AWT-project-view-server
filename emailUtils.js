const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (recipient, subject, content) => {
  try {
    const msg = {
      to: recipient,
      from: "mamramalho99@gmail.com",
      subject: subject,
      html: content,
    };

    await sgMail.send(msg);
    console.log(`Email sent to ${recipient}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendEmail };
