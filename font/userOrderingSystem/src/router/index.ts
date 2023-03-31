import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('@/views/home/index.vue')
    },
    {
        path: '/orderInfo',
        component: () => import('@/views/orderInfo/index.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router