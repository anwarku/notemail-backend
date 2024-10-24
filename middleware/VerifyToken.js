import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.KEY_ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return err.name === 'TokenExpiredError' ? res.sendStatus(401) : res.sendStatus(403)
        }
        req.username = decoded.username
        next();
    });
};