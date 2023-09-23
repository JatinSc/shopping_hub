const nodemailer = require('nodemailer')

module.exports = async (email,link,name) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.USER,
                pass:process.env.PASS
            }
        })

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: "Account Verification",
            text: `Welcome ${name}`,
            html: `<div>
            <a href=${link}>Click here to activate your account.</a>
            </div>`
        })
        console.log("email sent successfully")
    } catch (error) {
        console.log("email not sent")
        console.log(error)
    }
}