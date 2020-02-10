import mongoose from 'mongoose';

const setupMongoose = () => {

    mongoose.connect('mongodb://localhost:27017/app', {useNewUrlParser: true}).then( ()=>{
        console.log('connected')
    }, err =>{
        console.log('err: ',err)
    });
    
    
    
}

export default setupMongoose;