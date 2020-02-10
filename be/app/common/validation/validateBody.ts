import Joi from '@hapi/joi';
import { getValidationError } from 'app/common/utls/getError';
//type ValidateBody = (schema: Joi.SchemaLike) => (...params) => any/type ValidateBody = (schema: Joi.Schema) => (...params) => any

/*
const validateBody: ValidateBody = (schema) => (req, res, next) => {
    const data = req.body;
    //const result = Joi.validate(data, schema);
    const result = schema.validate(data, {abortEarly: false})

    if(result.error){
        console.log('result', result.error.details)
        console.log('result2', result.error.message)
        console.log('result3', result)
        console.log('result4', result.errors)
        //return res.status(400).send(result.error);
    }
    next();
}
*/
type ValidateBody = (schema:any) => (...params) => any

const validateBody: ValidateBody = (schema) => (req, res, next) => {
    const data = req.body;
    //const result = Joi.validate(data, schema);

    const result = schema.validate(data, {abortEarly : false}).then((value) => {
        //console.log('value ',value)
        next()

    })
    .catch( error => {
       // console.log('yup err',error)
        return res.status(400).send(parseError(error));
    })

  /*  if(result.error){
        console.log('result', result.error.details)
        console.log('result2', result.error.message)
        console.log('result3', result)
        console.log('result4', result.errors)
        //return res.status(400).send(result.error);
    }*/
   // next();
}


const parseError = (error) => { 
    return getValidationError(error);
}


export default validateBody;