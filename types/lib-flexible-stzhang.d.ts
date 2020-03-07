declare function __rem2px__(rem: string | number): string;
declare function __px2rem__(pixel: string | number): string;
interface Window {
    __rem2px__: typeof __rem2px__;
    __px2rem__: typeof __px2rem__;
}
