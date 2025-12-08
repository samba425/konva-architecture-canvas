"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileWatch = createFileWatch;
exports.invalidateEntryPointsAndCacheOnFileChange = invalidateEntryPointsAndCacheOnFileChange;
const chokidar = __importStar(require("chokidar"));
const os_1 = require("os");
const path = __importStar(require("path"));
const rxjs_1 = require("rxjs");
const node_1 = require("../graph/node");
const nodes_1 = require("../ng-package/nodes");
const log = __importStar(require("../utils/log"));
const path_1 = require("../utils/path");
function createFileWatch(basePaths, ignoredPaths = [], poll) {
    log.debug(`Watching for changes: basePath: ${basePaths}, ignoredPaths: ${ignoredPaths}`);
    const watch = chokidar.watch([], {
        ignoreInitial: true,
        ignored: [
            /\.map$/,
            /.tsbuildinfo$/,
            file => {
                const normalizedPath = (0, path_1.ensureUnixPath)(file);
                return ignoredPaths.some(f => normalizedPath.startsWith(f));
            },
        ],
        persistent: true,
        usePolling: typeof poll === 'number' ? true : false,
        interval: typeof poll === 'number' ? poll : undefined,
    });
    const isLinux = (0, os_1.platform)() === 'linux';
    const handleFileChange = (event, filePath, observer) => {
        log.debug(`Watch: Path changed. Event: ${event}, Path: ${filePath}`);
        if (isLinux) {
            // Workaround for Linux where chokidar will not handle future events
            // for files that were unlinked and immediately recreated.
            watch.unwatch(filePath);
            watch.add(filePath);
        }
        if (event === 'unlinkDir' || event === 'addDir') {
            // we don't need to trigger on directory removed or renamed as chokidar will fire the changes for each file
            return;
        }
        observer.next({
            filePath: (0, path_1.ensureUnixPath)(path.resolve(filePath)),
            event,
        });
    };
    return {
        watcher: watch,
        onFileChange: new rxjs_1.Observable(observer => {
            watch.on('all', (event, filePath) => handleFileChange(event, filePath, observer));
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            return () => watch.close();
        }),
    };
}
/**
 * Invalidates entry points and cache when specified files change.
 *
 * @returns - Returns `true` if any entry point was invalidated, otherwise `false`.
 */
function invalidateEntryPointsAndCacheOnFileChange(graph, files, sourcesFileCache) {
    var _a, _b;
    let invalidatedEntryPoint = false;
    const allNodesToClean = new Map();
    for (const filePath of files) {
        const changedFileUrl = (0, nodes_1.fileUrl)(filePath);
        const nodeToClean = graph.find(node => changedFileUrl === node.url);
        if (!nodeToClean) {
            continue;
        }
        allNodesToClean.set(filePath, nodeToClean);
    }
    // delete node that changes
    const potentialStylesResources = new Set();
    for (const [filePath, nodeToClean] of allNodesToClean) {
        sourcesFileCache.delete(filePath);
        if (filePath.endsWith('.ts')) {
            continue;
        }
        // if a non ts file changes we need to clean up its direct dependees
        // this is mainly done for resources such as html and css
        potentialStylesResources.add(filePath);
        for (const dependees of nodeToClean.dependees) {
            const filePath = (0, nodes_1.fileUrlPath)(dependees.url);
            if (!filePath) {
                continue;
            }
            allNodesToClean.set(filePath, dependees);
            if (!filePath.endsWith('.ts')) {
                potentialStylesResources.add(filePath);
            }
        }
    }
    const entryPoints = graph.filter(nodes_1.isEntryPoint);
    for (const entryPoint of entryPoints) {
        let isDirty = false;
        if (potentialStylesResources.size > 0) {
            isDirty = !!((_b = (_a = entryPoint.cache.stylesheetProcessor) === null || _a === void 0 ? void 0 : _a.invalidate(potentialStylesResources)) === null || _b === void 0 ? void 0 : _b.length);
        }
        for (const [filePath, dependent] of allNodesToClean) {
            if (!entryPoint.dependents.has(dependent)) {
                continue;
            }
            entryPoint.cache.analysesSourcesFileCache.delete(filePath);
            isDirty = true;
        }
        if (isDirty) {
            entryPoint.state = node_1.STATE_PENDING;
            invalidatedEntryPoint = true;
        }
    }
    return invalidatedEntryPoint;
}
//# sourceMappingURL=file-watcher.js.map