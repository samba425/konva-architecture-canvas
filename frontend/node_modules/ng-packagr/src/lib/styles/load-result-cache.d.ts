import type { OnLoadResult, PluginBuild } from 'esbuild';
export interface LoadResultCache {
    get(path: string): OnLoadResult | undefined;
    put(path: string, result: OnLoadResult): Promise<void>;
    readonly watchFiles: ReadonlyArray<string>;
}
export declare function createCachedLoad(cache: LoadResultCache | undefined, callback: Parameters<PluginBuild['onLoad']>[1]): Parameters<PluginBuild['onLoad']>[1];
export declare class MemoryLoadResultCache implements LoadResultCache {
    #private;
    get(path: string): OnLoadResult | undefined;
    put(path: string, result: OnLoadResult): Promise<void>;
    invalidate(path: string): boolean;
    get watchFiles(): string[];
}
