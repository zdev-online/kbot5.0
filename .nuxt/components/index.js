export { default as Foot } from '../..\\client\\components\\foot.vue'
export { default as Sidebar } from '../..\\client\\components\\sidebar.vue'

export const LazyFoot = import('../..\\client\\components\\foot.vue' /* webpackChunkName: "components_foot" */).then(c => c.default || c)
export const LazySidebar = import('../..\\client\\components\\sidebar.vue' /* webpackChunkName: "components_sidebar" */).then(c => c.default || c)
