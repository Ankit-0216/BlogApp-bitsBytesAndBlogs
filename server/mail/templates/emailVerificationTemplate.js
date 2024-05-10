const otpTemplate = (otp) => {
  return `<!DOCTYPE html>
  <html>
  
  <head>
      <meta charset="UTF-8">
      <title>OTP Verification Email</title>
      <style>
          body {
              background-color: #ffffff;
              font-family: Arial, sans-serif;
              font-size: 16px;
              line-height: 1.4;
              color: #333333;
              margin: 0;
              padding: 0;
          }

          .heading {
              font-size: 30px;
              font-weight: bold;
          }
  
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              text-align: center;
          }
  
          .logo {
              max-width: 200px;
              margin-bottom: 20px;
          }
  
          .message {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 20px;
          }
  
          .body {
              font-size: 16px;
              margin-bottom: 20px;
          }
  
          .cta {
              display: inline-block;
              padding: 10px 20px;
              background-color: #FFD60A;
              color: #000000;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
              font-weight: bold;
              margin-top: 20px;
          }
  
          .support {
              font-size: 14px;
              color: #999999;
              margin-top: 20px;
          }
  
          .highlight {
              font-weight: bold;
          }
      </style>
  
  </head>
  
  <body>
      <div class="container">
          <p class="heading"> Bits Bytes And Blogs </p>
          <div class="message">OTP Verification Email</div>
          <div class="body">
              <p>Dear User,</p>
              <p>Welcome to Bits, Bytes, and Blogs! We're excited to have you join our community of tech enthusiasts and writers.
                    To complete your registration, please use the following One-Time Password (OTP) to verify your email address:</p>
              <h2 class="highlight">OTP: ${otp}</h2>
              <p>This OTP is valid for 5 minutes. If you did not sign up for an account with us, please disregard this email.</p>
          </div>
          <div class="support">Thank you for choosing Bits, Bytes, and Blogs. If you have any questions or need assistance, 
                feel free to reach out to our support team at <a href="mailto:info@studynotion.com">support@bitsblogsandbites.com</a>. We are here to help!</div>
      </div>
  </body>
  
  </html>`;
};
module.exports = otpTemplate;
