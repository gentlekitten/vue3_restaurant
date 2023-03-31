
// store.ts
import { useRouter } from 'vue-router'
import axios from 'axios'
import Module from 'module'
import { ITabe } from '../type'

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
    namespaced: Boolean,
    state: {
        routes: []
        addRoutes: []
    },
    mutations: any,
    actions: any
}

const permission: State = {
    namespaced: true,
    state: {
        routes: [],
        addRoutes: []
    },
    mutations: {
        SET_ROUTES: (state: any, routes: any) => {
            state.addRoutes = routes
            // state.routes = constantRoutes.concat(routes)
        }
    },
    actions: {
        generateRoutes({ commit }: any, roles: any) {
            const router = useRouter()
            const asyncRoutes = router.getRoutes()
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
    }
}
export default {
    permission
}