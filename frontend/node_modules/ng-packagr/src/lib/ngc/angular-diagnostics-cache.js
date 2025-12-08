"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AngularDiagnosticsCache_cache;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AngularDiagnosticsCache = void 0;
class AngularDiagnosticsCache {
    constructor() {
        _AngularDiagnosticsCache_cache.set(this, new Map());
    }
    update(sourceFile, diagnostics) {
        __classPrivateFieldGet(this, _AngularDiagnosticsCache_cache, "f").set(sourceFile.fileName, diagnostics);
    }
    get(sourceFile) {
        var _a;
        return (_a = __classPrivateFieldGet(this, _AngularDiagnosticsCache_cache, "f").get(sourceFile.fileName)) !== null && _a !== void 0 ? _a : [];
    }
}
exports.AngularDiagnosticsCache = AngularDiagnosticsCache;
_AngularDiagnosticsCache_cache = new WeakMap();
//# sourceMappingURL=angular-diagnostics-cache.js.map