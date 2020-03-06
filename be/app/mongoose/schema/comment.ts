import mongoose, { Document } from 'mongoose';


const commentSchema = new mongoose.Schema({

    comment: {type: String, required: true },
    createdAt: {type: Date, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
});



//export default mongoose.model<any>('user', userSchema);
export default mongoose.models['comment'] || mongoose.model('comment', commentSchema);