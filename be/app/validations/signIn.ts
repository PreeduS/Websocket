
import * as yup from 'yup';
import validateBody from 'app/common/validation/validateBody';


const schema = (
    yup.object().shape({
        username: yup.string().min(6).max(40).required(),
        password: yup.string().min(8).max(100).required('message password'),
    }).required()
)

export default validateBody(schema)