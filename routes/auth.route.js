const { Router } = require("express")
const router = Router()
const User = require("../models/User")
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const jwtToken = require("jsonwebtoken")


router.post("/register",
    [
        check("email", "Noto'g'ri email").isEmail(),
        check("password", "Noto'g'ri parol").isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Noto'g'ri malumotlar"
                })
            }

            const { email, password } = req.body

            const isUsed = await User.findOne({ email })

            if (isUsed) {
                return res.status(300).json({ message: "Bu email band" })
            }

            const hashPassword = await bcrypt.hash(password, 10)

            const user = new User({
                email, password: hashPassword
            })

            await user.save()
            res.status(201).json({ message: "Ro'yxatdan o'ttingiz" })

        } catch (error) {
            console.log(error);
        }
    })

router.post("/login",
    [
        check("email", "Noto'g'ri email").isEmail(),
        check("password", "Noto'g'ri parol").exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Noto'g'ri malumotlar"
                })
            }

            const { email, password } = req.body

            const user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json({ message: "Bunday user yo'q" })
            }

            const isMatch = bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ message: "Noto'g'ri parol kiritingiz" })
            }


            const jwtSecret = "Baxrom"
            const token = jwtToken.sign(
                { userId: user.id },
                jwtSecret,
                { expiresIn: "1h" }
            )

            res.json({ token, userId: user.id })




        } catch (error) {
            console.log(error);
        }
    })

module.exports = router