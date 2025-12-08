"use strict";
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while (r = env.stack.pop()) {
                try {
                    if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                    }
                    else s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
var _b;
var _SassWorkerImplementation_instances, _SassWorkerImplementation_workerPool, _SassWorkerImplementation_ensureWorkerPool, _SassWorkerImplementation_createImporterChannel;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SassWorkerImplementation = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const node_url_1 = require("node:url");
const node_worker_threads_1 = require("node:worker_threads");
const worker_pool_1 = require("../worker-pool");
const maxWorkersVariable = process.env['NG_BUILD_MAX_WORKERS'];
const maxWorkers = typeof maxWorkersVariable === 'string' && maxWorkersVariable !== '' ? +maxWorkersVariable : 4;
// Polyfill Symbol.dispose if not present
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(_a = (_b = Symbol).dispose) !== null && _a !== void 0 ? _a : (_b.dispose = Symbol('Symbol Dispose'));
/**
 * The maximum number of Workers that will be created to execute render requests.
 */
const MAX_RENDER_WORKERS = maxWorkers;
/**
 * A Sass renderer implementation that provides an interface that can be used by Webpack's
 * `sass-loader`. The implementation uses a Worker thread to perform the Sass rendering
 * with the `dart-sass` package.  The `dart-sass` synchronous render function is used within
 * the worker which can be up to two times faster than the asynchronous variant.
 */
class SassWorkerImplementation {
    constructor(rebase = false, maxThreads = MAX_RENDER_WORKERS) {
        _SassWorkerImplementation_instances.add(this);
        this.rebase = rebase;
        this.maxThreads = maxThreads;
        _SassWorkerImplementation_workerPool.set(this, void 0);
    }
    /**
     * Provides information about the Sass implementation.
     * This mimics enough of the `dart-sass` value to be used with the `sass-loader`.
     */
    get info() {
        return 'dart-sass\tworker';
    }
    /**
     * The synchronous render function is not used by the `sass-loader`.
     */
    compileString() {
        throw new Error('Sass compileString is not supported.');
    }
    /**
     * Asynchronously request a Sass stylesheet to be renderered.
     *
     * @param source The contents to compile.
     * @param options The `dart-sass` options to use when rendering the stylesheet.
     */
    async compileStringAsync(source, options) {
        var _a;
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            // The `functions`, `logger` and `importer` options are JavaScript functions that cannot be transferred.
            // If any additional function options are added in the future, they must be excluded as well.
            const { functions, importers, url, logger, ...serializableOptions } = options;
            // The CLI's configuration does not use or expose the ability to define custom Sass functions
            if (functions && Object.keys(functions).length > 0) {
                throw new Error('Sass custom functions are not supported.');
            }
            const importerChannel = __addDisposableResource(env_1, (importers === null || importers === void 0 ? void 0 : importers.length) ? __classPrivateFieldGet(this, _SassWorkerImplementation_instances, "m", _SassWorkerImplementation_createImporterChannel).call(this, importers) : undefined, false);
            const response = (await __classPrivateFieldGet(this, _SassWorkerImplementation_instances, "m", _SassWorkerImplementation_ensureWorkerPool).call(this).run({
                source,
                importerChannel,
                hasLogger: !!logger,
                rebase: this.rebase,
                options: {
                    ...serializableOptions,
                    // URL is not serializable so to convert to string here and back to URL in the worker.
                    url: url ? (0, node_url_1.fileURLToPath)(url) : undefined,
                },
            }, {
                transferList: importerChannel ? [importerChannel.port] : undefined,
            }));
            const { result, error, warnings } = response;
            if (warnings && (logger === null || logger === void 0 ? void 0 : logger.warn)) {
                for (const { message, span, ...options } of warnings) {
                    logger.warn(message, {
                        ...options,
                        span: span && {
                            ...span,
                            url: span.url ? (0, node_url_1.pathToFileURL)(span.url) : undefined,
                        },
                    });
                }
            }
            if (error) {
                // Convert stringified url value required for cloning back to a URL object
                const url = (_a = error.span) === null || _a === void 0 ? void 0 : _a.url;
                if (url) {
                    error.span.url = (0, node_url_1.pathToFileURL)(url);
                }
                throw error;
            }
            (0, node_assert_1.default)(result, 'Sass render worker should always return a result or an error');
            return {
                ...result,
                // URL is not serializable so in the worker we convert to string and here back to URL.
                loadedUrls: result.loadedUrls.map((p) => (0, node_url_1.pathToFileURL)(p)),
            };
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            __disposeResources(env_1);
        }
    }
    /**
     * Shutdown the Sass render worker.
     * Executing this method will stop any pending render requests.
     * @returns A void promise that resolves when closing is complete.
     */
    async close() {
        if (__classPrivateFieldGet(this, _SassWorkerImplementation_workerPool, "f")) {
            try {
                await __classPrivateFieldGet(this, _SassWorkerImplementation_workerPool, "f").destroy();
            }
            finally {
                __classPrivateFieldSet(this, _SassWorkerImplementation_workerPool, undefined, "f");
            }
        }
    }
    async processImporters(importers, url, options) {
        for (const importer of importers) {
            if (!this.isFileImporter(importer)) {
                // Importer
                throw new Error('Only File Importers are supported.');
            }
            // File importer (Can be sync or aync).
            const result = await importer.findFileUrl(url, options);
            if (result) {
                return (0, node_url_1.fileURLToPath)(result);
            }
        }
        return null;
    }
    isFileImporter(value) {
        return 'findFileUrl' in value;
    }
}
exports.SassWorkerImplementation = SassWorkerImplementation;
_SassWorkerImplementation_workerPool = new WeakMap(), _SassWorkerImplementation_instances = new WeakSet(), _SassWorkerImplementation_ensureWorkerPool = function _SassWorkerImplementation_ensureWorkerPool() {
    var _a;
    __classPrivateFieldSet(this, _SassWorkerImplementation_workerPool, (_a = __classPrivateFieldGet(this, _SassWorkerImplementation_workerPool, "f")) !== null && _a !== void 0 ? _a : new worker_pool_1.WorkerPool({
        filename: require.resolve('./worker'),
        maxThreads: this.maxThreads,
    }), "f");
    return __classPrivateFieldGet(this, _SassWorkerImplementation_workerPool, "f");
}, _SassWorkerImplementation_createImporterChannel = function _SassWorkerImplementation_createImporterChannel(importers) {
    const { port1: mainImporterPort, port2: workerImporterPort } = new node_worker_threads_1.MessageChannel();
    const importerSignal = new Int32Array(new SharedArrayBuffer(4));
    mainImporterPort.on('message', ({ url, options }) => {
        this.processImporters(importers, url, {
            ...options,
            // URL is not serializable so in the worker we convert to string and here back to URL.
            containingUrl: options.containingUrl
                ? (0, node_url_1.pathToFileURL)(options.containingUrl)
                : null,
        })
            .then((result) => {
            mainImporterPort.postMessage(result);
        })
            .catch((error) => {
            mainImporterPort.postMessage(error);
        })
            .finally(() => {
            Atomics.store(importerSignal, 0, 1);
            Atomics.notify(importerSignal, 0);
        });
    });
    mainImporterPort.unref();
    return {
        port: workerImporterPort,
        signal: importerSignal,
        [Symbol.dispose]() {
            mainImporterPort.close();
        },
    };
};
//# sourceMappingURL=sass-service.js.map