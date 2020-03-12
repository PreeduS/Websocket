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

export const writeFileAsync = async(path: string, content: string, flag = 'wx') => {
    const fsWriteFileAsync = promisify(fs.writeFile);
    const fsOpenAsync = promisify(fs.open);
    const fsCloseAsync = promisify(fs.close);
    const pathResolve = resolve(path)


    try{

        const fd = await fsOpenAsync(pathResolve, flag);
        
        await fsWriteFileAsync(pathResolve, content);

        await fsCloseAsync(fd)
        return true;
    }catch(error){
        throw error
        //if (error.code === 'EEXIST') {}
    }

}

