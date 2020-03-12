import Joi from '@hapi/joi';
import { getValidationError ,} from 'app/common/utls/getError';
import { ObjectSchemaDefinition, ObjectSchema } from 'yup';


//type ValidateBody = (schema:any) => (...params) => any
//const validateBody: ValidateBody = (schema) => (req, res, next) => {
    
const validateBody = <T extends object>(schema: ObjectSchema<T>) => (req, res, next) => {

    const data = req.body;

    //const result = 
    schema.validate(data, {abortEarly : false}).then((value) => {
        next()
    })
    .catch( error => {
        return res.status(400).send(parseError(error));
    })

}


const parseError = (error) => { 
    return getValidationError(error);
}


export default validateBody;