"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKey = generateKey;
exports.readCacheEntry = readCacheEntry;
exports.saveCacheEntry = saveCacheEntry;
const node_crypto_1 = require("node:crypto");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const log_1 = require("./log");
let ngPackagrVersion;
try {
    ngPackagrVersion = require('../../package.json').version;
}
catch {
    // dev path
    ngPackagrVersion = require('../../../package.json').version;
}
const BIGINT_STRING_VALUE_REGEXP = /^%BigInt\((\d+)\)$/;
async function generateKey(...valuesToConsider) {
    return (0, node_crypto_1.createHash)('sha256').update(ngPackagrVersion).update(valuesToConsider.join(':')).digest('hex');
}
async function ensureCacheDirExists(cachePath) {
    try {
        await (0, promises_1.mkdir)(cachePath, { recursive: true });
    }
    catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
}
async function readCacheEntry(cachePath, key) {
    const filePath = (0, node_path_1.join)(cachePath, key);
    try {
        const data = await (0, promises_1.readFile)(filePath, 'utf8');
        return JSON.parse(data, (_key, value) => {
            if (typeof value === 'string' && value[0] === '%') {
                const numPart = value.match(BIGINT_STRING_VALUE_REGEXP);
                if (numPart && isFinite(numPart[1])) {
                    return BigInt(numPart[1]);
                }
            }
            return value;
        });
    }
    catch (err) {
        (0, log_1.debug)(`[readCacheError]: ${err}`);
        return undefined;
    }
}
async function saveCacheEntry(cachePath, key, content) {
    const filePath = (0, node_path_1.join)(cachePath, key);
    // Ensure the cache directory exists
    await ensureCacheDirExists(cachePath);
    const data = JSON.stringify(content, (_key, value) => (typeof value === 'bigint' ? `%BigInt(${value})` : value));
    return (0, promises_1.writeFile)(filePath, data, 'utf8');
}
//# sourceMappingURL=cache.js.map