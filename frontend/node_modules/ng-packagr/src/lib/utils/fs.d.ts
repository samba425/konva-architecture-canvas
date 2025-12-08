import { PathLike } from 'node:fs';
export { readFile, writeFile, access, mkdir, stat, rm as rmdir } from 'node:fs/promises';
export declare function exists(path: PathLike): Promise<boolean>;
export declare function copyFile(src: string, dest: string): Promise<void>;
