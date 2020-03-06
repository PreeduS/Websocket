import mongoose from 'mongoose';

const setupMongoose = () => {

    mongoose.connect('mongodb://localhost:27017/app', {useNewUrlParser: true}).then( async()=>{
        console.log('mongodb connected')

    }, error =>{
        console.log('mongodb error: ',error)
    });
    
    
    
}

export default setupMongoose;