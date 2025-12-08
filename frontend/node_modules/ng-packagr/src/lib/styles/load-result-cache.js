"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MemoryLoadResultCache_loadResults, _MemoryLoadResultCache_fileDependencies;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryLoadResultCache = void 0;
exports.createCachedLoad = createCachedLoad;
const node_path_1 = require("node:path");
function createCachedLoad(cache, callback) {
    if (cache === undefined) {
        return callback;
    }
    return async (args) => {
        var _a;
        const loadCacheKey = `${args.namespace}:${args.path}`;
        let result = cache.get(loadCacheKey);
        if (result === undefined) {
            result = await callback(args);
            // Do not cache null or undefined
            if (result) {
                // Ensure requested path is included if it was a resolved file
                if (args.namespace === 'file') {
                    (_a = result.watchFiles) !== null && _a !== void 0 ? _a : (result.watchFiles = []);
                    result.watchFiles.push(args.path);
                }
                await cache.put(loadCacheKey, result);
            }
        }
        return result;
    };
}
class MemoryLoadResultCache {
    constructor() {
        _MemoryLoadResultCache_loadResults.set(this, new Map());
        _MemoryLoadResultCache_fileDependencies.set(this, new Map());
    }
    get(path) {
        return __classPrivateFieldGet(this, _MemoryLoadResultCache_loadResults, "f").get(path);
    }
    async put(path, result) {
        __classPrivateFieldGet(this, _MemoryLoadResultCache_loadResults, "f").set(path, result);
        if (result.watchFiles) {
            for (const watchFile of result.watchFiles) {
                // Normalize the watch file path to ensure OS consistent paths
                const normalizedWatchFile = (0, node_path_1.normalize)(watchFile);
                let affected = __classPrivateFieldGet(this, _MemoryLoadResultCache_fileDependencies, "f").get(normalizedWatchFile);
                if (affected === undefined) {
                    affected = new Set();
                    __classPrivateFieldGet(this, _MemoryLoadResultCache_fileDependencies, "f").set(normalizedWatchFile, affected);
                }
                affected.add(path);
            }
        }
    }
    invalidate(path) {
        const affectedPaths = __classPrivateFieldGet(this, _MemoryLoadResultCache_fileDependencies, "f").get(path);
        let found = false;
        if (affectedPaths) {
            for (const affected of affectedPaths) {
                if (__classPrivateFieldGet(this, _MemoryLoadResultCache_loadResults, "f").delete(affected)) {
                    found = true;
                }
            }
            __classPrivateFieldGet(this, _MemoryLoadResultCache_fileDependencies, "f").delete(path);
        }
        return found;
    }
    get watchFiles() {
        // this.#loadResults.keys() is not included here because the keys
        // are namespaced request paths and not disk-based file paths.
        return [...__classPrivateFieldGet(this, _MemoryLoadResultCache_fileDependencies, "f").keys()];
    }
}
exports.MemoryLoadResultCache = MemoryLoadResultCache;
_MemoryLoadResultCache_loadResults = new WeakMap(), _MemoryLoadResultCache_fileDependencies = new WeakMap();
//# sourceMappingURL=load-result-cache.js.map