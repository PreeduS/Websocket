
import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import {writeFileAsync} from 'app/common/helpers/fs'
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = process.env.PORT || 5010;

console.log('process.env.NODE_ENV : ',port)
// app.use('/',bodyParser.json());
app.use('/',bodyParser.json({limit: '20mb'}));
app.use('/',cors());


app.get('/', (req, res) => {

    res.send('storage');
})


app.post('/test/file', async (req, res) => {
    const uuid = uuidv4();
    const uploadPath =`./app/static/public/test/${uuid}`
    try{
        await writeFileAsync({
            path:uploadPath,
            data:`testfile: ${uuid}`
        })
        return res.status(201).send('Upload completed')
    }catch(error){

        return res.status(500).send('Upload failed')
        
    }
    
})



const imageUploadValidation = (base64Image: string) => {
    let returnData = { valid: false, ext: null };

    const splitBy = ';base64,';
    const splitByExists = base64Image.includes(splitBy);
    if(splitByExists){
        return returnData;
    }
    /*
        # offset 0
        .jpg/.jpeg
            FF D8 FF DB
            FF D8 FF E0
            FF D8 FF EE
            FF D8 FF E1
        # end with      FF D9

        .png	    89 50 4e 47
        # end with      49 45 4E 44 AE 42 60 82
    */

    const magicNumbers = [
        { 
            header: 'FFD8',
            trailer: 'FFD9',
            ext: 'jpg' 
        },
        {   
            header: '89504E47',
            trailer: '49454E44AE426082',
            ext: 'png'
        },
        {   
            header: '424D',
            trailer: null,
            ext: 'bmp'
        },
        {   
            header: '49492A00',
            trailer: null,
            ext: 'tif'
        },
    ]
    const startsWith = (string, substring) => string.indexOf(substring) === 0;
    const endsWith = (string, substring) => string.indexOf(substring, string.length - substring.length ) !== -1;

    var buf = new Buffer(base64Image, 'base64');
    const hexValue = buf.toString('hex').toUpperCase()
    //const header = buf.slice(0,4).toString('hex').toUpperCase();                // buf.slice(0,2)
    //const trailer = buf.slice(buf.length-12).toString('hex').toUpperCase();      // buf.slice(buf.length-2)


    magicNumbers.forEach(mn => {
        const validHeader =  mn.header === null ? true: startsWith(hexValue, mn.header);
        const validTrailer =  mn.trailer === null ? true: endsWith(hexValue, mn.trailer);
        if( validHeader && validTrailer){
            returnData = {valid: true, ext: mn.ext};
        }
    });


    return returnData


}

const getBase64Image = (base64Upload:string):string => {
    const splitBy = ';base64,';
    const splitByExists = base64Upload.includes(splitBy);
    if(!splitByExists){
        throw new Error("Invalid format");
    }
    const uploadArray = base64Upload.split(splitBy);
    const base64Image = uploadArray[1];
    return base64Image;
}

app.post('/user/avatar', async (req, res) => {

    const base64Upload = req.body.base64Upload

   let base64Image:string;
    try{
        base64Image = getBase64Image(base64Upload);
    }catch(e){

        return res.status(400).send('Invalid format')
    } 


    const validationResult = imageUploadValidation(base64Image);

    if(!validationResult.valid){
        return res.status(400).send('Invalid format')
    }


   

            console.log('validationResult ',validationResult)
    const fileName = `image_${uuidv4()}.${validationResult.ext}`;    // use uuid

    const uploadPath ='./app/static/public/avatar/'+fileName
    try{

        //const writeFile =
        await writeFileAsync({path:uploadPath,data:base64Image,writeOptions:{encoding:'base64'}})
    }catch(error){
        if(error.code === 'EEXIST'){
            return res.status(500).send('file already exists')
        }
        return res.status(500).send('Upload failed')
        
    }

    return res.status(201).send({
        fileName
    })

})


app.listen(port, () => console.log('Storage server started..'))