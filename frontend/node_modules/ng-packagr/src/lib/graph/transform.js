"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformFromPromise = void 0;
const rxjs_1 = require("rxjs");
const transformFromPromise = (transformFn) => (0, rxjs_1.switchMap)(graph => transformFn(graph).then(r => r || graph));
exports.transformFromPromise = transformFromPromise;
//# sourceMappingURL=transform.js.map