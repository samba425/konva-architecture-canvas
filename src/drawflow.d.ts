declare module 'drawflow' {
  export default class Drawflow {
    constructor(container: HTMLElement, render?: any, parent?: any);
    reroute: boolean;
    reroute_fix_curvature: boolean;
    force_first_input: boolean;
    start(): void;
    addNode(
      name: string,
      inputs: number,
      outputs: number,
      posX: number,
      posY: number,
      className: string,
      data: any,
      html: string
    ): number;
    export(): any;
    import(data: any): void;
    clear(): void;
    zoom_in(): void;
    zoom_out(): void;
    zoom_reset(): void;
  }
}
