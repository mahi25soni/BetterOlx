const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = (user_email,user_name,  otp) => {
    const msg = {
        to: user_email, // Change to your recipient
        from: process.env.SENDGRID_SENDER, // Change to your verified sender
        subject: 'OTP for BetterOlx Registration',
        html: `Hey ${user_name}, welcome to BetterOlx. Your otp is ${otp} <strong> and this is valid of 3 minutes only!`
      }


    sgMail
    .send(msg)
    .then((response) => {
    console.log(response[0].statusCode)
    console.log(response[0].headers)
    })
    .catch((error) => {
    console.error(error)
    })
}

module.exports = {
    sendEmail
}