import '../config/Database.js';
import EmailModel from "../models/EmailModel.js";
import { faker } from '@faker-js/faker/locale/id_ID'
import { decryptData, encryptData } from "../utils/crypto-data.js";
import dotenv from 'dotenv';

dotenv.config();
async function main() {
    for (let i = 0; i < 28; i++) {
        let email = faker.internet.email({ provider: 'gmail.com', allowSpecialCharacters: false });

        // console.log(`khaerilAnwar${(i + 1).toString().padStart(4, '0')}`)
        if (i > 14) {
            await EmailModel.create({
                owner: 'user',
                email,
                password: encryptData(`khaerilAnwar${(i + 1).toString().padStart(4, '0')}`)
            })
        } else {
            await EmailModel.create({
                owner: 'admin',
                email,
                password: encryptData(`khaerilAnwar${(i + 1).toString().padStart(4, '0')}`)
            })
        }
    }

    console.log('Seeder berhasil dijalankan');
}

main();