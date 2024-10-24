import "../config/Database.js";
import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";

async function main() {
    const users = [
        {
            username: 'admin',
            password: 'sayangku'
        },
        {
            username: 'devuser',
            password: '123456'
        }
    ]

    for (let user of users) {
        let salt = bcrypt.genSaltSync(10);
        let hashPassword = bcrypt.hashSync(user.password, salt);
        await UserModel.create({ username: user.username, password: hashPassword });
    }

    console.log("Seeder berhasil dijalankan");
}

main();