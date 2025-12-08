"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BundlerContext_instances, _BundlerContext_esbuildContext, _BundlerContext_esbuildOptions, _BundlerContext_esbuildResult, _BundlerContext_optionsFactory, _BundlerContext_shouldCacheResult, _BundlerContext_loadCache, _BundlerContext_performBundle, _BundlerContext_addErrorsToWatch;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BundlerContext = exports.BuildOutputFileType = void 0;
const esbuild_1 = require("esbuild");
const node_path_1 = require("node:path");
const load_result_cache_1 = require("./load-result-cache");
var BuildOutputFileType;
(function (BuildOutputFileType) {
    BuildOutputFileType[BuildOutputFileType["Browser"] = 0] = "Browser";
    BuildOutputFileType[BuildOutputFileType["Media"] = 1] = "Media";
    BuildOutputFileType[BuildOutputFileType["ServerApplication"] = 2] = "ServerApplication";
    BuildOutputFileType[BuildOutputFileType["ServerRoot"] = 3] = "ServerRoot";
    BuildOutputFileType[BuildOutputFileType["Root"] = 4] = "Root";
})(BuildOutputFileType || (exports.BuildOutputFileType = BuildOutputFileType = {}));
/**
 * Determines if an unknown value is an esbuild BuildFailure error object thrown by esbuild.
 * @param value A potential esbuild BuildFailure error object.
 * @returns `true` if the object is determined to be a BuildFailure object; otherwise, `false`.
 */
