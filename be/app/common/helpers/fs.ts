import fs from 'fs';
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

