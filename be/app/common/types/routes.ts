import { RequestHandler, Params } from 'app/common/types/express';
import { GetGeneralErrorResult } from 'app/common/utls/getError';

export namespace Auth {
    type SignInReqBody = { username: any, password: any };
    type SignInResBody = { accessToken: string, refreshToken: string } | GetGeneralErrorResult;

    type SignUpReqBody = { username: any, password: any,  email: any };
    type SignUpResBody = { accessToken: string, refreshToken: string } | GetGeneralErrorResult;

    type TokenSignInReqBody = { refreshToken: string };
    type TokenSignInResBody = { valid: boolean, accessToken?: string };

    type GetAccessTokenReqBody = { refreshToken: string };
    type GetAccessTokenResBody = { accessToken: string } | GetGeneralErrorResult;;

    

    export namespace Controller {
        export type SignIn = RequestHandler<Params, SignInResBody , SignInReqBody> 
        export type SignUp = RequestHandler<Params, SignUpResBody, SignUpReqBody> 
        export type TokenSignIn = RequestHandler<Params, TokenSignInResBody, TokenSignInReqBody> 
        export type GetAccessToken = RequestHandler<Params, GetAccessTokenResBody, GetAccessTokenReqBody> 
    }
    export namespace Validation {
        export type SignIn = SignInReqBody;
        export type SignUp = SignUpReqBody;
        export type TokenSignIn = TokenSignInReqBody;
        export type GetAccessToken = {refreshToken: any};
    }


}


export namespace Users {

    export namespace Controller {
        export type find = RequestHandler<Params, {userResult: any[]}, {}> 
    }
    export namespace Validation {

    }
}