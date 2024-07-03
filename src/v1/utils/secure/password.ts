import { SALT_ROUNDS } from "./constants";
const bcrypt = require('bcryptjs');


/**
 * This function generate the hash of given password
 * @param {String} password - It takes password as a plain text
 * @returns {String} - It return a hash password
 */
const generatePassword = async (password: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const securePassword = await bcrypt.hash(password, salt);

        return securePassword;
    } catch (error) {
        throw new Error(`Error generating password: ${error || 'UNKNOWN'}`);
    }
};

/**
 *  This funtion compare the hashed passwords using bcrypt
 * @param {String} currentPassword - It takes the non-hashed pssword or a simple text
 * @param {String} actualPassword - It takes the hashed password
 * @returns {Boolean} - It returns true, if password mathches else false
 * */ 
const comparePassword = async (currentPassword: string, actualPassword: string): Promise<boolean> => {
    if(!currentPassword || !actualPassword) 
        throw new Error('All Fields are required');
    return await bcrypt.compareSync(currentPassword, actualPassword);
};

export { generatePassword, comparePassword };