function isEsBuildFailure(value) {
    return !!value && typeof value === 'object' && 'errors' in value && 'warnings' in value;
}
class BundlerContext {
    constructor(workspaceRoot, incremental, options) {
        _BundlerContext_instances.add(this);
        this.workspaceRoot = workspaceRoot;
        this.incremental = incremental;
        _BundlerContext_esbuildContext.set(this, void 0);
        _BundlerContext_esbuildOptions.set(this, void 0);
        _BundlerContext_esbuildResult.set(this, void 0);
        _BundlerContext_optionsFactory.set(this, void 0);
        _BundlerContext_shouldCacheResult.set(this, void 0);
        _BundlerContext_loadCache.set(this, void 0);
        this.watchFiles = new Set();
        // To cache the results an option factory is needed to capture the full set of dependencies
        __classPrivateFieldSet(this, _BundlerContext_shouldCacheResult, incremental && typeof options === 'function', "f");
        __classPrivateFieldSet(this, _BundlerContext_optionsFactory, (...args) => {
            const baseOptions = typeof options === 'function' ? options(...args) : options;
            return {
                ...baseOptions,
                metafile: true,
                write: false,
            };
        }, "f");
    }
    /**
     * Executes the esbuild build function and normalizes the build result in the event of a
     * build failure that results in no output being generated.
     * All builds use the `write` option with a value of `false` to allow for the output files
     * build result array to be populated.
     *
     * @returns If output files are generated, the full esbuild BuildResult; if not, the
     * warnings and errors for the attempted build.
     */
    async bundle() {
        // Return existing result if present
        if (__classPrivateFieldGet(this, _BundlerContext_esbuildResult, "f")) {
            return __classPrivateFieldGet(this, _BundlerContext_esbuildResult, "f");
        }
        const result = await __classPrivateFieldGet(this, _BundlerContext_instances, "m", _BundlerContext_performBundle).call(this);
        if (__classPrivateFieldGet(this, _BundlerContext_shouldCacheResult, "f")) {
            __classPrivateFieldSet(this, _BundlerContext_esbuildResult, result, "f");
        }
        return result;
    }
    /**
     * Invalidate a stored bundler result based on the previous watch files
     * and a list of changed files.
     * The context must be created with incremental mode enabled for results
     * to be stored.
     * @returns True, if the result was invalidated; False, otherwise.
     */
    invalidate(files) {
        var _a;
        if (!this.incremental) {
            return false;
        }
        let invalid = false;
        for (const file of files) {
            if ((_a = __classPrivateFieldGet(this, _BundlerContext_loadCache, "f")) === null || _a === void 0 ? void 0 : _a.invalidate(file)) {
                invalid = true;
                continue;
            }
            invalid || (invalid = this.watchFiles.has(file));
        }
        if (invalid) {
            __classPrivateFieldSet(this, _BundlerContext_esbuildResult, undefined, "f");
        }
        return invalid;
    }
    /**
     * Disposes incremental build resources present in the context.
     *
     * @returns A promise that resolves when disposal is complete.
     */
    async dispose() {
        var _a;
        try {
            __classPrivateFieldSet(this, _BundlerContext_esbuildOptions, undefined, "f");
            __classPrivateFieldSet(this, _BundlerContext_esbuildResult, undefined, "f");
            __classPrivateFieldSet(this, _BundlerContext_loadCache, undefined, "f");
            await ((_a = __classPrivateFieldGet(this, _BundlerContext_esbuildContext, "f")) === null || _a === void 0 ? void 0 : _a.dispose());
        }
        finally {
            __classPrivateFieldSet(this, _BundlerContext_esbuildContext, undefined, "f");
        }
    }
}
exports.BundlerContext = BundlerContext;
_BundlerContext_esbuildContext = new WeakMap(), _BundlerContext_esbuildOptions = new WeakMap(), _BundlerContext_esbuildResult = new WeakMap(), _BundlerContext_optionsFactory = new WeakMap(), _BundlerContext_shouldCacheResult = new WeakMap(), _BundlerContext_loadCache = new WeakMap(), _BundlerContext_instances = new WeakSet(), _BundlerContext_performBundle = 
// eslint-disable-next-line max-lines-per-function
async function _BundlerContext_performBundle() {
    // Create esbuild options if not present
    if (__classPrivateFieldGet(this, _BundlerContext_esbuildOptions, "f") === undefined) {
        if (this.incremental) {
            __classPrivateFieldSet(this, _BundlerContext_loadCache, new load_result_cache_1.MemoryLoadResultCache(), "f");
        }
        __classPrivateFieldSet(this, _BundlerContext_esbuildOptions, __classPrivateFieldGet(this, _BundlerContext_optionsFactory, "f").call(this, __classPrivateFieldGet(this, _BundlerContext_loadCache, "f")), "f");
    }
    if (this.incremental) {
        this.watchFiles.clear();
    }
    let result;
    try {
        if (__classPrivateFieldGet(this, _BundlerContext_esbuildContext, "f")) {
            // Rebuild using the existing incremental build context
            result = await __classPrivateFieldGet(this, _BundlerContext_esbuildContext, "f").rebuild();
        }
        else if (this.incremental) {
            // Create an incremental build context and perform the first build.
            // Context creation does not perform a build.
            __classPrivateFieldSet(this, _BundlerContext_esbuildContext, await (0, esbuild_1.context)(__classPrivateFieldGet(this, _BundlerContext_esbuildOptions, "f")), "f");
            result = await __classPrivateFieldGet(this, _BundlerContext_esbuildContext, "f").rebuild();
        }
        else {
            // For non-incremental builds, perform a single build
            result = await (0, esbuild_1.build)(__classPrivateFieldGet(this, _BundlerContext_esbuildOptions, "f"));
        }
    }
    catch (failure) {
        // Build failures will throw an exception which contains errors/warnings
        if (isEsBuildFailure(failure)) {
            __classPrivateFieldGet(this, _BundlerContext_instances, "m", _BundlerContext_addErrorsToWatch).call(this, failure);
            return failure;
        }
        else {
            throw failure;
        }
    }
    finally {
        if (this.incremental) {
            // When incremental always add any files from the load result cache
            if (__classPrivateFieldGet(this, _BundlerContext_loadCache, "f")) {
                for (const file of __classPrivateFieldGet(this, _BundlerContext_loadCache, "f").watchFiles) {
                    if (!isInternalAngularFile(file)) {
                        // watch files are fully resolved paths
                        this.watchFiles.add(file);
                    }
                }
            }
        }
    }
    // Update files that should be watched.
    // While this should technically not be linked to incremental mode, incremental is only
    // currently enabled with watch mode where watch files are needed.
    if (this.incremental) {
        // Add input files except virtual angular files which do not exist on disk
        for (const input of Object.keys(result.metafile.inputs)) {
            if (!isInternalAngularFile(input)) {
                // input file paths are always relative to the workspace root
                this.watchFiles.add((0, node_path_1.join)(this.workspaceRoot, input));
            }
        }
    }
    // Return if the build encountered any errors
    if (result.errors.length) {
        __classPrivateFieldGet(this, _BundlerContext_instances, "m", _BundlerContext_addErrorsToWatch).call(this, result);
        return {
            errors: result.errors,
            warnings: result.warnings,
        };
    }
    // Return the successful build results
    return {
        ...result,
        errors: undefined,
    };
}, _BundlerContext_addErrorsToWatch = function _BundlerContext_addErrorsToWatch(result) {
    var _a, _b;
    for (const error of result.errors) {
        let file = (_a = error.location) === null || _a === void 0 ? void 0 : _a.file;
        if (file && !isInternalAngularFile(file)) {
            this.watchFiles.add((0, node_path_1.join)(this.workspaceRoot, file));
        }
        for (const note of error.notes) {
            file = (_b = note.location) === null || _b === void 0 ? void 0 : _b.file;
            if (file && !isInternalAngularFile(file)) {
                this.watchFiles.add((0, node_path_1.join)(this.workspaceRoot, file));
            }
        }
    }
};
function isInternalAngularFile(file) {
    return file.startsWith('angular:');
}
//# sourceMappingURL=bundler-context.js.map