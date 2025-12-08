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
exports.fileLoaderPlugin = fileLoaderPlugin;
const node_path_1 = require("node:path");
const log = __importStar(require("../utils/log"));
const path_1 = require("../utils/path");
/**
 * Loads a file and it's map.
 */
function fileLoaderPlugin(fileCache, resolutionExtensions) {
    return {
        name: 'file-loader',
        resolveId: function (id, importer) {
            if (fileCache.has((0, path_1.ensureUnixPath)(id))) {
                return id;
            }
            if (!importer) {
                return;
            }
            const resolved = (0, path_1.ensureUnixPath)((0, node_path_1.resolve)((0, node_path_1.dirname)(importer), id));
            if (fileCache.has(resolved)) {
                return resolved;
            }
            for (const suffix of resolutionExtensions) {
                const potential = resolved + suffix;
                if (fileCache.has(potential)) {
                    return potential;
                }
            }
        },
        load: function (id) {
            var _a;
            log.debug(`file-loader ${id}`);
            const idPosix = (0, path_1.ensureUnixPath)(id);
            const data = fileCache.get(idPosix);
            if (!data) {
                throw new Error(`Could not load '${id}' from memory.`);
            }
            return {
                code: data.content,
                map: (_a = fileCache.get(`${idPosix}.map`)) === null || _a === void 0 ? void 0 : _a.content,
            };
        },
    };
}
//# sourceMappingURL=file-loader-plugin.js.map