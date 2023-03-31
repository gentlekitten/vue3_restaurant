import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Layout from '@/layout/index.vue'

export const constantRoutes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue')
    },
    {
        path: '/updatePassword',
        name: 'UpdatePassword',
        component: () => import('@/views/updatePassword/index.vue')
    },
    // {
    //     path: '/',
    //     component: Layout,
    //     redirect: '/',
    //     meta: {
    //         title: '欢迎界面',
    //         icon: 'HelpFilled'
    //     },
    //     children: [
    //         {
    //             path: '/',
    //             component: () => import('@/views/home/index.vue'),
    //             meta: {
    //                 title: '首页',
    //                 icon: 'HomeFilled'
    //             },
    //         },
    //     ]
    // },
    {
        path: '/',
        component: Layout,
        redirect: '/',
        name: 'Home',
        meta: {
            title: '首页',
            icon: 'HomeFilled'
        },
        children: [
            {
                path: '/',
                meta: {
                    title: '首页',
                    role: ['admin', 'user'],
                    icon: 'Histogram'
                },
                component: () => import('@/views/dataAnalysis/index.vue'),
            }
        ]
    },
]

export const asyncRoutes: Array<RouteRecordRaw> = [
    {
        path: '/runningWater',
        component: Layout,
        name: 'RunningWater',
        redirect: '/runningWater',
        meta: {
            title: '餐厅流水',
            icon: 'Histogram'
        },
        children: [
            {
                path: '/runningWater',
                meta: {
                    title: '餐厅流水',
                    role: ['admin', 'user'],
                    icon: 'Histogram'
                },
                component: () => import('@/views/runningWater/index.vue'),
            }
        ]
    },
    {
        path: '/addGoods',
        name: 'AddGoods',
        component: Layout,
        redirect: '/addGoods',
        meta: {
            title: '商品管理',
            icon: 'Shop'
        },
        children: [
            {
                path: '/addGoods',
                meta: {
                    title: '添加商品',
                    role: ['admin', 'user'],
                    icon: 'CirclePlusFilled'
                },
                component: () => import('@/views/addGoods/index.vue'),
            },
            {
                path: '/addCategory',
                meta: {
                    title: '添加商品类别',
                    role: ['admin', 'user'],
                    icon: 'GoodsFilled'
                },
                component: () => import('@/views/addCategory/index.vue'),
            },
            {
                path: '/goodsList',
                meta: {
                    title: '商品列表',
                    role: ['admin', 'user'],
                    icon: 'List'
                },
                component: () => import('@/views/goodsList/index.vue'),
            }
        ]
    },
    {
        path: '/addMember',
        component: Layout,
        name: 'AddMember',
        redirect: '/addMember',
        meta: {
            title: '会员管理',
            icon: 'Avatar'
        },
        children: [
            {
                path: '/addMember',
                meta: {
                    title: '添加会员',
                    icon: 'CirclePlusFilled',
                    role: ['admin', 'user'],
                },
                component: () => import('@/views/addMember/index.vue'),
            },
            {
                path: '/memberList',
                meta: {
                    title: '会员列表',
                    role: ['admin', 'user'],
                    icon: 'Stamp'
                },
                component: () => import('@/views/memberList/index.vue'),
            }
        ]
    },
    {
        path: '/addDiscount',
        component: Layout,
        name: 'AddDiscount',
        redirect: '/addDiscount',
        meta: {
            title: '优惠管理',
            icon: 'GoodsFilled'
        },
        children: [
            {
                path: '/addDiscount',
                meta: {
                    title: '添加优惠',
                    role: ['admin', 'user'],
                    icon: 'CirclePlusFilled'
                },
                component: () => import('@/views/addDiscount/index.vue'),
            },
            {
                path: '/discountList',
                meta: {
                    title: '优惠列表',
                    role: ['admin'],
                    icon: 'Ticket'
                },
                component: () => import('@/views/discountList/index.vue'),
            }
        ]
    },
    {
        path: '/404',
        name: '404',
        component: Layout,
        children: [
            {
                path: '/404',
                meta: {
                    title: '404',
                    role: ['admin', 'user'],
                },
                component: () => import('@/views/404/index.vue'),
            }
        ]
    },
    {
        path: '/:pathMatch(.*)',
        redirect: '/404'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes
})
// const createRouter = () => new createRouter({
//     // mode: 'history', // require service support
//     scrollBehavior: () => ({ y: 0 }),
//     routes: constantRoutes
// })
// const router = createRouter()
// 重置路由
export function resetRouter() {
    const newRouter = router
    // router.matcher = newRouter.matcher // reset router
}

export default router