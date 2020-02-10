import mongoose, { Document  } from 'mongoose';


const userSchema = new mongoose.Schema({
    username: {type: String, required: true },
    password: {type: String, required: true },
    email: {type: String, required: true },
    salt: String,       // not needed
    logo: String,
});



//export default mongoose.model<any>('user', userSchema);
export default mongoose.models['user'] || mongoose.model('user', userSchema);