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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheCompilerHost = cacheCompilerHost;
exports.augmentProgramWithVersioning = augmentProgramWithVersioning;
const crypto_1 = require("crypto");
const esbuild_1 = require("esbuild");
const node_assert_1 = __importDefault(require("node:assert"));
const path = __importStar(require("path"));
const typescript_1 = __importDefault(require("typescript"));
const node_1 = require("../graph/node");
const nodes_1 = require("../ng-package/nodes");
const log_1 = require("../utils/log");
const path_1 = require("../utils/path");
function cacheCompilerHost(graph, entryPoint, compilerOptions, moduleResolutionCache, stylesheetProcessor, inlineStyleLanguage, sourcesFileCache = entryPoint.cache.sourcesFileCache) {
    const compilerHost = typescript_1.default.createIncrementalCompilerHost(compilerOptions);
    const getNode = (fileName) => {
        const nodeUri = (0, nodes_1.fileUrl)((0, path_1.ensureUnixPath)(fileName));
        let node = graph.get(nodeUri);
        if (!node) {
            node = new node_1.Node(nodeUri);
            graph.put(node);
        }
        return node;
    };
    const addDependee = (fileName) => {
        const node = getNode(fileName);
        entryPoint.dependsOn(node);
    };
    return {
        ...compilerHost,
        // Set the parsing mode to the same as TS 5.3+ default for tsc. This provides a parse
        // performance improvement by skipping non-type related JSDoc parsing.
        jsDocParsingMode: typescript_1.default.JSDocParsingMode.ParseForTypeErrors,
        // ts specific
        getModuleResolutionCache: () => moduleResolutionCache,
        fileExists: (fileName) => {
            const cache = sourcesFileCache.getOrCreate(fileName);
            if (cache.exists === undefined) {
                cache.exists = compilerHost.fileExists.call(this, fileName);
            }
            return cache.exists;
        },
        getSourceFile: (fileName, languageVersion, onError, shouldCreateNewSourceFile, ...parameters) => {
            addDependee(fileName);
            const cache = sourcesFileCache.getOrCreate(fileName);
            if (shouldCreateNewSourceFile || !cache.sourceFile) {
                cache.sourceFile = compilerHost.getSourceFile.call(this, fileName, languageVersion, onError, true, ...parameters);
            }
            return cache.sourceFile;
        },
        writeFile: (fileName, data, writeByteOrderMark, onError, sourceFiles) => {
            var _a;
            if (fileName.includes('.ngtypecheck.')) {
                return;
            }
            const extension = path.extname(fileName);
            if (!(sourceFiles === null || sourceFiles === void 0 ? void 0 : sourceFiles.length) && extension === '.tsbuildinfo') {
                // Save builder info contents to specified location
                compilerHost.writeFile.call(this, fileName, data, writeByteOrderMark, onError, sourceFiles);
                return;
            }
            (0, node_assert_1.default)((sourceFiles === null || sourceFiles === void 0 ? void 0 : sourceFiles.length) === 1, 'Invalid TypeScript program emit for ' + fileName);
            const outputCache = entryPoint.cache.outputCache;
            if (((_a = outputCache.get(fileName)) === null || _a === void 0 ? void 0 : _a.content) === data) {
                return;
            }
            outputCache.set(fileName, {
                content: data,
                version: (0, crypto_1.createHash)('sha256').update(data).digest('hex'),
            });
        },
        readFile: (fileName) => {
            addDependee(fileName);
            const cache = sourcesFileCache.getOrCreate(fileName);
            if (cache.content === undefined) {
                cache.content = compilerHost.readFile.call(this, fileName);
            }
            return cache.content;
        },
        resourceNameToFileName: (resourceName, containingFilePath) => {
            const resourcePath = path.resolve(path.dirname(containingFilePath), resourceName);
            const containingNode = getNode(containingFilePath);
            const resourceNode = getNode(resourcePath);
            containingNode.dependsOn(resourceNode);
            return resourcePath;
        },
        readResource: async (fileName) => {
            addDependee(fileName);
            const cache = sourcesFileCache.getOrCreate(fileName);
            if (cache.content === undefined) {
                if (!compilerHost.fileExists(fileName)) {
                    throw new Error(`Cannot read file ${fileName}.`);
                }
                if (/(?:html?|svg)$/.test(path.extname(fileName))) {
                    // template
                    cache.content = compilerHost.readFile.call(this, fileName);
                }
                else {
                    // stylesheet
                    const { referencedFiles, contents, errors: esbuildErrors, warnings: esBuildWarnings, } = await stylesheetProcessor.bundleFile(fileName);
                    const node = getNode(fileName);
                    const depNodes = [...referencedFiles].map(getNode).filter(n => n !== node);
                    node.dependsOn(depNodes);
                    for (const n of node.dependees) {
                        if (n.url.endsWith('.ts')) {
                            n.dependsOn(depNodes);
                        }
                    }
                    if ((esBuildWarnings === null || esBuildWarnings === void 0 ? void 0 : esBuildWarnings.length) > 0) {
                        (await (0, esbuild_1.formatMessages)(esBuildWarnings, { kind: 'warning' })).forEach(msg => (0, log_1.warn)(msg));
                    }
                    if ((esbuildErrors === null || esbuildErrors === void 0 ? void 0 : esbuildErrors.length) > 0) {
                        (await (0, esbuild_1.formatMessages)(esbuildErrors, { kind: 'error' })).forEach(msg => (0, log_1.error)(msg));
                        throw new Error(`An error has occuried while processing ${fileName}.`);
                    }
                    return contents;
                }
                cache.exists = true;
            }
            return cache.content;
        },
        transformResource: async (data, context) => {
            const { containingFile, resourceFile, type } = context;
            if (resourceFile || type !== 'style') {
                return null;
            }
            if (inlineStyleLanguage) {
                const { contents, referencedFiles, errors: esbuildErrors, warnings: esBuildWarnings, } = await stylesheetProcessor.bundleInline(data, containingFile, containingFile.endsWith('.html') ? 'css' : inlineStyleLanguage);
                const node = getNode(containingFile);
                node.dependsOn([...referencedFiles].map(getNode));
                if ((esBuildWarnings === null || esBuildWarnings === void 0 ? void 0 : esBuildWarnings.length) > 0) {
                    (await (0, esbuild_1.formatMessages)(esBuildWarnings, { kind: 'warning' })).forEach(msg => (0, log_1.warn)(msg));
                }
                if ((esbuildErrors === null || esbuildErrors === void 0 ? void 0 : esbuildErrors.length) > 0) {
                    (await (0, esbuild_1.formatMessages)(esbuildErrors, { kind: 'error' })).forEach(msg => (0, log_1.error)(msg));
                    throw new Error(`An error has occuried while processing ${containingFile}.`);
                }
                return { content: contents };
            }
            return null;
        },
    };
}
function augmentProgramWithVersioning(program) {
    const baseGetSourceFiles = program.getSourceFiles;
    program.getSourceFiles = function (...parameters) {
        const files = baseGetSourceFiles(...parameters);
        for (const file of files) {
            if (file.version === undefined) {
                file.version = (0, crypto_1.createHash)('sha256').update(file.text).digest('hex');
            }
        }
        return files;
    };
}
//# sourceMappingURL=cache-compiler-host.js.map