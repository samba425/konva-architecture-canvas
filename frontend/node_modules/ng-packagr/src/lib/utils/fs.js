"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rmdir = exports.stat = exports.mkdir = exports.access = exports.writeFile = exports.readFile = void 0;
exports.exists = exists;
exports.copyFile = copyFile;
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
var promises_2 = require("node:fs/promises");
Object.defineProperty(exports, "readFile", { enumerable: true, get: function () { return promises_2.readFile; } });
Object.defineProperty(exports, "writeFile", { enumerable: true, get: function () { return promises_2.writeFile; } });
Object.defineProperty(exports, "access", { enumerable: true, get: function () { return promises_2.access; } });
Object.defineProperty(exports, "mkdir", { enumerable: true, get: function () { return promises_2.mkdir; } });
Object.defineProperty(exports, "stat", { enumerable: true, get: function () { return promises_2.stat; } });
Object.defineProperty(exports, "rmdir", { enumerable: true, get: function () { return promises_2.rm; } });
async function exists(path) {
    try {
        await (0, promises_1.access)(path, node_fs_1.constants.F_OK);
        return true;
    }
    catch {
        return false;
    }
}
async function copyFile(src, dest) {
    const dir = (0, node_path_1.dirname)(dest);
    if (!(await exists(dir))) {
        await (0, promises_1.mkdir)(dir, { recursive: true });
    }
    await (0, promises_1.copyFile)(src, dest, node_fs_1.constants.COPYFILE_FICLONE);
}
//# sourceMappingURL=fs.js.map