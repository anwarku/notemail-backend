import UserModel from "../models/UserModel.js"
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.sendStatus(401)
        const user = await UserModel.findOne({ refreshToken })
        if (!user) return res.sendStatus(403)

        jwt.verify(refreshToken, process.env.KEY_REFRESH_TOKEN, (err, decoded) => {
            if (err) return res.sendStatus(403)

            const accessToken = jwt.sign(
                { username: user.username, userId: user._id },
                process.env.KEY_ACCESS_TOKEN,
                {
                    expiresIn: "20s"
                }
            )

            res.json({ accessToken })
        })
    } catch (error) {
        res.sendStatus(500)
    }
}