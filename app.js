require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const bodyParser = require("body-parser");

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Set up views
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.engine('html', require('ejs').renderFile);

// Home route (displays the form)
app.get('/', (req, res) => {
    res.render('home');
});

const sendContactEmail = (name, email, phoneNumber, message, dialCode) => {
    const fullPhoneNumber = "+" + dialCode + phoneNumber;
  
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP,
      port: process.env.EMAILPORT,
      secure: true,
      auth: {
        user: process.env.SMTPUSER,
        pass: process.env.SMTPPASS,
      },
    });
  
    const mailOptions = {
      from: {
        name: name,
        address: process.env.SMTPUSER,
      },
      to: process.env.SMTPUSER,
      subject: "New Demo Booking / Contact Form",
      html: `
      <p><strong>Name:</strong> ${name}</p>
      <hr/>
      <p><strong>Email:</strong> ${email}</p>
      <hr/>
      <p><strong>Phone Number:</strong> ${fullPhoneNumber}</p>
      <hr/>
      <p><strong>Message:</strong> ${message}</p>
      <button style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px;">
                <a href="mailto:${email}?subject=Reply&body=Dear%20${name.replace(/\s/g, '%20')},%0D%0A%0D%0AThank%20you%20for%20reaching%20out%20to%20me.%0D%0A%0D%0A%0D%0ABest%20regards,%0D%0AKiran%20Thapa" style="color: white; text-decoration: none;">
                  Send Generic Reply
                </a>
              </button>
    `,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  };
  
  
  app.post("/submit-contact-form", async (req, res) => {
    const inputName = req.body.inputName;
    const inputEmail = req.body.inputEmail;
    const inputPhoneNumber = req.body.inputPhoneNumber;
    const inputMessage = req.body.inputMessage;
    const dialCode = req.body.dialCode;  
  
    try {
        await sendContactEmail(inputName, inputEmail, inputPhoneNumber, inputMessage, dialCode);
        res.render("contactform", {
          pageTitle: "Message Sent",
          name: inputName,
          email: inputEmail,
          phoneNumber: "+" + dialCode + inputPhoneNumber,
          message: inputMessage,
          successMessage: "Your message has been sent successfully!"
        });
    } catch (error) {
      res.render('contacterror', {pageTitle: "Error in Contact Form - ",});
    }
  });


  const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});