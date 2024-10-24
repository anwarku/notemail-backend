import CryptoJS from "crypto-js";

export const encryptData = (data) => {
    return CryptoJS.AES.encrypt(data, process.env.KEY_ENCRYPT).toString();
}

export const decryptData = (data) => {
    const bytes = CryptoJS.AES.decrypt(data, process.env.KEY_ENCRYPT);
    return bytes.toString(CryptoJS.enc.Utf8);
}