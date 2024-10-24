import { Router } from "express";
import { getEmails, getEmail, addEmail, updateEmail, deleteEmail } from "../controllers/Email.js";
import { Login, Logout } from "../controllers/Otorisasi.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = Router();

router.get("/", (req, res) => {
    res.send("<h1>Notemail by Khaeril Anwar</h1>")
});
router.get("/testing", (req, res) => {
    res.status(200).json({ status: "success", message: "Testing API Server Berhasil" })
})
router.post("/otorisasi", Login)
router.get("/token", refreshToken)
router.delete("/logout", Logout)
router.get("/email", verifyToken, getEmails)
router.get("/email/:id", verifyToken, getEmail)
router.post("/email", verifyToken, addEmail)
router.patch("/email/:id", verifyToken, updateEmail)
router.delete("/email/:id", verifyToken, deleteEmail)

router.use((req, res) => {
    res.status(404).json({ message: "Not Found" });
});

export default router;