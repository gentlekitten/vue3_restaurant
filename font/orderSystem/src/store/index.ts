// store.ts
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { ITabe } from './type'
import { asyncRoutes, constantRoutes } from '@/router'


/* @param roles
 * @param route
 */
function hasPermission(roles: any, route: any) {
    if (route.meta && route.meta.role) {
        if (roles instanceof Array) {
            return roles.some(role => route.meta.role.indexOf(role) >= 0)
        }
        return route.meta.role.indexOf(roles) >= 0
    } else {
        return true
    }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */

export function filterAsyncRoutes(routes: any, roles: any) {
    const res = [] as any

    routes.forEach((route: any) => {
        const tmp = { ...route }
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })

    return res
}

export interface State {
    tabsList: Array<ITabe>
    isCollapse: Boolean
    routes: []
    addRoutes: []
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
    state: {
        isCollapse: true,
        tabsList: [],
        routes: [],
        addRoutes: []
    },
    mutations: {
        CHANGE_COLLAPSE(state: State, isCollapse: Boolean) {
            state.isCollapse = isCollapse
        },
        ADD_TABS(state: State, tab: ITabe) {
            // 判断是否存在
            if (state.tabsList.some(item => item.path === tab.path)) return
            state.tabsList.push(tab)
        },
        SET_TABS(state: State, tabs: Array<ITabe>) {
            state.tabsList = tabs
        },
        SET_ROUTES: (state: any, routes: any) => {
            state.addRoutes = routes
            state.routes = constantRoutes.concat(routes)
        }
    },
    actions: {
        generateRoutes({ commit }: any, roles: any) {
            return new Promise(resolve => {
                let accessedRoutes
                if (roles === 'admin') {
                    accessedRoutes = asyncRoutes || []
                } else {
                    accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
                }
                commit('SET_ROUTES', accessedRoutes)
                resolve(accessedRoutes)
            })
        }
    },
    getters: {
        isCollapse: state => state.isCollapse,
        tabsList: state => state.tabsList,
        routes: state => state.routes
    }
})

// 定义自己的 `useStore` 组合式函数
export function useStore() {
    return baseUseStore(key)
}