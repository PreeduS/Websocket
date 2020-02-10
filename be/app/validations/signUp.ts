import Joi from '@hapi/joi';
import validateBody from '../../app/common/validation/validateBody';

import * as yup from 'yup'

/*
const schema = (
    Joi.object().keys({
        username: Joi
            .string().min(6).max(30).required()
            .error((e) => {
                console.log(e)
                return e as any
            })
            //.error(new Error('Username must be in 6-30 range')),
            //.error( ()=>('Username must be in 6-30 range')),
            ,
        password: Joi.string().min(6).max(30).required(),
    }).required()
)
*/

const schema = (
    yup.object().shape({
        username: yup.string().min(6).max(40).required(),
        password: yup.string().min(8).max(100).required('message password'),
    }).required()
)

export default validateBody(schema)