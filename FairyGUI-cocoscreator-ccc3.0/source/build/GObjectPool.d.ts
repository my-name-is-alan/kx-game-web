import { GObject } from "./GObject";
export declare class GObjectPool {
    private _pool;
    private _count;
    constructor();
    clear(): void;
    get count(): number;
    getObject(url: string): GObject;
    returnObject(obj: GObject): void;
    /** Iterate objects currently hidden in the pool without removing them. */
    scanAll(callback: (obj: GObject) => void): void;
}
