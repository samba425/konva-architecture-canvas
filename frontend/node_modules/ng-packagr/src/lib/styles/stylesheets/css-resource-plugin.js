"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCssResourcePlugin = createCssResourcePlugin;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const load_result_cache_1 = require("../load-result-cache");
const stylesheet_processor_1 = require("../stylesheet-processor");
const CSS_RESOURCE_NAMESPACE = 'angular:css-resource';
/**
 * Symbol marker used to indicate CSS resource resolution is being attempted.
 * This is used to prevent an infinite loop within the plugin's resolve hook.
 */
const CSS_RESOURCE_RESOLUTION = Symbol('CSS_RESOURCE_RESOLUTION');
/**
 * Creates an esbuild {@link Plugin} that loads all CSS url token references using the
 * built-in esbuild `file` loader. A plugin is used to allow for all file extensions
 * and types to be supported without needing to manually specify all extensions
 * within the build configuration.
 *
 * @returns An esbuild {@link Plugin} instance.
 */
function createCssResourcePlugin(url, cache) {
    return {
        name: 'angular-css-resource',
        setup(build) {
            build.onResolve({ filter: /.*/ }, async (args) => {
                var _a;
                const { importer, path, kind, resolveDir, namespace, pluginData = {} } = args;
                // Only attempt to resolve url tokens which only exist inside CSS.
                // Also, skip this plugin if already attempting to resolve the url-token.
                if (kind !== 'url-token' || pluginData[CSS_RESOURCE_RESOLUTION]) {
                    return null;
                }
                let [containingDir, resourceUrl] = path.split('||file:', 2);
                if (resourceUrl === undefined) {
                    // This can happen due to early exit checks in rebasing-importer
                    // logic such as when the url is an external URL.
                    resourceUrl = containingDir;
                    containingDir = '';
                }
                // If root-relative, absolute or protocol relative url, mark as external to leave the
                // path/URL in place.
                if (url !== stylesheet_processor_1.CssUrl.inline || /^((?:\w+:)?\/\/|data:|chrome:|#|\/)/.test(resourceUrl)) {
                    return {
                        path: resourceUrl,
                        external: true,
                    };
                }
                pluginData[CSS_RESOURCE_RESOLUTION] = true;
                const result = await build.resolve(resourceUrl, {
                    importer,
                    kind,
                    namespace,
                    pluginData,
                    resolveDir: (0, node_path_1.join)(resolveDir, containingDir),
                });
                if (result.errors.length) {
                    const error = result.errors[0];
                    if (resourceUrl[0] === '~') {
                        error.notes = [
                            {
                                location: null,
                                text: 'You can remove the tilde and use a relative path to reference it, which should remove this error.',
                            },
                        ];
                    }
                    else if (resourceUrl[0] === '^') {
                        error.notes = [
                            {
                                location: null,
                                text: 'You can remove the caret and use a relative path to reference it, which should remove this error.',
                            },
                        ];
                    }
                    const extension = importer && (0, node_path_1.extname)(importer);
                    if (extension !== '.css') {
                        error.notes.push({
                            location: null,
                            text: 'Preprocessor stylesheets may not show the exact file location of the error.',
                        });
                    }
                }
                // Return results that are not files since these are most likely specific to another plugin
                // and cannot be loaded by this plugin.
                if (result.namespace !== 'file') {
                    return result;
                }
                // All file results are considered CSS resources and will be loaded via the file loader
                return {
                    ...result,
                    // Use a relative path to prevent fully resolved paths in the metafile (JSON stats file).
                    // This is only necessary for custom namespaces. esbuild will handle the file namespace.
                    path: (0, node_path_1.relative)((_a = build.initialOptions.absWorkingDir) !== null && _a !== void 0 ? _a : '', result.path),
                    namespace: CSS_RESOURCE_NAMESPACE,
                };
            });
            build.onLoad({ filter: /./, namespace: CSS_RESOURCE_NAMESPACE }, (0, load_result_cache_1.createCachedLoad)(cache, async (args) => {
                var _a;
                const resourcePath = (0, node_path_1.join)((_a = build.initialOptions.absWorkingDir) !== null && _a !== void 0 ? _a : '', args.path);
                return {
                    contents: await (0, promises_1.readFile)(resourcePath),
                    loader: 'dataurl',
                    watchFiles: [resourcePath],
                };
            }));
        },
    };
}
//# sourceMappingURL=css-resource-plugin.js.map