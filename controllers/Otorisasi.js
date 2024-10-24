import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';
import bcrypt from "bcrypt";

// Catatan: Fungsi Login ini akan mengembalikan token akses
// dan menyimpan token refresh dalam cookie
// Fungsi ini akan mengembalikan status 404 jika pengguna tidak ditemukan
// Fungsi ini akan mengembalikan status 400 jika kata sandi salah
// Fungsi ini akan mengembalikan status 500 jika terjadi kesalahan server

// Penggunaan fitur refresh token ini sementara tidak digunakan
// Karena fitur ini masih ada bug dimana ketika token kadaluarsa
// Maka axios interceptor pada sisi klien melakukan request ke endpoint tujuan
// Sebelum mendapatkan token baru, sehingga akan terjadi error 401

// Jadi pada sisi front end, mematikan fetch data token ke refresh token
// Digantikan dengan jika token pertama ketika login kadaluarsa
// Maka sisi front end menganggap sudah logout dan menghapus token

export const Login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Mengecek apakah username dan password ada dalam database
        const checked = await UserModel.exists({ username })
        if (!checked) return res.status(404).json({ message: "Pengguna tidak ditemukan!" })

        const user = await UserModel.findOne({ username })
        // Jika username ditemukan di database
        const matchPassword = bcrypt.compareSync(password, user.password)

        // Mengecek password
        if (!matchPassword) return res.status(400).json({ message: "Kata sandi salah!" })

        // Refresh Token
        const refreshToken = jwt.sign(
            { username: user.username, userId: user._id },
            process.env.KEY_REFRESH_TOKEN,
            {
                expiresIn: "12h"
            }
        )

        // Access Token
        const accessToken = jwt.sign(
            { username: user.username, userId: user._id },
            process.env.KEY_ACCESS_TOKEN,
            {
                expiresIn: "15s"
            }
        )

        // Menambahkan refresh token ke database
        await UserModel.updateOne({ username: user.username }, { refreshToken })

        // Sementara tidak melakukan setting cookies ke front end
        // Karena sementara fitur refresh token belum digunakan
        // ----------------------------------------------------------
        // Setting cookies client
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 12,
            secure: true,
            sameSite: "None"
        })

        res.json({ accessToken });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error!" })
    }
}

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await UserModel.findOne({ refreshToken });
    if (!user) return res.sendStatus(204);
    const username = user.username
    await UserModel.updateOne({ username }, { refreshToken: null });
    res.clearCookie("refreshToken");
    return res.sendStatus(200);
}