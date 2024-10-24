import EmailModel from "../models/EmailModel.js";
import { decryptData, encryptData } from "../utils/crypto-data.js";

export const getEmails = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const search = req.query.search || "";
        const limit = 10;

        const emails = await EmailModel.find(
            search ? { email: { $regex: search, $options: "i" }, owner: req.username } : { owner: req.username }
        )
            .sort({ created_at: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalEmails = await EmailModel.countDocuments(
            search ? { email: { $regex: search, $options: "i" }, owner: req.username } : { owner: req.username }
        );
        const totalPages = Math.ceil(totalEmails / limit)

        const emailsDecrypted = emails.map(email => {
            return { ...email._doc, password: decryptData(email.password) }
        });

        res.status(200).json({ emailsDecrypted, totalEmails, page, totalPages });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getEmail = async (req, res) => {
    const { id } = req.params;
    try {
        const email = await EmailModel.findById(id);
        if (!email) res.status(404).json({ message: "Email tidak ditemukan!" });
        res.status(200).json({ ...email._doc, password: decryptData(email.password) });
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateEmail = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
        // Mengecek apakah id yang dimasukkan ada di database
        const checked = await EmailModel.exists({ _id: id });
        if (!checked) {
            return res.status(404).json({ message: "Email tidak ditemukan!" });
        }

        // Jika email ditemukan, maka akan diupdate passwordnya
        await EmailModel.updateOne({ _id: checked }, { password: encryptData(password) });
        res.status(200).json({ message: "Email berhasil diperbarui!" });
    } catch (error) {
        res.status(404).json({ message: "Gagal memperbarui data!" });
    }
}

export const addEmail = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Mengecek apakah email sudah ada di database
        const checkExists = await EmailModel.exists({ email });
        if (checkExists) {
            return res.status(400).json({ message: "Email sudah ada!" });
        }

        const dataInput = {
            owner: username,
            email,
            password: encryptData(password)
        }
        await EmailModel.create(dataInput)

        res.status(201).json({ message: `Email berhasil ditambahkan!` });
    } catch (error) {
        res.status(500).json({ message: "Gagal menambahkan data!" });
    }
}

export const deleteEmail = async (req, res) => {
    const { id } = req.params;

    try {
        const checked = await EmailModel.exists({ _id: id });
        if (!checked) {
            return res.status(404).json({ message: "Email tidak ditemukan!" });
        }

        await EmailModel.deleteOne({ _id: id });
        res.status(200).json({ message: "Email berhasil dihapus!" });
    } catch (error) {
        res.status(404).json({ message: "Gagal menghapus data!" });
    }
}