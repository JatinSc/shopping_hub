const nodemailer = require('nodemailer')

module.exports = async (email, link, name) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
        })

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: "Account Verification",
            html: `<div>
            <p>Welcome ${name}</p>
            <p>Click on to the below link to activate your account</p>
            <a href=${link}>Please verify your account</a>
            <br/>
            <p>The link will expire within 1hr from now.</p>
            <p>If it's expired. Please reverify by going to the profile section on <strong>Shopping Hub</strong> portal</p>
            </div>`
        })
        console.log("email sent successfully")
    } catch (error) {
        console.log("email not sent")
        console.log(error)
    }
}