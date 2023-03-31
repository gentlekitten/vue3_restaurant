// store.ts
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { ITabe } from './type'

export interface State {
    tabsList: Array<ITabe>
    isCollapse: Boolean
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
    state: {
        isCollapse: true,
        tabsList: []
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
    },
    getters: {
        isCollapse: state => state.isCollapse,
        tabsList: state => state.tabsList
    }
})

// 定义自己的 `useStore` 组合式函数
export function useStore() {
    return baseUseStore(key)
}