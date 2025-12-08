"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _ComponentStylesheetBundler_fileContexts, _ComponentStylesheetBundler_inlineContexts;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentStylesheetBundler = void 0;
const node_crypto_1 = require("node:crypto");
const node_path_1 = __importDefault(require("node:path"));
const bundler_context_1 = require("./bundler-context");
const cache_1 = require("./cache");
const bundle_options_1 = require("./stylesheets/bundle-options");
/**
 * Bundles component stylesheets. A stylesheet can be either an inline stylesheet that
 * is contained within the Component's metadata definition or an external file referenced
 * from the Component's metadata definition.
 */
class ComponentStylesheetBundler {
    /**
     *
     * @param options An object containing the stylesheet bundling options.
     * @param cache A load result cache to use when bundling.
     */
    constructor(options, defaultInlineLanguage, incremental) {
        this.options = options;
        this.defaultInlineLanguage = defaultInlineLanguage;
        this.incremental = incremental;
        _ComponentStylesheetBundler_fileContexts.set(this, new cache_1.MemoryCache());
        _ComponentStylesheetBundler_inlineContexts.set(this, new cache_1.MemoryCache());
    }
    async bundleFile(entry) {
        const bundlerContext = await __classPrivateFieldGet(this, _ComponentStylesheetBundler_fileContexts, "f").getOrCreate(entry, () => {
            return new bundler_context_1.BundlerContext(this.options.workspaceRoot, this.incremental, loadCache => {
                const buildOptions = (0, bundle_options_1.createStylesheetBundleOptions)(this.options, loadCache);
                buildOptions.entryPoints = [entry];
                return buildOptions;
            });
        });
        return this.extractResult(await bundlerContext.bundle(), bundlerContext.watchFiles);
    }
    async bundleInline(data, filename, language = this.defaultInlineLanguage) {
        // Use a hash of the inline stylesheet content to ensure a consistent identifier. External stylesheets will resolve
        // to the actual stylesheet file path.
        // TODO: Consider xxhash instead for hashing
        const id = (0, node_crypto_1.createHash)('sha256')
            .update(data)
            .digest('hex');
        const entry = [language, id, filename].join(';');
        const bundlerContext = await __classPrivateFieldGet(this, _ComponentStylesheetBundler_inlineContexts, "f").getOrCreate(entry, () => {
            const namespace = 'angular:styles/component';
            return new bundler_context_1.BundlerContext(this.options.workspaceRoot, this.incremental, loadCache => {
                const buildOptions = (0, bundle_options_1.createStylesheetBundleOptions)(this.options, loadCache, {
                    [entry]: data,
                });
                buildOptions.entryPoints = [`${namespace};${entry}`];
                buildOptions.plugins.push({
                    name: 'angular-component-styles',
                    setup(build) {
                        build.onResolve({ filter: /^angular:styles\/component;/ }, args => {
                            if (args.kind !== 'entry-point') {
                                return null;
                            }
                            return {
                                path: entry,
                                namespace,
                            };
                        });
                        build.onLoad({ filter: /^css;/, namespace }, () => {
                            return {
                                contents: data,
                                loader: 'css',
                                resolveDir: node_path_1.default.dirname(filename),
                            };
                        });
                    },
                });
                return buildOptions;
            });
        });
        // Extract the result of the bundling from the output files
        return this.extractResult(await bundlerContext.bundle(), bundlerContext.watchFiles);
    }
    /**
     * Invalidates both file and inline based component style bundling state for a set of modified files.
     * @param files The group of files that have been modified
     * @returns An array of file based stylesheet entries if any were invalidated; otherwise, undefined.
     */
    invalidate(files) {
        if (!this.incremental) {
            return;
        }
        const normalizedFiles = [...files].map(node_path_1.default.normalize);
        let entries;
        for (const [entry, bundler] of __classPrivateFieldGet(this, _ComponentStylesheetBundler_fileContexts, "f").entries()) {
            if (bundler.invalidate(normalizedFiles)) {
                entries !== null && entries !== void 0 ? entries : (entries = []);
                entries.push(entry);
            }
        }
        for (const bundler of __classPrivateFieldGet(this, _ComponentStylesheetBundler_inlineContexts, "f").values()) {
            bundler.invalidate(normalizedFiles);
        }
        return entries;
    }
    async dispose() {
        const contexts = [...__classPrivateFieldGet(this, _ComponentStylesheetBundler_fileContexts, "f").values(), ...__classPrivateFieldGet(this, _ComponentStylesheetBundler_inlineContexts, "f").values()];
        __classPrivateFieldGet(this, _ComponentStylesheetBundler_fileContexts, "f").clear();
        __classPrivateFieldGet(this, _ComponentStylesheetBundler_inlineContexts, "f").clear();
        await Promise.allSettled(contexts.map(context => context.dispose()));
    }
    extractResult(result, referencedFiles) {
        let contents = '';
        let metafile;
        const outputFiles = [];
        if ('outputFiles' in result) {
            for (const outputFile of result.outputFiles) {
                const filename = node_path_1.default.basename(outputFile.path);
                if (outputFile.type === bundler_context_1.BuildOutputFileType.Media || filename.endsWith('.css.map')) {
                    // The output files could also contain resources (images/fonts/etc.) that were referenced and the map files.
                    // Clone the output file to avoid amending the original path which would causes problems during rebuild.
                    const clonedOutputFile = outputFile.clone();
                    // Needed for Bazel as otherwise the files will not be written in the correct place,
                    // this is because esbuild will resolve the output file from the outdir which is currently set to `workspaceRoot` twice,
                    // once in the stylesheet and the other in the application code bundler.
                    // Ex: `../../../../../app.component.css.map`.
                    clonedOutputFile.path = node_path_1.default.join(this.options.workspaceRoot, outputFile.path);
                    outputFiles.push(clonedOutputFile);
                }
                else if (filename.endsWith('.css')) {
                    contents = outputFile.text;
                }
                else {
                    throw new Error(`Unexpected non CSS/Media file "${filename}" outputted during component stylesheet processing.`);
                }
            }
            metafile = result.metafile;
        }
        return {
            errors: result.errors,
            warnings: result.warnings,
            contents,
            outputFiles,
            metafile,
            referencedFiles,
        };
    }
}
exports.ComponentStylesheetBundler = ComponentStylesheetBundler;
_ComponentStylesheetBundler_fileContexts = new WeakMap(), _ComponentStylesheetBundler_inlineContexts = new WeakMap();
//# sourceMappingURL=component-stylesheets.js.map