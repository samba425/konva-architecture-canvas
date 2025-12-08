import { Diagnostic, SourceFile } from 'typescript';
export declare class AngularDiagnosticsCache {
    #private;
    update(sourceFile: SourceFile, diagnostics: readonly Diagnostic[]): void;
    get(sourceFile: SourceFile): readonly Diagnostic[];
}
