"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildGraph = void 0;
const nodes_1 = require("../ng-package/nodes");
/**
 * A tree of source files. Eventually, it's a graph. Ideally, it's an acyclic directed graph.
 * Technically, it's implemented as a map-like collection with references between map entries.
 */
class BuildGraph {
    constructor() {
        this.store = new Map();
    }
    put(value) {
        if (value instanceof Array) {
            for (const node of value) {
                this.insert(node);
            }
        }
        else {
            this.insert(value);
        }
        return this;
    }
    insert(node) {
        if (this.store.has(node.url)) {
            // Clean up dependee references
            const oldNode = this.store.get(node.url);
            oldNode['_dependees'].delete(oldNode);
        }
        if (this.watcher) {
            const fileUrl = (0, nodes_1.fileUrlPath)(node.url);
            if (fileUrl) {
                this.watcher.add(fileUrl);
            }
        }
        this.store.set(node.url, node);
    }
    get(url) {
        return this.store.get(url);
    }
    has(url) {
        return this.store.has(url);
    }
    entries() {
        return Array.from(this.store.values());
    }
    values() {
        return this.store.values();
    }
    some(by) {
        for (const node of this.store.values()) {
            if (by(node)) {
                return true;
            }
        }
        return false;
    }
    filter(by) {
        const result = [];
        for (const node of this.store.values()) {
            if (by(node)) {
                result.push(node);
            }
        }
        return result;
    }
    find(by) {
        for (const node of this.store.values()) {
            if (by(node)) {
                return node;
            }
        }
        return undefined;
    }
    get size() {
        return this.store.size;
    }
}
exports.BuildGraph = BuildGraph;
//# sourceMappingURL=build-graph.js.map