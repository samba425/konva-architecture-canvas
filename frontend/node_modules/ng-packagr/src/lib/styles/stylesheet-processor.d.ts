import { NgPackageEntryConfig } from '../../ng-entrypoint.schema';
import { ComponentStylesheetBundler } from './component-stylesheets';
export declare enum CssUrl {
    inline = "inline",
    none = "none"
}
export declare class StylesheetProcessor extends ComponentStylesheetBundler {
    protected readonly projectBasePath: string;
    protected readonly basePath: string;
    protected readonly cssUrl?: CssUrl;
    protected readonly includePaths?: string[];
    protected readonly sass?: NgPackageEntryConfig['lib']['sass'];
    protected readonly cacheDirectory?: string | false;
    protected readonly watch?: boolean;
    constructor(projectBasePath: string, basePath: string, cssUrl?: CssUrl, includePaths?: string[], sass?: NgPackageEntryConfig['lib']['sass'], cacheDirectory?: string | false, watch?: boolean);
    destroy(): void;
}
