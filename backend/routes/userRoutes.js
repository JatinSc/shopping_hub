const mongoose = require('mongoose')
const router = require('express').Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require("../models/userModal")
const Token = require('../models/token');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto');
const auth = require('../middlewares/userAuth')




router.post("/register", async (req, res) => {
    // #  we will take values from user by using req.body
    const { firstName, lastName, email, password } = req.body;

    //# if fields are empty 
    if (!firstName || !lastName || !email || !password)
        return res
            .status(400)
            .json({ error: 'you missed some fields 🥲' })

    //# validate name 
    if (firstName.length < 3) {
        return res
            .status(400)
            .json({ error: 'firstName should have at least 3 characters' });
    } else if (firstName.length > 25) {
        return res
            .status(400)
            .json({ error: 'firstName can only be 25 characters long.' });
    }
    const emailReg =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // # validation of email through regex
    if (!emailReg.test(email))
        return res
            .status(400)
            .json({ error: "please enter a valid email address." });

    // # validation of password
    //* Password regex
    const hasUppercase = /[A-Z]/;
    const hasLowercase = /[a-z]/;
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;
    const hasDigit = /\d/;

    if (password.length <= 10)
        return res
            .status(400)
            .json({ error: 'password must be at least of 10 characters' }
            )
    if (!hasUppercase.test(password)) {
        return res
            .status(400)
            .json({ error: 'password must have at least one UpperCase character' })
    }
    if (!hasLowercase.test(password)) {
        return res
            .status(400)
            .json({ error: 'password must have at least one LowerCase character' })
    }
    if (!hasSpecialChar.test(password)) {
        return res
            .status(400)
            .json({ error: 'password must have at least one Special character' })
    }
    if (!hasDigit.test(password)) {
        return res
            .status(400)
            .json({ error: 'password must have at least one Digit' })
    }

    // # if everything is fine , we create our user in try catch
    try {
        // warning if user is already exists
        const doesUserAlreadyExist = await User.findOne({ email })
        if (doesUserAlreadyExist)
            return res
                .status(400)
                .json({ error: `a user with "${email}" already exists, so please try with different email` })


        //info:- first we hash the password before saving it into database
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ firstName, lastName, email, password: hashedPassword })
        //# saving the user 
        const result = await newUser.save()

        //note:- .doc.password will not show saved password in postman while testing
        result._doc.password = undefined;


        //# generating verification token for email verification
        const token = new Token({
            userId: newUser._id,
            token: crypto.randomBytes(32).toString('hex')
        })
        await token.save()

        // info:- generating link for sending in the email
        //                                         /:id          /verify/ :token
        const link = `${process.env.BASE_URL}/user/${newUser._id}/verify/${token.token}`
        //* now we will send email with the verification link
        await sendEmail(newUser.email, link, newUser.firstName)
        console.log(token)

        return res.status(201).json({
            message: "An email sent to your account please verify"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
});


router.post("/login", async (req, res) => {
    // #  we will take values from user by using req.body
    const { email, password } = req.body;

    // # if fields are missing
    if (!email || !password)
        return res
            .status(400)
            .json({ error: 'please enter all the required fields' })

    // # email validation with regex
    const emailReg =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // # will test email with regex
    if (!emailReg.test(email))
        return res
            .status(400)
            .json({ error: "please enter a valid email address." });

    try {
        // warning if user not exists 
        const doesUserExists = await User.findOne({ email });
        if (!doesUserExists)
            return res
                .status(400)
                .json({ error: "invalid email or password" });

        // # if there any user exists so we match the plain text password with hashed password
        const doesPasswordMatch = await bcrypt.compare(password, doesUserExists.password)

        if (!doesPasswordMatch)
            return res
                .status(400)
                .json({ error: " invalid email or password " })

        // # if everything is fine we will generate token
        // * it takes id , secret key and we can give expiration duration 
        const payload = { _id: doesUserExists._id }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        })
        const user = { ...doesUserExists._doc, password: undefined }
        return res
            .status(200)
            .json({
                message:"Logged in successfully",
                token, user
            })
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: error.message });

    }
});


router.get("/user/:id/verify/:token", async (req, res) => {
    const id = req.params.id
    const token = req.params.token

    try {
        const user = await User.findOne({ _id: id })
        if (!user) {
            return res.status(400)
                .json({
                    message: "invalid link"
                })
        }

        const verifyToken = await Token.findOne({
            userId: user._id,
            token: token
        })

        if (!verifyToken) {
            return res.status(400)
                .json({
                    message: "invalid link"
                })
        }

        //# if token is valid then we will update user's verified field with true
        await User.updateOne({_id: user._id}, { $set: { verified: true } })
        //# after verifying the account we will delete the token document
        // await verifyToken.remove()
        await Token.findByIdAndRemove(verifyToken.userId)
        return res.status(200)
            .json({
                message: "Email verified successfully"
            })

    } catch (error) {
        return res
            .status(500)
            .json({
                message: "internal server error"
            })
    }
})

router.get("/me", auth, async (req, res) => {
    return res
        .status(200)
        .json({ user:req.user });
})

module.exports = router