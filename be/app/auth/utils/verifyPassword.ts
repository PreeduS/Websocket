import bcrypt from 'bcrypt';


const verifyPassword = async (password: string, salt: string) => {
    return bcrypt.compare(password, salt);

}

export default verifyPassword;