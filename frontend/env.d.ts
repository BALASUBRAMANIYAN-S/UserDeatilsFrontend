/// <reference types="vite/client" />
/// <reference types="vite-plugin-vue-layouts-next/client" />
// /// <reference types="unplugin-vue-router/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module 'virtual:generated-layouts' {
    import { RouteRecordRaw } from 'vue-router'
    export function setupLayouts(routes: RouteRecordRaw[]): RouteRecordRaw[]
}
