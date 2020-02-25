import * as yup from 'yup'
import validateBody from 'app/common/validation/validateBody';


const schema = (
    yup.object().shape({
        refreshToken: yup.string().required(),
    }).required()
)

export default validateBody(schema)