import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Layout from '@/layout/Index.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/goodsList'
    },
    {
        path: '/login',
        component: () => import('@/views/login/index.vue')
    },
    // {
    //     path: '/home',
    //     component: Layout,
    //     redirect: '/home',
    //     children: [
    //         {
    //             path: '/home',
    //             component: () => import('@/views/home/index.vue'),
    //             meta: {
    //                 title: '首页',
    //                 icon: 'HomeFilled',
    //                 keepAlive: false
    //             },
    //         }
    //     ]
    // },
    {
        path: '/goodsList',
        component: Layout,
        redirect: '/goodsList',
        children: [
            {
                path: '/goodsList',
                component: () => import('@/views/goodsList/index.vue'),
                meta: {
                    title: '点餐',
                    icon: 'Shop',
                    keepAlive: true
                }
            }
        ]
    },
    {
        path: '/member',
        component: Layout,
        redirect: '/member',
        children: [
            {
                path: '/member',
                component: () => import('@/views/member/index.vue'),
                meta: {
                    title: '会员',
                    icon: 'Stamp',
                    keepAlive: true
                }
            }
        ]
    },
    {
        path: '/order',
        component: Layout,
        redirect: '/order',
        children: [
            {
                path: '/order',
                component: () => import('@/views/order/index.vue'),
                meta: {
                    title: '订单',
                    icon: 'List',
                    keepAlive: true
                }
            }
        ]
    },
    {
        path: '/setting',
        component: Layout,
        redirect: '/setting',
        children: [
            {
                path: '/setting',
                component: () => import('@/views/setting/index.vue'),
                meta: {
                    title: '退出',
                    icon: 'HelpFilled',
                    keepAlive: false
                }
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router