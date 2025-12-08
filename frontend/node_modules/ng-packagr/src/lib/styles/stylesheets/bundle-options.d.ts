import type { BuildOptions } from 'esbuild';
import { LoadResultCache } from '../load-result-cache';
import { PostcssConfiguration } from '../postcss-configuration';
import { StylesheetPluginsass } from './stylesheet-plugin-factory';
export declare enum CssUrl {
    inline = "inline",
    none = "none"
}
export interface BundleStylesheetOptions {
    workspaceRoot: string;
    includePaths?: string[];
    cssUrl: CssUrl;
    sass?: StylesheetPluginsass;
    target: string[];
    tailwindConfiguration?: {
        file: string;
        package: string;
    };
    postcssConfiguration?: PostcssConfiguration;
    cacheDirectory?: string | false;
}
export declare function createStylesheetBundleOptions(options: BundleStylesheetOptions, cache?: LoadResultCache, inlineComponentData?: Record<string, string>): BuildOptions & {
    plugins: NonNullable<BuildOptions['plugins']>;
};
