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