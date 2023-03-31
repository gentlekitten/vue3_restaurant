import router from './router/index'
import Layout from '@/layout/index.vue'
import { store } from './store'
import NProgress from 'nprogress'
import { useRoute } from 'vue-router'
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start()
    const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user') as any) : ''
    if (to.path === '/login' || to.path === '/register') {
        next()
    } else {
        if (user) {
            const routes = store.getters.routes.length > 0 ? store.getters.routes : ''
            if (!routes) {
                const accessRoutes = await store.dispatch('generateRoutes', 'admin')
                router.options.routes.push(...accessRoutes)
                accessRoutes.forEach((item: any) => {
                    router.addRoute(item)
                })
                // console.log(router.getRoutes())
                next({ ...to, replace: true })
                return
            }
            next()
            return
        }
        next('/login')
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})
