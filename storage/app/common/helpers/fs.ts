import fs, {WriteFileOptions} from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

type FileExistsAsync = (path: string) => Promise<boolean>

export const fileExistsAsync: FileExistsAsync = async(path) => {

    const fsAccessAsync = promisify(fs.access);
    const pathResolve = resolve(path);
    try{
        await fsAccessAsync(pathResolve, fs.constants.F_OK);

        return true;
    }catch(error){
        return false;
    }

}

type ReadDirAsync = (path: string) => Promise<string[] | null>;

export const readDirAsync: ReadDirAsync = async(path) => {
    const fsReadDirAsync = promisify(fs.readdir);
    const pathResolve = resolve(path);
    try {
        const result = await fsReadDirAsync(pathResolve);
        return result;
    }catch(error){
        return null;
    }
    
}

type ReadFileAsync = (path: string) => Promise<string>

export const readFileAsync: ReadFileAsync = async (path: string) => {
    const fsReadFileAsync = promisify(fs.readFile);
    const pathResolve = resolve(path);
    try{
        const result = await fsReadFileAsync(pathResolve, 'utf8');

        return result;
    }catch(error){
        throw error
    }

}

//export const writeFileAsync = async(path: string, content: string, flag = 'wx') => {
type WriteFileAsyncArgs = {
    path: any
    data: any,
    writeOptions?: WriteFileOptions/*{
      //  path:string,
       // data:any,    
       // options:{
            encoding?: string | null
            mode?:number
            flag?:string | number
       // }
    } | string,*/

    openOptions?: {
        flag?:string | number,
        mode?:string | number,    
    }
}
export const writeFileAsync = async(
    //path,
    //content,
   /* write: {
        path,
        data
    },
    open:{
        flag,
        mode        // mode sets the file mode (permission and sticky bits), but only if the file was created.
    }
*/
params
:WriteFileAsyncArgs) => {
    const path = params.path
    const data = params.data
    const openOption = {
        flag: params.openOptions && params.openOptions.flag || 'wx',
        mode: params.openOptions && params.openOptions.mode,
    }
    const writeOptions = params.writeOptions  || 'utf8'

    const fsWriteFileAsync = promisify(fs.writeFile);
    const fsOpenAsync = promisify(fs.open);
    const fsCloseAsync = promisify(fs.close);
    const pathResolve = resolve(path)


    try{

        const fd = await fsOpenAsync(pathResolve, openOption.flag, openOption.mode);
        
        await fsWriteFileAsync(pathResolve, data, writeOptions);

        await fsCloseAsync(fd)
        return true;
    }catch(error){
        throw error
        //if (error.code === 'EEXIST') {}
    }

}

