import { Piscina } from 'piscina';
declare module 'node:module' {
    function getCompileCacheDir(): string | undefined;
}
export type WorkerPoolOptions = ConstructorParameters<typeof Piscina>[0];
export declare class WorkerPool extends Piscina {
    constructor(options: WorkerPoolOptions);
}
