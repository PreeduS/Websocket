import { Request, RequestHandler as Handler, Express } from 'express'
import * as core from "express-serve-static-core";
//import { Params, ParamsDictionary } from 'express-serve-static-core'

export interface RequestHandler<P extends core.Params = core.ParamsDictionary, ResBody = any, ReqBody = any> extends core.RequestHandler<P, ResBody, ReqBody> { }

export type Params = core.Params
export type ParamsDictionary = core.ParamsDictionary
export type ParamsArray = core.ParamsArray
export type ResBody = any
export type ReqBody = any