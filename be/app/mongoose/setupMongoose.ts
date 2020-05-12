import mongoose from 'mongoose';
import getKeys from 'app/common/keys';



const setupMongoose = () => {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_DB, MONGO_HOST, NODE_ENV } = process.env;
    console.log('MONGO_PASSWORD ',MONGO_PASSWORD)
    const keys = getKeys()
    // mongoose.connect('mongodb://localhost:27017/app', {useNewUrlParser: true}).then( async()=>{
    //mongoose.connect(NODE_ENV === 'development' ? `mongodb://localhost:27017/app` : `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:27017/${MONGO_DB}`, {useNewUrlParser: true}).then( async()=>{
    mongoose.connect(keys.db.mongodb.connectionString, {useNewUrlParser: true}).then( async()=>{
        console.log('mongodb connected')

    }, error =>{
        console.log('mongodb error: ',error)
    });
    
    
    
}

export default setupMongoose;