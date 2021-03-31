const nodemailer = require('nodemailer');
const config = require('../../config/mail');

var transporter = nodemailer.createTransport(config);

module.exports = (to, userName, subject, primaryText, secondaryText) => {
  var html = require('../../config/mailHtml');
  html = html(userName, primaryText, secondaryText);
  const options = {from: '"MotoHUB - Noreply" <general@motohub.pt>', to, subject, html};
  
  transporter.sendMail(options, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};