
import * as yup from 'yup';
import validateBody from 'app/common/validation/validateBody';
import { Auth } from 'app/common/types/routes';

 
class AuthValidation {

    signIn = validateBody<Auth.Validation.SignIn>(
        yup.object().shape({
            username: yup.string().min(6).max(40).required(),
            password: yup.string().min(8).max(100).required('message password'),
            //email: yup.string().min(8).max(100).required(),
        }).required()
    )
    
    signUp = validateBody<Auth.Validation.SignUp>(
        yup.object().shape({
            username: yup.string().min(6).max(40).required(),
            password: yup.string().min(8).max(100).required('message password'),
            email: yup.string().min(8).max(100).required(),
        }).required()
    )

    tokenSignIn = validateBody<Auth.Validation.TokenSignIn>(
        yup.object().shape({
            refreshToken: yup.string().required(),
        }).required()
    )

    getAccessToken = validateBody<Auth.Validation.GetAccessToken>(
        yup.object().shape({
            refreshToken: yup.string().required(),
        }).required()
    )
}

export default new AuthValidation()