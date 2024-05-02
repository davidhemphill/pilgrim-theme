declare module "@docsearch/js" {
    function docsearch<T = any>(props: T): void;
    export default docsearch;
}

declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}
