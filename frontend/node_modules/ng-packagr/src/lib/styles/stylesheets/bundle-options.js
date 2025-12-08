"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CssUrl = void 0;
exports.createStylesheetBundleOptions = createStylesheetBundleOptions;
const node_path_1 = __importDefault(require("node:path"));
const css_language_1 = require("./css-language");
const css_resource_plugin_1 = require("./css-resource-plugin");
const less_language_1 = require("./less-language");
const sass_language_1 = require("./sass-language");
const stylesheet_plugin_factory_1 = require("./stylesheet-plugin-factory");
var CssUrl;
(function (CssUrl) {
    CssUrl["inline"] = "inline";
    CssUrl["none"] = "none";
})(CssUrl || (exports.CssUrl = CssUrl = {}));
function createStylesheetBundleOptions(options, cache, inlineComponentData) {
    var _a;
    // Ensure preprocessor include paths are absolute based on the workspace root
    const includePaths = (_a = options.includePaths) === null || _a === void 0 ? void 0 : _a.map(includePath => node_path_1.default.resolve(options.workspaceRoot, includePath));
    const pluginFactory = new stylesheet_plugin_factory_1.StylesheetPluginFactory({
        sourcemap: false,
        includePaths,
        inlineComponentData,
        tailwindConfiguration: options.tailwindConfiguration,
        postcssConfiguration: options.postcssConfiguration,
        sass: options.sass,
    }, cache);
    const plugins = [
        pluginFactory.create(sass_language_1.SassStylesheetLanguage),
        pluginFactory.create(less_language_1.LessStylesheetLanguage),
        pluginFactory.create(css_language_1.CssStylesheetLanguage),
        (0, css_resource_plugin_1.createCssResourcePlugin)(options.cssUrl, cache),
    ];
    return {
        absWorkingDir: options.workspaceRoot,
        bundle: true,
        logLevel: 'silent',
        minify: true,
        metafile: true,
        sourcemap: false,
        outdir: options.workspaceRoot,
        write: false,
        platform: 'browser',
        target: options.target,
        conditions: ['style', 'sass', 'less', 'production'],
        mainFields: ['style', 'sass'],
        // Unlike JS, CSS does not have implicit file extensions in the general case.
        // Preprocessor specific behavior is handled in each stylesheet language plugin.
        resolveExtensions: [],
        plugins,
        // Angular encapsulation does not support nesting
        // See: https://github.com/angular/angular/issues/58996
        supported: {
            nesting: false,
        },
    };
}
//# sourceMappingURL=bundle-options.js.map