import * as chokidar from 'chokidar';
import { Observable } from 'rxjs';
import { BuildGraph } from '../graph/build-graph';
import { FileCache } from './file-cache';
type AllFileWatchEvents = 'change' | 'unlink' | 'add' | 'unlinkDir' | 'addDir';
export type FileWatchEvent = Exclude<AllFileWatchEvents, 'unlinkDir' | 'addDir'>;
export interface FileChangedEvent {
    filePath: string;
    event: FileWatchEvent;
}
export declare function createFileWatch(basePaths: string | string[], ignoredPaths?: string[], poll?: number): {
    watcher: chokidar.FSWatcher;
    onFileChange: Observable<FileChangedEvent>;
};
/**
 * Invalidates entry points and cache when specified files change.
 *
 * @returns - Returns `true` if any entry point was invalidated, otherwise `false`.
 */
export declare function invalidateEntryPointsAndCacheOnFileChange(graph: BuildGraph, files: string[], sourcesFileCache: FileCache): boolean;
export {};
